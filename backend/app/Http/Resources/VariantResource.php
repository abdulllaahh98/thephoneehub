<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VariantResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'storage' => $this->storage,
            'colour' => $this->colour,
            'price' => $this->price,
            'stock_qty' => $this->stock_qty
        ];
    }
}
