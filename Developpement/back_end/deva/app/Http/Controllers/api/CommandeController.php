<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CommandeController extends Controller
{
    public function index(Request $request)
{
    // 1. On charge les commandes, les lignes, les produits ET leurs images
    $commandes = $request->user()
        ->client
        ->commandes()
        ->with(['lignes.produit.images']) 
        ->latest()
        ->paginate(10);

    // 2. Transformation pour injecter l'URL en utilisant ton helper de modèle
    $commandes->getCollection()->transform(function ($commande) {
        if ($commande->lignes) {
            foreach ($commande->lignes as $ligne) {
                if ($ligne->produit) {
                    
                    // Utilisez ton helper personnalisé du modèle Produit ! 🎯
                    $imagePrincipale = $ligne->produit->getPrincipaleImage();
                    
                    if ($imagePrincipale) {
                        /* 
                         * ⚠️ ATTENTION : Remplace 'url_image' ci-dessous par le NOM EXACT 
                         * de la colonne dans ta table 'images' (ex: chemin, path, filename...)
                         */
                        $imagePath = $imagePrincipale->url_image; 

                        // Si c'est déjà une URL complète (ex: http://...), on la garde telle quelle
                        if ($imagePath && !filter_var($imagePath, FILTER_VALIDATE_URL)) {
                            $ligne->produit->image_url = asset('storage/' . $imagePath);
                        } else {
                            $ligne->produit->image_url = $imagePath;
                        }
                    } else {
                        // Image de secours si aucune ligne n'existe dans la table images
                        $ligne->produit->image_url = asset('storage/products/placeholder.jpg');
                    }
                }
            }
        }
        return $commande;
    });

    return response()->json($commandes);
}

    private function getPayPalAccessToken()
    {
        $clientId = env('PAYPAL_CLIENT_ID');
        $secret = env('PAYPAL_SECRET');
        $url = env('PAYPAL_MODE') === 'sandbox' 
            ? 'https://api-m.sandbox.paypal.com/v1/oauth2/token' 
            : 'https://api-m.paypal.com/v1/oauth2/token';

        $response = Http::asForm()
            ->withBasicAuth($clientId, $secret)
            ->post($url, [
                'grant_type' => 'client_credentials'
            ]);

        if ($response->failed()) {
            Log::error("PayPal Authentication Failed: " . $response->body());
            throw new \Exception("Impossible de s'authentifier auprès de PayPal.");
        }

        return $response->json()['access_token'];
    }

    public function createOrder(Request $request)
    {
        $data = $request->validate([
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:produits,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.price'      => 'required|numeric|min:0',
            'adresse_livraison'  => 'required|string',
            'total'              => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $user = $request->user();
        
            if (!$user) {
                throw new \Exception("Utilisateur non authentifié dans l'API.");
            }
        
            if (!$user->client) {
                $user->load('client'); 
            }
        
            if (!$user->client) {
                throw new \Exception("L'utilisateur connecté (ID: {$user->id}) n'a pas de profil associé dans la table 'clients'.");
            }
        
            $clientId = $user->client->id; 

            $commande = Commande::create([
                'client_id'         => $clientId, 
                'date_commande'     => now()->toDateString(),
                'montant_total'     => $data['total'],
                'statut'            => 'en_attente',
                'adresse_livraison' => $data['adresse_livraison'],
            ]);

            foreach ($data['items'] as $item) {
                $commande->lignes()->create([
                    'produit_id'    => $item['product_id'],
                    'quantite'      => $item['quantity'],
                    'prix_unitaire' => $item['price'],
                ]);
            }


$token = $this->getPayPalAccessToken();
$url = env('PAYPAL_MODE') === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com/v2/checkout/orders' 
    : 'https://api-m.paypal.com/v2/checkout/orders';

$response = Http::withToken($token)->post($url, [
    "intent" => "CAPTURE",
    "purchase_units" => [
        [
            "reference_id" => (string)$commande->id, 
            "amount" => [
                "currency_code" => "EUR",
                "value" => strval(round($data['total'] / 11, 2))
            ]
        ]
    ]
]);

if ($response->failed()) {
    throw new \Exception("Erreur lors de la création de la commande PayPal: " . $response->body());
}

$paypalOrder = $response->json();

$commande->update([
    'paypal_order_id' => $paypalOrder['id'] 
]);

            DB::commit();

            return response()->json([
                'id' => $paypalOrder['id'],
                'commande_locale_id' => $commande->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); 
            
            return response()->json([
                'message' => "Erreur lors de l'initialisation de la commande.",
                'error_detalilee' => $e->getMessage(),
                'fichier' => $e->getFile(),
                'ligne' => $e->getLine()
            ], 500);
        }
    }
    public function captureOrder($orderId)
    {
        DB::beginTransaction();
    
        try {
            $commande = Commande::where('paypal_order_id', $orderId)->first();
            
            if (!$commande) {
                throw new \Exception("Commande introuvable en base de données pour l'ID PayPal : {$orderId}");
            }
    
$token = $this->getPayPalAccessToken();
$url = env('PAYPAL_MODE') === 'sandbox' 
    ? "https://api-m.sandbox.paypal.com/v2/checkout/orders/{$orderId}/capture" 
    : "https://api-m.paypal.com/v2/checkout/orders/{$orderId}/capture";

$response = Http::withToken($token)
    ->withBody('{}', 'application/json') 
    ->post($url);

$result = $response->json();
    
            if (isset($result['status']) && $result['status'] === 'COMPLETED') {
                
                $commande->update(['statut' => 'paye']);
    
                $commande->load('lignes');
                foreach ($commande->lignes as $ligne) {
                    $produit = Produit::find($ligne->produit_id);
                    if ($produit) {
                        $produit->decrement('stock', $ligne->quantite); 
                    }
                }
    
                DB::commit();
                return response()->json([
                    'status' => 'COMPLETED', 
                    'message' => 'Paiement et commande validés !'
                ]);
            }
    
            // Si PayPal renvoie une erreur ou un autre statut
            $erreurPaypal = $result['message'] ?? json_stringify($result);
            throw new \Exception("PayPal n'a pas validé la capture. Réponse : " . $erreurPaypal);
    
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Erreur CaptureOrder critique : " . $e->getMessage());
            
            // 💡 On renvoie l'erreur système brute à React pour l'afficher à l'écran
            return response()->json([
                'message' => 'Erreur lors de la validation du paiement.',
                'error_detaillee' => $e->getMessage(),
                'fichier' => $e->getFile(),
                'ligne' => $e->getLine()
            ], 500);
        }
    }
}