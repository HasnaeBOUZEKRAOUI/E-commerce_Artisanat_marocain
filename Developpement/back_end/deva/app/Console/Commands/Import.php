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
                            {--collection=all : slug de la collection ou "all" pour tout importer sequentiallement}
                            {--pages=3 : nombre de pages à importer par collection (250 produits/page max)}
                            {--dry-run : affiche sans insérer en base}';

    protected $description = 'Importe la totalité des produits et catégories MyTindy.com dans la base de données';

    const BASE = 'https://mytindy.com';

    /**
     * MAPPING INTÉGRAL — TOUTES LES COLLECTIONS MYTINDY
     * Clé = Le slug réel utilisé dans les requêtes de l'API Shopify MyTindy
     * 'slug' = Doit correspondre EXACTEMENT au slug Niveau 3 de votre CategoriesSeeder
     * 'parent_slug' = Doit correspondre EXACTEMENT au slug Niveau 2 de votre CategoriesSeeder
     */
    const COLLECTION_MAP = [
        // ── HOME & LIVING ────────────────────────────────────────────────────────
        // DINING (parent: dining)
        'cups-mugs'                  => ['nom' => 'Cups & Mugs', 'slug' => 'cups-mugs', 'parent_slug' => 'dining', 'style' => 'moderne'],
        'placemats-coasters'         => ['nom' => 'Placemats, Coasters & Trivets', 'slug' => 'placemats-coasters', 'parent_slug' => 'dining', 'style' => 'traditionnel'],
        'plates-bowls'               => ['nom' => 'Plates & Bowls', 'slug' => 'plates-bowls', 'parent_slug' => 'dining', 'style' => 'traditionnel'],
        'tagines'                    => ['nom' => 'Tagines', 'slug' => 'tagines', 'parent_slug' => 'dining', 'style' => 'traditionnel'],
        'teapots-tea-sets'           => ['nom' => 'Teapots & Tea Sets', 'slug' => 'teapots-tea-sets', 'parent_slug' => 'dining', 'style' => 'traditionnel'],
        'trays-boards'               => ['nom' => 'Trays & Boards', 'slug' => 'trays-boards', 'parent_slug' => 'dining', 'style' => 'traditionnel'],
        'table-linen'                => ['nom' => 'Table Linen', 'slug' => 'table-linen', 'parent_slug' => 'dining', 'style' => 'moderne'],

        // LIVING ROOM & BEDROOM (parent: living-room-bedroom)
        'pottery-pots'               => ['nom' => 'Baskets, Pots & Plates', 'slug' => 'baskets-pots-plates', 'parent_slug' => 'living-room-bedroom', 'style' => 'traditionnel'],
        'moroccan-handmade-blankets' => ['nom' => 'Blankets', 'slug' => 'blankets', 'parent_slug' => 'living-room-bedroom', 'style' => 'traditionnel'],
        'candles'                    => ['nom' => 'Candles & Candlesticks', 'slug' => 'candles-candlesticks', 'parent_slug' => 'living-room-bedroom', 'style' => 'moderne'],
        'pillowcases'                => ['nom' => 'Cushions & Pillowcases', 'slug' => 'cushions-pillowcases', 'parent_slug' => 'living-room-bedroom', 'style' => 'traditionnel'],
        'home-fragrance'             => ['nom' => 'Home Fragrance', 'slug' => 'home-fragrance-living', 'parent_slug' => 'living-room-bedroom', 'style' => 'moderne'],
        'lamps-lampshades'           => ['nom' => 'Lamps & Lampshades', 'slug' => 'lamps-lampshades', 'parent_slug' => 'living-room-bedroom', 'style' => 'moderne'],
        'rugs'                       => ['nom' => 'Rugs', 'slug' => 'rugs', 'parent_slug' => 'living-room-bedroom', 'style' => 'traditionnel'],

        // WALL DECOR (parent: wall-decor)
        'mirrors'                    => ['nom' => 'Mirrors', 'slug' => 'mirrors', 'parent_slug' => 'wall-decor', 'style' => 'traditionnel'],

        // ACCENT FURNITURES (parent: accent-furnitures)
        'moroccan-leather-pouf'      => ['nom' => 'Moroccan Poufs & Ottomans', 'slug' => 'moroccan-poufs-ottomans', 'parent_slug' => 'accent-furnitures', 'style' => 'traditionnel'],
        'moroccan-rugs'              => ['nom' => 'Moroccan Rugs', 'slug' => 'moroccan-rugs', 'parent_slug' => 'accent-furnitures', 'style' => 'traditionnel'],

        // ── FASHION ──────────────────────────────────────────────────────────────
        // Women (parent: fashion-women)
        'womens-bags'                => ['nom' => 'Bags', 'slug' => 'bags-women', 'parent_slug' => 'fashion-women', 'style' => 'moderne'],
        'womens-jewelry'             => ['nom' => 'Jewelry', 'slug' => 'jewelry-fashion-women', 'parent_slug' => 'fashion-women', 'style' => 'traditionnel'],

        // Men (parent: fashion-men)
        'mens-jewelry'               => ['nom' => 'Jewelry', 'slug' => 'jewelry-fashion-men', 'parent_slug' => 'fashion-men', 'style' => 'traditionnel'],

        // ── JEWELRY (PURE) ───────────────────────────────────────────────────────
        // Women (parent: jewelry-women)
        'necklaces'                  => ['nom' => 'Necklace', 'slug' => 'necklace-women', 'parent_slug' => 'jewelry-women', 'style' => 'traditionnel'],
        'rings'                      => ['nom' => 'Ring', 'slug' => 'ring-women', 'parent_slug' => 'jewelry-women', 'style' => 'traditionnel'],
        'bracelets'                  => ['nom' => 'Bracelet', 'slug' => 'bracelet-women', 'parent_slug' => 'jewelry-women', 'style' => 'traditionnel'],

        // ── BEAUTY & HAMMAM ──────────────────────────────────────────────────────
        // BODY CARE (parent: body-care)
        'body-care'                  => ['nom' => 'Body Oils', 'slug' => 'body-oils', 'parent_slug' => 'body-care', 'style' => 'moderne'],
        
        // HAIR CARE (parent: hair-care)
        'hair-care'                  => ['nom' => 'Hair Oils', 'slug' => 'hair-oils', 'parent_slug' => 'hair-care', 'style' => 'moderne'],

        // ── MOROCCAN PANTRY ──────────────────────────────────────────────────────
        // MOROCCAN PANTRY SUB (parent: moroccan-pantry-sub)
        'culinary-oils'              => ['nom' => 'Culinary Oils', 'slug' => 'culinary-oils', 'parent_slug' => 'moroccan-pantry-sub', 'style' => null],
        'honey'                      => ['nom' => 'Honey', 'slug' => 'honey', 'parent_slug' => 'moroccan-pantry-sub', 'style' => null],
        'amlou'                      => ['nom' => 'Amlou', 'slug' => 'amlou', 'parent_slug' => 'moroccan-pantry-sub', 'style' => null],
        'spreads'                    => ['nom' => 'Spreads', 'slug' => 'spreads', 'parent_slug' => 'moroccan-pantry-sub', 'style' => null],
    ];

    const STYLE_KEYWORDS = [
        'moderne' => ['modern', 'minimalist', 'contemporary', 'geometric', 'abstract'],
        'traditionnel' => ['beni ourain', 'boucherouite', 'berber', 'kilim', 'vintage', 'tribal', 'traditional', 'handmade', 'authentic', 'amazigh'],
    ];

    public function handle(): void
    {
        $collectionOption = $this->option('collection');
        $maxPages   = (int) $this->option('pages');
        $dryRun     = $this->option('dry-run');

        // Déterminer la liste des collections à traiter
        $collectionsToImport = [];
        if ($collectionOption === 'all') {
            $collectionsToImport = array_keys(self::COLLECTION_MAP);
            $this->info("🚀 Lancement de l'importation GLOBALE (" . count($collectionsToImport) . " collections détectées).");
        } else {
            if (!array_key_exists($collectionOption, self::COLLECTION_MAP)) {
                $this->error("❌ La collection '{$collectionOption}' n'est pas configurée dans COLLECTION_MAP.");
                return;
            }
            $collectionsToImport = [$collectionOption];
        }

        $artisan = $dryRun ? null : $this->getOrCreateArtisan();

        foreach ($collectionsToImport as $collection) {
            $this->newLine();
            $this->info("====== 📂 COLLECTION : {$collection} ======");
            
            $categorie = $dryRun ? null : $this->getOrCreateCategorie($collection);
            if (!$dryRun && !$categorie) {
                $this->error("Skipped: Catégorie introuvable pour {$collection}");
                continue;
            }

            $defaultStyle = self::COLLECTION_MAP[$collection]['style'] ?? null;
            $imported = 0;
            $skipped  = 0;

            for ($page = 1; $page <= $maxPages; $page++) {
                $url = self::BASE . "/collections/{$collection}/products.json?limit=250&page={$page}";
                $this->line("  📦 Page {$page} → {$url}");

                try {
                    $response = Http::timeout(30)
                        ->withoutVerifying()
                        ->withHeaders(['Accept' => 'application/json'])
                        ->get($url);

                    if ($response->failed()) {
                        $this->error("  HTTP {$response->status()} — Saut de page.");
                        break;
                    }

                    $products = $response->json('products', []);
                    if (empty($products)) {
                        $this->line("  Fin des données pour la collection '{$collection}'.");
                        break;
                    }

                    foreach ($products as $p) {
                        if ($this->processProduct($p, $artisan, $categorie, $defaultStyle, $dryRun)) {
                            $imported++;
                        } else {
                            $skipped++;
                        }
                    }

                } catch (\Exception $e) {
                    $this->error("  ❌ Erreur critique : " . $e->getMessage());
                    break;
                }

                sleep(1);
            }

            $this->info("✅ Collection {$collection} : {$imported} importés, {$skipped} ignorés.");
        }
    }

    private function processProduct(array $p, ?Artisan $artisan, ?Categorie $categorie, ?string $defaultStyle, bool $dryRun): bool
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

        $style = $this->detectStyle($titre, $defaultStyle);

        if ($dryRun) {
            $this->line("    [DRY] {$titre} | {$prixMad} MAD");
            return true;
        }

        // Éviter les doublons stricts (titre + prix identiques)
        if (Produit::where('nom', $titre)->where('prix', $prixMad)->exists()) {
            return false;
        }

        // Génération unique du slug
        $baseSlug    = Str::slug($titre);
        $produitSlug = $baseSlug;
        $counter     = 1;
        while (Produit::where('slug', $produitSlug)->exists()) {
            $produitSlug = $baseSlug . '-' . $counter++;
        }

        DB::transaction(function () use ($titre, $produitSlug, $prixMad, $description, $stock, $images, $categorie, $artisan, $style) {
            $produit = Produit::create([
                'artisan_id'   => $artisan->id,
                'categorie_id' => $categorie->id,
                'nom'          => $titre,
                'slug'         => $produitSlug,
                'description'  => $description ?: 'Produit artisanal marocain fait main.',
                'prix'         => $prixMad,
                'stock'        => min($stock, 999),
                'statut'       => 'actif',
                'style'        => $style,
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

        return true;
    }

    private function detectStyle(string $titre, ?string $defaultStyle): ?string
    {
        $titreLower = mb_strtolower($titre);
        foreach (self::STYLE_KEYWORDS as $style => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($titreLower, $keyword)) return $style;
            }
        }
        return $defaultStyle;
    }

    private function getOrCreateCategorie(string $collection): ?Categorie
    {
        $info = self::COLLECTION_MAP[$collection] ?? null;
        if (!$info) return null;

        // On s'assure de trouver la catégorie de Niveau 3 du seeder par son slug
        $categorie = Categorie::where('slug', $info['slug'])->where('niveau', 3)->first();
        if ($categorie) return $categorie;

        // Si elle n'existe pas, on cherche son parent (Niveau 2)
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