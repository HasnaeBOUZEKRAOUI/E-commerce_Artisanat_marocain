<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('caracteristiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('produit_id')->constrained('produits')->cascadeOnDelete();
            $table->string('nom');
            $table->text('valeur');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('caracteristiques');
    }
};