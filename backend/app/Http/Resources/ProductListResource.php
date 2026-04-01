<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
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
            'image' => $this->productImages->where('is_primary', true)->first()->image_path ?? $this->productImages->first()->image_path ?? null,
            'image_url' => ($this->productImages->where('is_primary', true)->first()->image_path ?? $this->productImages->first()->image_path ?? null)
                ? url('/storage/' . ($this->productImages->where('is_primary', true)->first()->image_path ?? $this->productImages->first()->image_path))
                : null,
            'condition' => $this->conditionGrade->label ?? null,
            'storage' => $this->storage,
            'ram' => $this->ram,
            'colour' => $this->colour,
        ];
    }
}
