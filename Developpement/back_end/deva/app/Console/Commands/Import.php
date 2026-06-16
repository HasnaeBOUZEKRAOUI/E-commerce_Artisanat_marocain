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
use App\Models\Caracteristique;

class Import extends Command
{
    protected $signature = 'my:import
                            {--collection=all}
                            {--pages=3}
                            {--dry-run}';

    protected $description = 'Importe les produits MyTindy avec leurs caractéristiques complètes';

    const BASE = 'https://mytindy.com';

    const COLLECTION_MAP = [
        'cups-mugs'                  => ['nom' => 'Cups & Mugs',               'slug' => 'cups-mugs',               'parent_slug' => 'dining',                  'style' => 'moderne'],
        'placemats-coasters'         => ['nom' => 'Placemats, Coasters',        'slug' => 'placemats-coasters',       'parent_slug' => 'dining',                  'style' => 'traditionnel'],
        'plates-bowls'               => ['nom' => 'Plates & Bowls',             'slug' => 'plates-bowls',             'parent_slug' => 'dining',                  'style' => 'traditionnel'],
        'tagines'                    => ['nom' => 'Tagines',                    'slug' => 'tagines',                  'parent_slug' => 'dining',                  'style' => 'traditionnel'],
        'teapots-tea-sets'           => ['nom' => 'Teapots & Tea Sets',         'slug' => 'teapots-tea-sets',         'parent_slug' => 'dining',                  'style' => 'traditionnel'],
        'trays-boards'               => ['nom' => 'Trays & Boards',             'slug' => 'trays-boards',             'parent_slug' => 'dining',                  'style' => 'traditionnel'],
        'table-linen'                => ['nom' => 'Table Linen',                'slug' => 'table-linen',              'parent_slug' => 'dining',                  'style' => 'moderne'],
        'pottery-pots'               => ['nom' => 'Baskets, Pots & Plates',     'slug' => 'baskets-pots-plates',      'parent_slug' => 'living-room-bedroom',     'style' => 'traditionnel'],
        'moroccan-handmade-blankets' => ['nom' => 'Blankets',                   'slug' => 'blankets',                 'parent_slug' => 'living-room-bedroom',     'style' => 'traditionnel'],
        'candles'                    => ['nom' => 'Candles & Candlesticks',     'slug' => 'candles-candlesticks',     'parent_slug' => 'living-room-bedroom',     'style' => 'moderne'],
        'pillowcases'                => ['nom' => 'Cushions & Pillowcases',     'slug' => 'cushions-pillowcases',     'parent_slug' => 'living-room-bedroom',     'style' => 'traditionnel'],
        'home-fragrance'             => ['nom' => 'Home Fragrance',             'slug' => 'home-fragrance-living',    'parent_slug' => 'living-room-bedroom',     'style' => 'moderne'],
        'lamps-lampshades'           => ['nom' => 'Lamps & Lampshades',         'slug' => 'lamps-lampshades',         'parent_slug' => 'living-room-bedroom',     'style' => 'moderne'],
        'rugs'                       => ['nom' => 'Rugs',                       'slug' => 'rugs',                     'parent_slug' => 'living-room-bedroom',     'style' => 'traditionnel'],
        'mirrors'                    => ['nom' => 'Mirrors',                    'slug' => 'mirrors',                  'parent_slug' => 'wall-decor',              'style' => 'traditionnel'],
        'moroccan-leather-pouf'      => ['nom' => 'Moroccan Poufs & Ottomans',  'slug' => 'moroccan-poufs-ottomans',  'parent_slug' => 'accent-furnitures',       'style' => 'traditionnel'],
        'moroccan-rugs'              => ['nom' => 'Moroccan Rugs',              'slug' => 'moroccan-rugs',            'parent_slug' => 'accent-furnitures',       'style' => 'traditionnel'],
        'womens-bags'                => ['nom' => 'Bags',                       'slug' => 'bags-women',               'parent_slug' => 'fashion-women',           'style' => 'moderne'],
        'womens-jewelry'             => ['nom' => 'Jewelry Women',              'slug' => 'jewelry-fashion-women',    'parent_slug' => 'fashion-women',           'style' => 'traditionnel'],
        'mens-jewelry'               => ['nom' => 'Jewelry Men',                'slug' => 'jewelry-fashion-men',      'parent_slug' => 'fashion-men',             'style' => 'traditionnel'],
        'necklaces'                  => ['nom' => 'Necklace',                   'slug' => 'necklace-women',           'parent_slug' => 'jewelry-women',           'style' => 'traditionnel'],
        'rings'                      => ['nom' => 'Ring',                       'slug' => 'ring-women',               'parent_slug' => 'jewelry-women',           'style' => 'traditionnel'],
        'bracelets'                  => ['nom' => 'Bracelet',                   'slug' => 'bracelet-women',           'parent_slug' => 'jewelry-women',           'style' => 'traditionnel'],
        'body-care'                  => ['nom' => 'Body Oils',                  'slug' => 'body-oils',                'parent_slug' => 'body-care',               'style' => 'moderne'],
        'hair-care'                  => ['nom' => 'Hair Oils',                  'slug' => 'hair-oils',                'parent_slug' => 'hair-care',               'style' => 'moderne'],
        'culinary-oils'              => ['nom' => 'Culinary Oils',              'slug' => 'culinary-oils',            'parent_slug' => 'moroccan-pantry-sub',     'style' => null],
        'honey'                      => ['nom' => 'Honey',                      'slug' => 'honey',                    'parent_slug' => 'moroccan-pantry-sub',     'style' => null],
        'amlou'                      => ['nom' => 'Amlou',                      'slug' => 'amlou',                    'parent_slug' => 'moroccan-pantry-sub',     'style' => null],
        'spreads'                    => ['nom' => 'Spreads',                    'slug' => 'spreads',                  'parent_slug' => 'moroccan-pantry-sub',     'style' => null],
    ];

