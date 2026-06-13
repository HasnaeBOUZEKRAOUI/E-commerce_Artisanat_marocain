<?php
// app/Models/Categorie.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $table = 'categories';

    protected $fillable = ['parent_id', 'niveau', 'nom', 'slug', 'description', 'image_url'];

    public function enfants()
    {
        return $this->hasMany(Categorie::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Categorie::class, 'parent_id');
    }

    public function produits()
    {
        return $this->hasMany(Produit::class);
    }
}