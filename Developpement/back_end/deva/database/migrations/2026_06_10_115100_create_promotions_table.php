<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produit_id')->constrained('produits')->cascadeOnDelete();
            $table->integer('type'); // 1=pourcentage, 2=montant fixe
            $table->string('nom');
            $table->text('description')->nullable();
            $table->integer('pourcentage')->nullable();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->boolean('est_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};