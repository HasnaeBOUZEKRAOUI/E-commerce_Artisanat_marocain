<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Utilisateur extends Authenticatable
{
    use Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'telephone',
        'adresse',
        'role',
    ];

    protected $hidden = [
        'mot_de_passe',
    ];

    protected function casts(): array
    {
        return [
            'mot_de_passe' => 'hashed',
        ];
    }

    // ─── Relations ────────────────────────────────────────

    public function client(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Client::class);
    }

    public function artisan(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Artisan::class);
    }

    public function notifications(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Notification::class);
    }

    // ─── Helpers ──────────────────────────────────────────

    public function estClient(): bool
    {
        return $this->role === 'client';
    }

    public function estArtisan(): bool
    {
        return $this->role === 'artisan';
    }

    public function estAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
