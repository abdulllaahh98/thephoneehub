<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\PinCode;
use App\Models\ServiceablePincode;
use App\Models\CodEligiblePincode;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\VariantResource;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ProductController extends Controller
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
     * GET /api/v1/products
     */
    public function index(Request $request)
    {
        try {
            $query = Product::where('is_active', true)
                ->with(['productImages', 'conditionGrade']);

            // Filters
            if ($request->has('brand')) {
                $query->where('brand', $request->brand);
            }
            if ($request->has('price_min')) {
                $query->where('price', '>=', $request->price_min);
            }
            if ($request->has('price_max')) {
                $query->where('price', '<=', $request->price_max);
            }
            if ($request->has('condition')) {
                $query->whereHas('conditionGrade', function ($q) use ($request) {
                    $q->where('grade_name', $request->condition);
                });
            }
            if ($request->has('storage')) {
                $query->where('storage', $request->storage);
            }
            if ($request->has('ram')) {
                $query->where('ram', $request->ram);
            }
            if ($request->has('colour')) {
                $query->where('colour', $request->colour);
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
                case 'popularity':
                    // Note: This would require a relationship with orderItems to sum quantities
                    $query->withCount('orderItems as total_sold')->orderBy('total_sold', 'desc');
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
            }

            $products = $query->paginate(24);

            return $this->response(true, 'Products retrieved successfully', [
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
            return $this->response(false, 'Failed to retrieve products', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/products/{id}
     */
    public function show($id)
    {
        try {
            $product = Product::with([
                'productImages',
                'productSpecs',
                'productAccessories',
                'productTags',
                'conditionGrade',
                'productVariants',
                'category'
            ])->where('is_active', true)->find($id);

            if (!$product) {
                return $this->response(false, 'Product not found', null, null, 404);
            }

            return $this->response(true, 'Product details retrieved', new ProductResource($product));
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve product', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/products/{id}/variants
     */
    public function variants($id)
    {
        try {
            $product = Product::find($id);
            if (!$product) {
                return $this->response(false, 'Product not found', null, null, 404);
            }

            $variants = $product->productVariants;

            // Grouping by storage and colour as requested
            $grouped = $variants->groupBy('storage')->map(function ($items) {
                return $items->groupBy('colour')->map(function ($subItems) {
                        return VariantResource::collection($subItems);
                    }
                    );
                });

            return $this->response(true, 'Variants retrieved', $grouped);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve variants', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/pincodes/{pin}
     */
    public function checkPincode($pin)
    {
        try {
            if (strlen($pin) !== 6 || !is_numeric($pin)) {
                return $this->response(false, 'Invalid PIN code. Must be 6 digits.', null, null, 400);
            }

            $pinData = PinCode::where('pin', $pin)->first();

            if (!$pinData) {
                return $this->response(false, 'Pincode not found', null, null, 404);
            }

            $isServiceable = ServiceablePincode::where('pin', $pin)->exists() || $pinData->is_serviceable;
            $isCodEligible = CodEligiblePincode::where('pin', $pin)->exists();

            $eddDays = $pinData->edd_days ?? 5;
            $eddDate = Carbon::now()->addDays($eddDays)->format('Y-m-d');

            return $this->response(true, 'Pincode info retrieved', [
                'city' => $pinData->city,
                'state' => $pinData->state,
                'is_serviceable' => $isServiceable,
                'edd_days' => $eddDays,
                'edd_date' => $eddDate,
                'cod_available' => $isCodEligible
            ]);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to check pincode', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/categories
     */
    public function categories()
    {
        try {
            $categories = Category::where('is_active', true)->get();
            return $this->response(true, 'Categories retrieved', $categories);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve categories', null, $e->getMessage(), 500);
        }
    }
}