    const STYLE_KEYWORDS = [
        'moderne'      => ['modern', 'minimalist', 'contemporary', 'geometric', 'abstract'],
        'traditionnel' => ['beni ourain', 'boucherouite', 'berber', 'kilim', 'vintage', 'tribal', 'traditional', 'handmade', 'authentic', 'amazigh'],
    ];

    /**
     * Noms d'options Shopify → noms de caractéristiques lisibles
     */
    const OPTION_LABEL_MAP = [
        'color'   => 'Couleur',
        'colour'  => 'Couleur',
        'size'    => 'Taille',
        'taille'  => 'Taille',
        'couleur' => 'Couleur',
        'matière' => 'Matière',
        'matiere' => 'Matière',
        'material'=> 'Matière',
        'weight'  => 'Poids',
        'style'   => 'Style décoratif',
        'title'   => null, // Ignoré — valeur par défaut Shopify inutile
    ];

    public function handle(): void
    {
        $collectionOption = $this->option('collection');
        $maxPages         = (int) $this->option('pages');
        $dryRun           = $this->option('dry-run');

        $collectionsToImport = $collectionOption === 'all'
            ? array_keys(self::COLLECTION_MAP)
            : [$collectionOption];

        if ($collectionOption !== 'all' && !array_key_exists($collectionOption, self::COLLECTION_MAP)) {
            $this->error("❌ Collection '{$collectionOption}' inconnue.");
            return;
        }

        $this->info("🇲🇦 Import MyTindy — " . count($collectionsToImport) . " collections | pages max: {$maxPages}" . ($dryRun ? ' [DRY RUN]' : ''));

        $artisan = $dryRun ? null : $this->getOrCreateArtisan();

        foreach ($collectionsToImport as $collection) {
            $this->newLine();
            $this->info("====== 📂 {$collection} ======");

            $categorie    = $dryRun ? null : $this->getOrCreateCategorie($collection);
            $defaultStyle = self::COLLECTION_MAP[$collection]['style'] ?? null;
            $imported = $skipped = 0;

            for ($page = 1; $page <= $maxPages; $page++) {
                $url = self::BASE . "/collections/{$collection}/products.json?limit=250&page={$page}";
                $this->line("  📦 Page {$page}");

                try {
                    $response = Http::timeout(30)
                        ->withoutVerifying()
                        ->withHeaders(['Accept' => 'application/json'])
                        ->get($url);

                    if ($response->failed()) { $this->error("  HTTP {$response->status()}"); break; }

                    $products = $response->json('products', []);
                    if (empty($products)) { $this->line("  Fin des données."); break; }

                    $this->line("  → " . count($products) . " produits reçus.");

                    foreach ($products as $p) {
                        $this->processProduct($p, $artisan, $categorie, $defaultStyle, $dryRun)
                            ? $imported++ : $skipped++;
                    }

                } catch (\Exception $e) {
                    $this->error("  ❌ " . $e->getMessage());
                    break;
                }

                sleep(1);
            }

            $this->info("  ✅ {$imported} importés, {$skipped} ignorés.");
        }
    }

