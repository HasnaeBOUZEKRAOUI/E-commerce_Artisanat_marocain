<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{

public function register(Request $request)
{
    $data = $request->validate([
        'nom'       => 'required|string|max:100',
        'prenom'    => 'required|string|max:100',
        'email'     => 'required|email|unique:utilisateurs,email',
        'password'  => 'required|string|min:8|confirmed', 
        'telephone' => 'nullable|string',
        'adresse'   => 'nullable|string',
    ]);

    return DB::transaction(function () use ($data) {
        
        $user = Utilisateur::create([
            'nom'          => $data['nom'],
            'prenom'       => $data['prenom'],
            'email'        => $data['email'],
            'mot_de_passe' => Hash::make($data['password']),
            'telephone'    => $data['telephone'] ?? null,
            'adresse'      => $data['adresse'] ?? null,
            'role'         => 'client', 
        ]);

        Client::create([
            'utilisateur_id' => $user->id,
        ]);

        $token = $user->createToken('spa')->plainTextToken;

        $user->load('client'); 

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    });
}
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = Utilisateur::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->mot_de_passe)) {
            return response()->json([
                'message' => 'Identifiants invalides.',
            ], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
    
        if ($user->estClient()) {
            $user->load('client');
        } 
        elseif ($user->estArtisan()) {
            $user->load('artisan');
        }
    
        return response()->json($user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }


// 1. Récupérer le profil complet (User + Client)
public function show(Request $request)
{
    // On charge le user connecté ainsi que sa ligne associée dans la table 'clients'
    $user = $request->user()->load('client');
    return response()->json($user);
}

// 2. Mettre à jour le profil et les données de livraison
public function update(Request $request)
{
    $user = $request->user();

    // Validation stricte des données reçues
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        'password' => 'nullable|string|min:8|confirmed',
        // Champs spécifiques à la table clients
        'telephone' => 'nullable|string|max:20',
        'adresse' => 'nullable|string|max:255',
        'ville' => 'nullable|string|max:100',
    ]);

    // Mise à jour de la table 'users'
    $user->update([
        'name' => $data['name'],
        'email' => $data['email'],
    ]);

    if (!empty($data['password'])) {
        $user->update(['password' => Hash::make($data['password'])]);
    }

    // Mise à jour ou création des détails dans la table 'clients'
    if ($user->client) {
        $user->client->update([
            'telephone' => $data['telephone'] ?? $user->client->telephone,
            'adresse' => $data['adresse'] ?? $user->client->adresse,
            'ville' => $data['ville'] ?? $user->client->ville,
        ]);
    }

    return response()->json([
        'message' => 'Profil mis à jour avec succès !',
        'user' => $user->load('client')
    ]);
}
}