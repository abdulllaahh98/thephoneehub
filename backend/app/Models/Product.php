<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function conditionGrade()
    {
        return $this->belongsTo(ConditionGrade::class);
    }

<<<<<<< HEAD
=======
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

>>>>>>> a45f52b (payment-integrated)
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

<<<<<<< HEAD
=======
    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

>>>>>>> a45f52b (payment-integrated)
    public function productSpecs()
    {
        return $this->hasMany(ProductSpec::class);
    }

    public function productAccessories()
    {
        return $this->hasMany(ProductAccessory::class);
    }

    public function productTags()
    {
        return $this->hasMany(ProductTag::class);
    }

    public function productVariants()
    {
        return $this->hasMany(ProductVariant::class);
    }
<<<<<<< HEAD

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
=======
>>>>>>> a45f52b (payment-integrated)
}
