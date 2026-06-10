<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'utilisateur_id',
        'message',
        'date_notification',
        'lu',
    ];

    protected function casts(): array
    {
        return [
            'date_notification' => 'date',
            'lu'                => 'boolean',
        ];
    }

    public function utilisateur(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Utilisateur::class);
    }

    public function marquerCommeLue(): void
    {
        $this->update(['lu' => true]);
    }
}
