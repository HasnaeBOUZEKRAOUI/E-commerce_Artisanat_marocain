<?php
// app/Console/Commands/AssignStyles.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Produit;

class AssignStyles extends Command
{
    protected $signature = 'produits:assign-style {--force : réassigne même les produits qui ont déjà un style}';

    protected $description = 'Assigne un style (moderne/traditionnel) à tous les produits existants, basé sur des mots-clés et la catégorie';

    /** Style par défaut selon le slug de la catégorie NIVEAU 3 du produit */
    const CATEGORY_STYLE = [
        'moroccan-rugs'          => 'traditionnel',
        'candles'                => 'moderne',
        'cushions-pillowcases'   => 'traditionnel',
        'baskets-pots-plates'    => 'traditionnel',
        'lamps-lampshades'       => 'moderne',
        'womens-jewelry-all'     => 'traditionnel',
        'mens-jewelry-all'       => 'traditionnel',
        'bags-women'             => 'moderne',
        'moroccan-poufs-ottomans'=> 'traditionnel',
        'blankets'               => 'traditionnel',
        'body-care-all'          => 'moderne',
        'hair-care-all'          => 'moderne',
        'home-fragrance-all'     => 'moderne',
        'mirrors'                => 'traditionnel',
        'tagines'                => 'traditionnel',
        'honey'                  => null,
        'culinary-oils'          => null,
    ];

    /** Mots-clés prioritaires (vérifiés avant le style par défaut de la catégorie) */
    const STYLE_KEYWORDS = [
        'moderne' => [
            'modern', 'minimalist', 'contemporary', 'geometric', 'abstract',
        ],
        'traditionnel' => [
            'beni ourain', 'boucherouite', 'berber', 'kilim', 'vintage',
            'tribal', 'traditional', 'zanafi', 'azilal', 'boujaad',
            'handmade', 'authentic', 'amazigh',
        ],
    ];

    public function handle(): void
    {
        $force = $this->option('force');

        $query = Produit::with('categorie');
        if (!$force) {
            $query->whereNull('style');
        }

        $produits = $query->get();
        $this->info("📦 {$produits->count()} produits à traiter" . ($force ? ' (--force activé)' : ' (sans style uniquement)'));

        $counts = ['moderne' => 0, 'traditionnel' => 0, 'aucun' => 0];

        foreach ($produits as $produit) {
            $defaultStyle = self::CATEGORY_STYLE[$produit->categorie?->slug] ?? null;
            $style = $this->detectStyle($produit->nom, $defaultStyle);

            $produit->update(['style' => $style]);

            $counts[$style ?? 'aucun']++;
        }

        $this->newLine();
        $this->info("✅ Terminé :");
        $this->line("   moderne      : {$counts['moderne']}");
        $this->line("   traditionnel : {$counts['traditionnel']}");
        $this->line("   aucun        : {$counts['aucun']}");
    }

    private function detectStyle(string $titre, ?string $defaultStyle): ?string
    {
        $titreLower = mb_strtolower($titre);

        foreach (self::STYLE_KEYWORDS as $style => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($titreLower, $keyword)) {
                    return $style;
                }
            }
        }

        return $defaultStyle;
    }
}