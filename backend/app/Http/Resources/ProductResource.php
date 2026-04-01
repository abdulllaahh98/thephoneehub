<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'brand' => $this->brand,
            'model' => $this->model,
            'price' => $this->price,
            'mrp' => $this->mrp,
            'stock_qty' => $this->stock_qty,
            'description' => $this->description,
            'storage' => $this->storage,
            'ram' => $this->ram,
            'colour' => $this->colour,
            'is_active' => $this->is_active,
            'category' => $this->category->name ?? null,
            'condition' => $this->conditionGrade->label ?? null,
            'images' => $this->productImages->map(function ($img) {
            return [
                    'id' => $img->id,
                    'image_path' => $img->image_path,
<<<<<<< HEAD
=======
                    'image_url' => $img->image_path ? url('/storage/' . $img->image_path) : null,
>>>>>>> a45f52b (payment-integrated)
                    'is_primary' => $img->is_primary
                ];
        }),
            'specs' => $this->productSpecs->map(function ($spec) {
            return [
                    'id' => $spec->id,
                    'spec_key' => $spec->spec_key,
                    'spec_value' => $spec->spec_value
                ];
        }),
            'accessories' => $this->productAccessories->map(function ($acc) {
            return [
                    'id' => $acc->id,
                    'accessory_name' => $acc->accessory_name
                ];
        }),
            'tags' => $this->productTags->map(function ($tag) {
            return [
                    'id' => $tag->id,
                    'tag_name' => $tag->tag_name
                ];
        }),
            'variants' => $this->productVariants->map(function ($variant) {
            return [
                    'id' => $variant->id,
                    'storage' => $variant->storage,
                    'colour' => $variant->colour,
                    'price' => $variant->price,
                    'stock_qty' => $variant->stock_qty
                ];
        }),
        ];
    }
}
