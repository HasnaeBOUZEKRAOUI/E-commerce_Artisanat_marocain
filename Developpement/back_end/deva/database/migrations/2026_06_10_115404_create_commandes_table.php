<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->date('date_commande');
            $table->decimal('montant_total', 10, 2);
            $table->string('statut')->default('en_attente'); // en_attente | confirmee | expediee | livree | annulee
            $table->string('adresse_livraison');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};