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
    public function getPrincipaleImageAttribute()
{
    if ($this->image_url) {
        return asset('storage/' . $this->image_url);
    }

    $produit = $this->produits()
        ->where('statut', 'actif')
        ->with('images')
        ->first();

    if ($produit) {
        return $produit->getPrincipaleImage()?->url_image;
    }

    return asset('images/default-category.jpg'); // Image de secours
}
}