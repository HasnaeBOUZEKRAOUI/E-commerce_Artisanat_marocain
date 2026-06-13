<?php
// database/seeders/CategoriesSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('categories')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ══════════════════════════════════════════════════════════════
        // STRUCTURE COMPLÈTE MYTINDY
        // Niveau 1 → Niveau 2 → Niveau 3 (contient les produits)
        // ══════════════════════════════════════════════════════════════
        $structure = [

            'HOME & LIVING' => [
                'slug'  => 'home-living',
                'image' => 'https://cdn.shopify.com/s/files/1/0610/6474/4592/collections/home-living.jpg',
                'sous'  => [
                    'DINING' => [
                        'slug' => 'dining',
                        'sous' => [
                            'Cups & Mugs'                => 'cups-mugs',
                            'Placemats, Coasters & Trivets' => 'placemats-coasters',
                            'Plates & Bowls'             => 'plates-bowls',
                            'Tagines'                    => 'tagines',
                            'Teapots & Tea Sets'         => 'teapots-tea-sets',
                            'Trays & Boards'             => 'trays-boards',
                            'Table Linen'                => 'table-linen',
                        ],
                    ],
                    'LIVING ROOM & BEDROOM' => [
                        'slug' => 'living-room-bedroom',
                        'sous' => [
                            'Baskets, Pots & Plates'     => 'baskets-pots-plates',
                            'Blankets'                   => 'blankets',
                            'Candles & Candlesticks'     => 'candles-candlesticks',
                            'Cushions & Pillowcases'     => 'cushions-pillowcases',
                            'Home Fragrance'             => 'home-fragrance-living',
                            'Jars, Vases & Ashtrays'     => 'jars-vases-ashtrays',
                            'Lamps & Lampshades'         => 'lamps-lampshades',
                            'Oud Burners'                => 'oud-burners',
                            'Rugs'                       => 'rugs',
                            'Stationery & Games'         => 'stationery-games',
                            'Plates, Mirrors & Wall Art' => 'plates-mirrors-wall-art',
                        ],
                    ],
                    'WALL DECOR' => [
                        'slug' => 'wall-decor',
                        'sous' => [
                            'Mirrors'          => 'mirrors',
                            'Posters & Canvas' => 'posters-canvas',
                            'Wall Embroidery'  => 'wall-embroidery',
                            'Zellige Art'      => 'zellige-art',
                            'Ceramic Tiles'    => 'ceramic-tiles-wall',
                        ],
                    ],
                    'HOME FRAGRANCE' => [
                        'slug' => 'home-fragrance',
                        'sous' => [
                            'Candles'                  => 'candles',
                            'Reed Diffuser'            => 'reed-diffuser',
                            'Scented Oils & Diffusers' => 'scented-oils-diffusers',
                            'Home Sprays'              => 'home-sprays',
                        ],
                    ],
                    'ACCENT FURNITURES' => [
                        'slug' => 'accent-furnitures',
                        'sous' => [
                            'Moroccan Fountains'       => 'moroccan-fountains',
                            'Moroccan Poufs & Ottomans'=> 'moroccan-poufs-ottomans',
                            'Moroccan Rugs'            => 'moroccan-rugs',
                            'Side Tables'              => 'side-tables',
                            'Towels'                   => 'towels',
                            'Throw Pillows'            => 'throw-pillows',
                        ],
                    ],
                    'BATHROOM' => [
                        'slug' => 'bathroom',
                        'sous' => [
                            'Bathroom Sinks'       => 'bathroom-sinks',
                            'Bathroom Fixtures'    => 'bathroom-fixtures',
                            'Bathroom Accessories' => 'bathroom-accessories',
                            'Ceramic Tiles'        => 'ceramic-tiles-bath',
                        ],
                    ],
                ],
            ],

            'FASHION' => [
                'slug'  => 'fashion',
                'image' => 'https://cdn.shopify.com/s/files/1/0610/6474/4592/collections/fashion.jpg',
                'sous'  => [
                    'Women' => [
                        'slug' => 'fashion-women',
                        'sous' => [
                            'Kaftans'            => 'kaftans',
                            'Jellabas'           => 'jellabas-women',
                            'Dresses & Kimonos'  => 'dresses-kimonos',
                            'Tops'               => 'tops-women',
                            'Bags'               => 'bags-women',
                            'Jewelry'            => 'jewelry-fashion-women',
                            'Moroccan Slippers'  => 'moroccan-slippers-women',
                        ],
                    ],
                    'Men' => [
                        'slug' => 'fashion-men',
                        'sous' => [
                            'Jellabas & Gandouras' => 'jellabas-gandouras',
                            'Tops'                 => 'tops-men',
                            'Jackets'              => 'jackets-men',
                            'Shoes'                => 'shoes-men',
                            'Bags'                 => 'bags-men',
                            'Jewelry'              => 'jewelry-fashion-men',
                            'Accessories'          => 'accessories-men',
                        ],
                    ],
                    'Kids' => [
                        'slug' => 'fashion-kids',
                        'sous' => [
                            'Clothing'    => 'clothing-kids',
                            'Shoes'       => 'shoes-kids',
                            'Accessories' => 'accessories-kids',
                        ],
                    ],
                ],
            ],

            'JEWELRY' => [
                'slug'  => 'jewelry',
                'image' => 'https://cdn.shopify.com/s/files/1/0610/6474/4592/collections/jewelry.jpg',
                'sous'  => [
                    'Women' => [
                        'slug' => 'jewelry-women',
                        'sous' => [
                            'Necklace'     => 'necklace-women',
                            'Ring'         => 'ring-women',
                            'Bracelet'     => 'bracelet-women',
                            'Jewelry Sets' => 'jewelry-sets-women',
                        ],
                    ],
                    'Men' => [
                        'slug' => 'jewelry-men',
                        'sous' => [
                            'Necklace'     => 'necklace-men',
                            'Ring'         => 'ring-men',
                            'Bracelet'     => 'bracelet-men',
                            'Jewelry Sets' => 'jewelry-sets-men',
                        ],
                    ],
                ],
            ],

            'BEAUTY & HAMMAM' => [
                'slug'  => 'beauty-hammam',
                'image' => 'https://cdn.shopify.com/s/files/1/0610/6474/4592/collections/beauty.jpg',
                'sous'  => [
                    'FACE CARE' => [
                        'slug' => 'face-care',
                        'sous' => [
                            'Face Mask'           => 'face-mask',
                            'Face Oil'            => 'face-oil',
                            'Face Scrubs'         => 'face-scrubs',
                            'Face Soaps'          => 'face-soaps',
                            'Face Toners & Waters'=> 'face-toners-waters',
                            'Lip Balms'           => 'lip-balms',
                        ],
                    ],
                    'HAIR CARE' => [
                        'slug' => 'hair-care',
                        'sous' => [
                            'Hair Oils'                  => 'hair-oils',
                            'Hair Masks'                 => 'hair-masks',
                            'Shampoos & Conditioners'    => 'shampoos-conditioners',
                        ],
                    ],
                    'BODY CARE' => [
                        'slug' => 'body-care',
                        'sous' => [
                            'Body Oils'                => 'body-oils',
                            'Body Scrub'               => 'body-scrub',
                            'Body Soap'                => 'body-soap',
                            'Hammam Essentials'        => 'hammam-essentials',
                            'Perfumes & Body Sprays'   => 'perfumes-body-sprays',
                        ],
                    ],
                    'GIFT SETS' => [
                        'slug' => 'gift-sets-beauty',
                        'sous' => [
                            'Gift Sets' => 'gift-sets',
                        ],
                    ],
                ],
            ],

            'MOROCCAN PANTRY' => [
                'slug'  => 'moroccan-pantry',
                'image' => 'https://cdn.shopify.com/s/files/1/0610/6474/4592/collections/pantry.jpg',
                'sous'  => [
                    'MOROCCAN PANTRY' => [
                        'slug' => 'moroccan-pantry-sub',
                        'sous' => [
                            'Culinary Oils'                       => 'culinary-oils',
                            'Amlou'                               => 'amlou',
                            'Honey'                               => 'honey',
                            'Spreads'                             => 'spreads',
                            'Gourmet Gift Boxes'                  => 'gourmet-gift-boxes',
                            'Teas & Saffron'                      => 'teas-saffron',
                            'Sugar, Molasses, Waters & Powders'   => 'sugar-molasses-waters',
                        ],
                    ],
                ],
            ],

        ];

        // ── Insertion récursive ───────────────────────────────────────
        foreach ($structure as $nomNiv1 => $dataNiv1) {
            $cat1 = DB::table('categories')->insertGetId([
                'parent_id'  => null,
                'niveau'     => 1,
                'nom'        => $nomNiv1,
                'slug'       => $dataNiv1['slug'],
                'description'=> '',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($dataNiv1['sous'] as $nomNiv2 => $dataNiv2) {
                $cat2 = DB::table('categories')->insertGetId([
                    'parent_id'  => $cat1,
                    'niveau'     => 2,
                    'nom'        => $nomNiv2,
                    'slug'       => $dataNiv2['slug'],
                    'description'=> '',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                foreach ($dataNiv2['sous'] as $nomNiv3 => $slugNiv3) {
                    DB::table('categories')->insert([
                        'parent_id'  => $cat2,
                        'niveau'     => 3,
                        'nom'        => $nomNiv3,
                        'slug'       => $slugNiv3,
                        'description'=> '',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        $total = DB::table('categories')->count();
        $this->command->info("✅ {$total} catégories insérées (niveaux 1, 2 et 3).");
    }
}