    private function processProduct(array $p, ?Artisan $artisan, ?Categorie $categorie, ?string $defaultStyle, bool $dryRun): bool
    {
        $titre    = $p['title'] ?? null;
        $shopifyId = $p['id'] ?? null;
        if (!$titre || !$shopifyId) return false;

        $variant  = $p['variants'][0] ?? [];
        $prixEuro = (float) ($variant['price'] ?? 0);
        $prixMad  = round($prixEuro * 10.8, 2);
        if ($prixMad <= 0) return false;

        $description = Str::limit(strip_tags($p['body_html'] ?? ''), 1000);
        $stock       = max((int) ($variant['inventory_quantity'] ?? 50), 0);
        $images      = collect($p['images'] ?? [])->map(fn($img) => $img['src'] ?? null)->filter()->values()->toArray();
        $style       = $this->detectStyle($titre, $defaultStyle);

        // ── Extraction des caractéristiques ───────────────────────────────────
        $caracteristiques = $this->extractCaracteristiques($p);

        if ($dryRun) {
            $this->line("    [DRY] {$titre} | {$prixMad} MAD | style:{$style} | " . count($caracteristiques) . " caract.");
            foreach ($caracteristiques as $k => $v) {
                $this->line("       → {$k} : {$v}");
            }
            return true;
        }

        if (Produit::where('nom', $titre)->where('prix', $prixMad)->exists()) return false;

        $baseSlug    = Str::slug($titre);
        $produitSlug = $baseSlug;
        $counter     = 1;
        while (Produit::where('slug', $produitSlug)->exists()) {
            $produitSlug = $baseSlug . '-' . $counter++;
        }

        DB::transaction(function () use ($titre, $produitSlug, $prixMad, $description, $stock, $images, $categorie, $artisan, $style, $caracteristiques) {
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

            // Images
            foreach ($images as $i => $url) {
                Image::create([
                    'produit_id' => $produit->id,
                    'url_image'  => $url,
                    'principale' => $i === 0,
                ]);
            }

            // Caractéristiques
            foreach ($caracteristiques as $nom => $valeur) {
                Caracteristique::create([
                    'produit_id' => $produit->id,
                    'nom'        => $nom,
                    'valeur'     => $valeur,
                ]);
            }
        });

        $this->line("    ✓ {$titre} | {$prixMad} MAD | " . count($caracteristiques) . " caract.");
        return true;
    }

    
    private function extractCaracteristiques(array $p): array
    {
        $caract = [];

        if (!empty($p['product_type'])) {
            $caract['Type'] = $p['product_type'];
        }

        if (!empty($p['vendor']) && $p['vendor'] !== 'MyTindy') {
            $caract['Marque'] = $p['vendor'];
        }

        foreach ($p['options'] ?? [] as $option) {
            $nomOption = mb_strtolower(trim($option['name'] ?? ''));
            $label     = self::OPTION_LABEL_MAP[$nomOption] ?? ucfirst($option['name'] ?? '');
            if (!$label) continue; 

            $valeurs = array_filter($option['values'] ?? [], fn($v) => $v !== 'Default Title');
            if (empty($valeurs)) continue;

            if (count($valeurs) === 1) {
                $caract[$label] = Str::limit(reset($valeurs), 255, '');
            } else {
                $chaineValeurs = implode(', ', $valeurs);
                $caract[$label . ' disponibles'] = Str::limit($chaineValeurs, 255, '...');
            }
        }

       // 4. Tags Shopify → extraire couleurs et matières connues
       $rawTags = $p['tags'] ?? '';
        
       if (is_array($rawTags)) {
           $tags = array_map('trim', $rawTags);
       } else {
           $tags = array_map('trim', explode(',', (string) $rawTags));
       }

       $couleursDetectees = [];
       $matieresDetectees = [];
       $couleursConnues = ['red','blue','green','white','black','brown','beige','grey','gray','orange','yellow','pink','purple','gold','silver','cream','ivory','natural'];
       $matieresConnues = ['wool','cotton','leather','silk','ceramic','clay','wood','metal','brass','copper','silver','gold','linen','jute','raffia','cedar','terracotta'];
        foreach ($tags as $tag) {
            $tagLower = mb_strtolower($tag);
            if (in_array($tagLower, $couleursConnues)) {
                $couleursDetectees[] = ucfirst($tag);
            } elseif (in_array($tagLower, $matieresConnues)) {
                $matieresDetectees[] = ucfirst($tag);
            }
        }

        if (!empty($couleursDetectees) && !isset($caract['Couleur']) && !isset($caract['Couleur disponibles'])) {
            $caract['Couleur'] = implode(', ', array_unique($couleursDetectees));
        }
        if (!empty($matieresDetectees) && !isset($caract['Matière']) && !isset($caract['Matière disponibles'])) {
            $caract['Matière'] = implode(', ', array_unique($matieresDetectees));
        }

        $dimensionsDetectees = [];
        foreach ($p['variants'] ?? [] as $variant) {
            $titreVariant = $variant['title'] ?? '';
            if ($titreVariant === 'Default Title') continue;

            if (preg_match('/(\d+\s*[xX×]\s*\d+(?:\s*(?:cm|m))?)/u', $titreVariant, $match)) {
                $dimensionsDetectees[] = $match[1];
            }
            if (preg_match('/(\d+(?:\.\d+)?\s*(?:kg|g|gr))/ui', $titreVariant, $match)) {
                $caract['Poids'] = $match[1];
            }
        }
        if (!empty($dimensionsDetectees)) {
            $caract['Dimensions'] = implode(' / ', array_unique($dimensionsDetectees));
        }

        $description = strip_tags($p['body_html'] ?? '');
        $patterns = [
            'Longueur' => '/(?:length|longueur)\s*[:\-]\s*([^\n\r,\.]+(?:cm|m|ft|in))/ui',
            'Largeur'  => '/(?:width|largeur)\s*[:\-]\s*([^\n\r,\.]+(?:cm|m|ft|in))/ui',
            'Hauteur'  => '/(?:height|hauteur)\s*[:\-]\s*([^\n\r,\.]+(?:cm|m|ft|in))/ui',
            'Matière'  => '/(?:material|matière|matiere)\s*[:\-]\s*([^\n\r,\.]+)/ui',
            'Couleur'  => '/(?:color|colour|couleur)\s*[:\-]\s*([^\n\r,\.]+)/ui',
        ];

        foreach ($patterns as $nom => $pattern) {
            if (isset($caract[$nom])) continue; // Ne pas écraser ce qu'on a déjà
            if (preg_match($pattern, $description, $match)) {
                $valeur = trim(strip_tags($match[1]));
                if (strlen($valeur) > 0 && strlen($valeur) < 100) {
                    $caract[$nom] = $valeur;
                }
            }
        }

        return $caract;
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

        $categorie = Categorie::where('slug', $info['slug'])->where('niveau', 3)->first();
        if ($categorie) return $categorie;

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