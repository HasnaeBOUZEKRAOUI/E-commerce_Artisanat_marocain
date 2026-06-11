<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nom'          => 'required|string|max:100',
            'prenom'       => 'required|string|max:100',
            'email'        => 'required|email|unique:utilisateurs,email',
            'mot_de_passe' => 'required|string|min:8|confirmed',
            'telephone'    => 'nullable|string',
            'adresse'      => 'nullable|string',
            'role'         => 'in:client,artisan',
        ]);

        $user = Utilisateur::create([
            ...$data,
            'mot_de_passe' => Hash::make($data['mot_de_passe']),
            'role'         => $data['role'] ?? 'client',
        ]);

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
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

        // Révoque les anciens tokens pour éviter l'accumulation
        $user->tokens()->delete();

        $token = $user->createToken('spa')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
}