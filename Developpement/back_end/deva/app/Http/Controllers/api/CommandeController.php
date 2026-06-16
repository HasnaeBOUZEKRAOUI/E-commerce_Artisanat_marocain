<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        $commandes = $request->user()
            ->client
            ->commandes()
            ->with(['lignes.produit'])
            ->latest()
            ->paginate(10);

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
            $commande = $request->user()->client->commandes()->create([
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

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Erreur CreateOrder: " . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'initialisation de la commande.'], 500);
        }
    }

    public function captureOrder($orderId)
    {
        DB::beginTransaction();

        try {
            $commande = Commande::where('paypal_order_id', $orderId)->firstOrFail();

            $token = $this->getPayPalAccessToken();
            $url = env('PAYPAL_MODE') === 'sandbox' 
                ? "https://api-m.sandbox.paypal.com/v2/checkout/orders/{$orderId}/capture" 
                : "https://api-m.paypal.com/v2/checkout/orders/{$orderId}/capture";

            $response = Http::withToken($token)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($url);

            $result = $response->json();

            if (isset($result['status']) && $result['status'] === 'COMPLETED') {
                
                $commande->update(['statut' => 'paye']);

                $commande->load('lignes');
                foreach ($commande->lignes as $ligne) {
                    Produit::where('id', $ligne->produit_id)
                        ->decrement('stock', $ligne->quantite);
                }

                DB::commit();
                return response()->json(['status' => 'COMPLETED', 'message' => 'Paiement et commande validés !']);
            }

            throw new \Exception("Le paiement n'a pas été validé par PayPal (Statut: " . ($result['status'] ?? 'Inconnu') . ")");

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Erreur CaptureOrder: " . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la validation du paiement.'], 500);
        }
    }
}