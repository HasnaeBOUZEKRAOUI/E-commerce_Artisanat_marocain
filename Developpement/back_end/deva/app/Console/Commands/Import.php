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

    /**
     * Mapping collection MyTindy → catégorie NIVEAU 3 du CategoriesSeeder
     *
     *  nom         : nom affiché de la catégorie niveau 3
     *  slug        : slug de la catégorie niveau 3 (doit matcher le seeder si possible)
     *  parent_slug : slug de la catégorie NIVEAU 2 (parent) — doit exister dans le seeder
     */
    const COLLECTION_MAP = [
        'moroccan-rugs' => [
            'nom' => 'Moroccan Rugs', 'slug' => 'moroccan-rugs', 'parent_slug' => 'accent-furnitures',
        ],
        'candles' => [
            'nom' => 'Candles', 'slug' => 'candles', 'parent_slug' => 'home-fragrance',
        ],
        'pillowcases' => [
            'nom' => 'Cushions & Pillowcases', 'slug' => 'cushions-pillowcases', 'parent_slug' => 'living-room-bedroom',
        ],
        'pottery-pots' => [
            'nom' => 'Baskets, Pots & Plates', 'slug' => 'baskets-pots-plates', 'parent_slug' => 'living-room-bedroom',
        ],
        'lamps-lampshades' => [
            'nom' => 'Lamps & Lampshades', 'slug' => 'lamps-lampshades', 'parent_slug' => 'living-room-bedroom',
        ],
        'womens-jewelry' => [
            'nom' => 'Women Jewelry', 'slug' => 'womens-jewelry-all', 'parent_slug' => 'jewelry-women',
        ],
        'mens-jewelry' => [
            'nom' => 'Men Jewelry', 'slug' => 'mens-jewelry-all', 'parent_slug' => 'jewelry-men',
        ],
        'womens-bags' => [
            'nom' => 'Bags', 'slug' => 'bags-women', 'parent_slug' => 'fashion-women',
        ],
        'moroccan-leather-pouf' => [
            'nom' => 'Moroccan Poufs & Ottomans', 'slug' => 'moroccan-poufs-ottomans', 'parent_slug' => 'accent-furnitures',
        ],
        'moroccan-handmade-blankets' => [
            'nom' => 'Blankets', 'slug' => 'blankets', 'parent_slug' => 'living-room-bedroom',
        ],
        'body-care' => [
            'nom' => 'Body Care', 'slug' => 'body-care-all', 'parent_slug' => 'body-care',
        ],
        'hair-care' => [
            'nom' => 'Hair Care', 'slug' => 'hair-care-all', 'parent_slug' => 'hair-care',
        ],
        'home-fragrance' => [
            'nom' => 'Home Fragrance', 'slug' => 'home-fragrance-all', 'parent_slug' => 'home-fragrance',
        ],
        'mirrors' => [
            'nom' => 'Mirrors', 'slug' => 'mirrors', 'parent_slug' => 'wall-decor',
        ],
        'tagines' => [
            'nom' => 'Tagines', 'slug' => 'tagines', 'parent_slug' => 'dining',
        ],
        'honey' => [
            'nom' => 'Honey', 'slug' => 'honey', 'parent_slug' => 'moroccan-pantry-sub',
        ],
        'culinary-oils' => [
            'nom' => 'Culinary Oils', 'slug' => 'culinary-oils', 'parent_slug' => 'moroccan-pantry-sub',
        ],
    ];

    public function handle(): void
    {
        $collection = $this->option('collection');
        $maxPages   = (int) $this->option('pages');
        $dryRun     = $this->option('dry-run');

        $this->info("🇲🇦 Import MyTindy — collection: {$collection} | pages: {$maxPages}" . ($dryRun ? ' [DRY RUN]' : ''));
        $this->newLine();

        $artisan   = $dryRun ? null : $this->getOrCreateArtisan();
        $categorie = $dryRun ? null : $this->getOrCreateCategorie($collection);

        if (!$dryRun && !$categorie) {
            $this->error("❌ Collection '{$collection}' inconnue dans COLLECTION_MAP. Ajoutez-la avant d'importer.");
            return;
        }

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
                    if ($this->processProduct($p, $artisan, $categorie, $dryRun)) {
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
        if ($categorie) {
            $this->info("   → Catégorie utilisée : {$categorie->nom} (id={$categorie->id}, slug={$categorie->slug}, niveau={$categorie->niveau})");
        }
    }

    private function processProduct(array $p, ?Artisan $artisan, ?Categorie $categorie, bool $dryRun): bool
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

        // ── Slug produit unique ────────────────────────────────────────────
        $baseSlug    = Str::slug($titre);
        $produitSlug = $baseSlug;
        $counter     = 1;
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

    /**
     * Récupère ou crée la catégorie NIVEAU 3 correspondant à la collection,
     * rattachée au bon parent NIVEAU 2 défini dans COLLECTION_MAP.
     */
    private function getOrCreateCategorie(string $collection): ?Categorie
    {
        $info = self::COLLECTION_MAP[$collection] ?? null;
        if (!$info) return null;

        // Cherche d'abord par slug + niveau 3 (cas du seeder : "tagines", "honey"...)
        $categorie = Categorie::where('slug', $info['slug'])->where('niveau', 3)->first();
        if ($categorie) return $categorie;

        // Sinon, crée-la sous le bon parent niveau 2
        $parent = Categorie::where('slug', $info['parent_slug'])->where('niveau', 2)->first();

        return Categorie::create([
            'parent_id'   => $parent?->id,
            'niveau'      => 3,
            'nom'         => $info['nom'],
            'slug'        => $info['slug'],
            'description' => '',
        ]);
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