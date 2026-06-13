<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            // Niveau 1 : grande catégorie (Home & Living, Fashion...)
            // Niveau 2 : sous-catégorie (Dining, Living Room...)
            // Niveau 3 : sous-sous-catégorie (Cups & Mugs, Tagines...)
            $table->unsignedBigInteger('parent_id')->nullable()->after('id');
            $table->foreign('parent_id')->references('id')->on('categories')->nullOnDelete();
            $table->integer('niveau')->default(1)->after('parent_id'); // 1, 2 ou 3
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn(['parent_id', 'niveau']);
        });
    }
};