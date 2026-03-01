<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Search logic using FULLTEXT index
        if ($request->has('q') && !empty($request->q)) {
            $searchTerm = $request->q;
            $query->whereRaw("MATCH(brand, model, description) AGAINST(? IN NATURAL LANGUAGE MODE)", [$searchTerm]);
        }

        // Filtering
        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('condition_grade')) {
            $query->where('condition_grade_id', $request->condition_grade);
        }

        // Sorting
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        $limit = $request->get('limit', 12);
        $products = $query->paginate($limit);

        return response()->json($products);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }
}
