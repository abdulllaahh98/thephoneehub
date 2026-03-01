<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\SearchLog;
use App\Http\Resources\ProductListResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    /**
     * Standardized JSON response helper.
     */
    protected function response($success, $message, $data = null, $errors = null, $code = 200)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'errors' => $errors
        ], $code);
    }

    /**
     * GET /api/v1/products/search?q=
     */
    public function search(Request $request)
    {
        try {
            $q = $request->query('q');

            if (strlen($q) < 3) {
                return $this->response(false, 'Search query must be at least 3 characters', null, null, 422);
            }

            // Using MySQL FULLTEXT search as requested
            // MATCH(brand, model, description) AGAINST(? IN BOOLEAN MODE)
            $query = Product::where('is_active', true)
                ->whereRaw("MATCH(brand, model, description) AGAINST(? IN BOOLEAN MODE)", [$q])
                ->with(['productImages', 'conditionGrade']);

            // Support filters during search (same as index)
            if ($request->has('brand')) {
                $query->where('brand', $request->brand);
            }
            if ($request->has('price_min')) {
                $query->where('price', '>=', $request->price_min);
            }
            if ($request->has('price_max')) {
                $query->where('price', '<=', $request->price_max);
            }

            // Sorting
            switch ($request->sort) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                default:
                    // By default, match against provides its own relevance but here we'll stick to newest unless specified
                    $query->orderBy('created_at', 'desc');
            }

            $products = $query->paginate(24);

            // LOG the query
            SearchLog::create([
                'user_id' => auth('api')->id(),
                'query' => $q,
                'result_count' => $products->total(),
            ]);

            return $this->response(true, 'Search results retrieved', [
                'products' => ProductListResource::collection($products),
                'meta' => [
                    'total' => $products->total(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                ]
            ]);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Search failed', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/products/search/suggest?q=
     */
    public function suggest(Request $request)
    {
        try {
            $q = $request->query('q');

            if (!$q) {
                return $this->response(true, 'No query provided', []);
            }

            // Fast prefix search for autocomplete (max 8)
            $suggestions = Product::where('is_active', true)
                ->where(function ($query) use ($q) {
                $query->where('model', 'LIKE', $q . '%')
                    ->orWhere('brand', 'LIKE', $q . '%');
            })
                ->select('id', 'brand', 'model')
                ->limit(8)
                ->get();

            return $this->response(true, 'Suggestions retrieved', $suggestions);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Suggestion failed', null, $e->getMessage(), 500);
        }
    }
}
