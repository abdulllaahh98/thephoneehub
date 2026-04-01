<?php

namespace App\Http\Controllers;

use App\Models\Product;
<<<<<<< HEAD
=======
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
>>>>>>> a45f52b (payment-integrated)
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
<<<<<<< HEAD
        $query = Product::query();
=======
        $query = Product::query()
            ->with(['productImages', 'category', 'conditionGrade']);
>>>>>>> a45f52b (payment-integrated)

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

<<<<<<< HEAD
        return response()->json($products);
=======
        return ProductListResource::collection($products);
>>>>>>> a45f52b (payment-integrated)
    }

    public function show($id)
    {
<<<<<<< HEAD
        $product = Product::findOrFail($id);
        return response()->json($product);
=======
        $product = Product::with([
            'productImages',
            'category',
            'conditionGrade',
            'productSpecs',
            'productAccessories',
            'productTags',
            'productVariants'
        ])->findOrFail($id);
        
        return new ProductResource($product);
>>>>>>> a45f52b (payment-integrated)
    }
}
