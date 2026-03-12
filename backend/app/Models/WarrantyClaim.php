<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarrantyClaim extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'evidence_paths' => 'array',
        'resolved_at' => 'datetime'
    ];

    public function warranty()
    {
        return $this->belongsTo(Warranty::class);
    }
}
