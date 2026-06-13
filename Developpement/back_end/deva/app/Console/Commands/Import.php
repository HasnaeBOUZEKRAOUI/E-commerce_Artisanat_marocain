<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\Categorie;
use App\Models\Produit;
use App\Models\Image;
use App\Models\Artisan;
use App\Models\Utilisateur;

class Import extends Command
{
    protected $signature = 'my:import
                            {--collection=all : slug de collection MyTindy (ex: moroccan-rugs)}
                            {--pages=3 : nombre de pages à importer (250 produits/page max)}
                            {--dry-run : affiche sans insérer en base}';

    protected $description = 'Importe les produits MyTindy.com (API Shopify publique) dans la base de données';

    const BASE = 'https://mytindy.com';

    const COLLECTION_MAP = [
        'moroccan-rugs'              => ['nom' => 'Tapis',             'slug' => 'tapis'],
        'candles'                    => ['nom' => 'Bougies',           'slug' => 'bougies'],
        'pillowcases'                => ['nom' => 'Coussins',          'slug' => 'coussins'],
        'pottery-pots'               => ['nom' => 'Poterie',           'slug' => 'poterie'],
        'lamps-lampshades'           => ['nom' => 'Lampes',            'slug' => 'lampes'],
        'womens-jewelry'             => ['nom' => 'Bijoux Femme',      'slug' => 'bijoux-femme'],
        'mens-jewelry'               => ['nom' => 'Bijoux Homme',      'slug' => 'bijoux-homme'],
        'womens-bags'                => ['nom' => 'Sacs Femme',        'slug' => 'sacs-femme'],
        'moroccan-leather-pouf'      => ['nom' => 'Poufs',             'slug' => 'poufs'],
        'moroccan-handmade-blankets' => ['nom' => 'Couvertures',       'slug' => 'couvertures'],
        'body-care'                  => ['nom' => 'Soins Corps',       'slug' => 'soins-corps'],
        'hair-care'                  => ['nom' => 'Soins Cheveux',     'slug' => 'soins-cheveux'],
        'home-fragrance'             => ['nom' => 'Parfum Maison',     'slug' => 'parfum-maison'],
        'mirrors'                    => ['nom' => 'Miroirs',           'slug' => 'miroirs'],
        'tagines'                    => ['nom' => 'Tajines',           'slug' => 'tajines'],
        'honey'                      => ['nom' => 'Miel',              'slug' => 'miel'],
        'culinary-oils'              => ['nom' => 'Huiles Culinaires', 'slug' => 'huiles-culinaires'],
    ];

    public function handle(): void
    {
        $collection = $this->option('collection');
        $maxPages   = (int) $this->option('pages');
        $dryRun     = $this->option('dry-run');

        $this->info("🇲🇦 Import MyTindy — collection: {$collection} | pages: {$maxPages}" . ($dryRun ? ' [DRY RUN]' : ''));
        $this->newLine();

        $artisan = $dryRun ? null : $this->getOrCreateArtisan();

        $imported = 0;
        $skipped  = 0;

        for ($page = 1; $page <= $maxPages; $page++) {
            $url = $collection === 'all'
                ? self::BASE . "/products.json?limit=250&page={$page}"
                : self::BASE . "/collections/{$collection}/products.json?limit=250&page={$page}";

            $this->line("  📦 Fetching page {$page} → {$url}");

            try {
                $response = Http::timeout(30)
                    ->withoutVerifying()
                    ->withHeaders(['Accept' => 'application/json'])
                    ->get($url);

                if ($response->failed()) {
                    $this->error("HTTP {$response->status()} — arrêt.");
                    break;
                }

                $products = $response->json('products', []);

                if (empty($products)) {
                    $this->info("  Plus de produits à la page {$page} — terminé.");
                    break;
                }

                $this->line("  → " . count($products) . " produits reçus.");

                foreach ($products as $p) {
                    if ($this->processProduct($p, $artisan, $collection, $dryRun)) {
                        $imported++;
                    } else {
                        $skipped++;
                    }
                }

            } catch (\Exception $e) {
                $this->error("  ❌ Erreur: " . $e->getMessage());
                break;
            }

            if ($page < $maxPages) sleep(1);
        }

        $this->newLine();
        $this->info("✅ Import terminé — {$imported} produits importés, {$skipped} ignorés.");
    }

    private function processProduct(array $p, ?Artisan $artisan, string $collection, bool $dryRun): bool
    {
        $titre = $p['title'] ?? null;
        $id    = $p['id']    ?? null;

        if (!$titre || !$id) return false;

        $variant  = $p['variants'][0] ?? [];
        $prixEuro = (float) ($variant['price'] ?? 0);
        $prixMad  = round($prixEuro * 10.8, 2);

        if ($prixMad <= 0) return false;

        $description = Str::limit(strip_tags($p['body_html'] ?? ''), 1000);
        $stock       = max((int) ($variant['inventory_quantity'] ?? 50), 0);
        $images      = collect($p['images'] ?? [])->map(fn($img) => $img['src'] ?? null)->filter()->values()->toArray();

        if ($dryRun) {
            $this->line("    [DRY] {$titre} | {$prixMad} MAD | stock:{$stock} | " . count($images) . " images");
            return true;
        }

        // ── Catégorie ──────────────────────────────────────────────────────
        $catInfo   = self::COLLECTION_MAP[$collection] ?? ['nom' => 'Divers', 'slug' => 'divers'];
        $catSlug   = $catInfo['slug'];

        $categorie = Categorie::firstOrCreate(
            ['nom' => $catInfo['nom']],          // ← cherche par nom
            ['description' => '']
        );

        // ── Slug produit unique ────────────────────────────────────────────
        $baseSlug    = Str::slug($titre);
        $produitSlug = $baseSlug;
        $counter     = 1;

        // Garantit l'unicité du slug
        while (Produit::where('slug', $produitSlug)->exists()) {
            $produitSlug = $baseSlug . '-' . $counter++;
        }

        // ── Doublon par nom + prix ─────────────────────────────────────────
        if (Produit::where('nom', $titre)->where('prix', $prixMad)->exists()) {
            return false;
        }

        // ── Insertion ─────────────────────────────────────────────────────
        DB::transaction(function () use ($titre, $produitSlug, $prixMad, $description, $stock, $images, $categorie, $artisan) {
            $produit = Produit::create([
                'artisan_id'   => $artisan->id,
                'categorie_id' => $categorie->id,
                'nom'          => $titre,
                'slug'         => $produitSlug,
                'description'  => $description ?: 'Produit artisanal marocain fait main.',
                'prix'         => $prixMad,
                'stock'        => min($stock, 999),
                'statut'       => 'actif',
                'date_ajout'   => now()->toDateString(),
            ]);

            foreach ($images as $i => $url) {
                Image::create([
                    'produit_id' => $produit->id,
                    'url_image'  => $url,
                    'principale' => $i === 0,
                ]);
            }
        });

        $this->line("    ✓ {$titre} | {$prixMad} MAD");
        return true;
    }

    private function getOrCreateArtisan(): Artisan
    {
        $utilisateur = Utilisateur::firstOrCreate(
            ['email' => 'source@mytindy.ma'],
            [
                'nom'          => 'MyTindy',
                'prenom'       => 'Source',
                'mot_de_passe' => bcrypt(Str::random(32)),
                'role'         => 'artisan',
                'telephone'    => '+212707186946',
                'adresse'      => 'Maroc',
            ]
        );

        return Artisan::firstOrCreate(
            ['utilisateur_id' => $utilisateur->id],
            ['boutique' => 'MyTindy — Artisanat Marocain', 'revenu_total' => 0]
        );
    }
}