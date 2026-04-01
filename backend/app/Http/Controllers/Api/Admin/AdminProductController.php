<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\InventoryAuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use League\Csv\Reader;

class AdminProductController extends Controller
{
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
     * GET /api/v1/admin/products
     */
    public function index(Request $request)
    {
        try {
<<<<<<< HEAD
            $user = auth('api')->user();
            $products = Product::with(['category', 'conditionGrade'])
                ->when($user->role !== 'superadmin', function ($q) use ($user) {
                    $q->where('admin_id', $user->id);
                })
                ->when($request->search, function ($q) use ($request) {
                    $q->where(function($inner) use ($request) {
                        $inner->where('model', 'like', "%{$request->search}%")
                              ->orWhere('brand', 'like', "%{$request->search}%");
                    });
                })
=======
            $products = Product::with(['category', 'conditionGrade', 'admin', 'primaryImage'])
                ->when($request->search, function ($q) use ($request) {
                $q->where('model', 'like', "%{$request->search}%")
                    ->orWhere('brand', 'like', "%{$request->search}%");
            })
>>>>>>> a45f52b (payment-integrated)
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return $this->response(true, 'Products retrieved', $products);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve products', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/admin/products
     */
    public function store(Request $request)
    {
        // Flexible validation to allow frontend to send fewer fields
        $validated = $request->validate([
            'brand' => 'required|string',
            'model' => 'required|string',
            'storage' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_qty' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'condition' => 'nullable|string', // Frontend sends "Excellent", etc.
            'image' => 'nullable|image|max:5120', // Support image upload
        ]);

        try {
            $product = DB::transaction(function () use ($request, $validated) {
                // 1. Solve Missing Category & Condition Grade
                $categoryId = $request->category_id ?? 1; // Default to Smartphones

                // Map condition string to ID
                $conditionGradeId = $request->condition_grade_id;
                if (!$conditionGradeId && isset($validated['condition'])) {
<<<<<<< HEAD
                    $conditionSearch = $validated['condition'];
                    // Clean up "Mint (Like New)" to just search for portions if needed
                    $grade = \App\Models\ConditionGrade::where('label', 'like', "%{$conditionSearch}%")->first();
                    
                    // Fallback for common frontend strings
                    if (!$grade) {
                        if (str_contains(strtolower($conditionSearch), 'mint')) $grade = \App\Models\ConditionGrade::where('code', 'A+')->first();
                        elseif (str_contains(strtolower($conditionSearch), 'excellent')) $grade = \App\Models\ConditionGrade::where('code', 'A')->first();
                        elseif (str_contains(strtolower($conditionSearch), 'good')) $grade = \App\Models\ConditionGrade::where('code', 'B')->first();
                        elseif (str_contains(strtolower($conditionSearch), 'fair')) $grade = \App\Models\ConditionGrade::where('code', 'C')->first();
                    }
                    
=======
                    $grade = \App\Models\ConditionGrade::where('label', 'like', "%{$validated['condition']}%")->first();
>>>>>>> a45f52b (payment-integrated)
                    $conditionGradeId = $grade ? $grade->id : 1;
                }
                $conditionGradeId = $conditionGradeId ?? 1;

                // 2. Generate SKU
                $sku = $request->sku ?? 'TPH-' . strtoupper(substr($validated['brand'], 0, 3)) . '-' . strtoupper(substr($validated['model'], 0, 3)) . '-' . rand(1000, 9999);

<<<<<<< HEAD
=======
                $adminId = auth('api')->id() ?? 1;

>>>>>>> a45f52b (payment-integrated)
                // 3. Create Product
                $product = Product::create([
                    'sku' => $sku,
                    'category_id' => $categoryId,
                    'condition_grade_id' => $conditionGradeId,
<<<<<<< HEAD
                    'admin_id' => auth('api')->id(), // Ownership
=======
                    'admin_id' => $adminId,
>>>>>>> a45f52b (payment-integrated)
                    'brand' => $validated['brand'],
                    'model' => $validated['model'],
                    'storage' => $validated['storage'],
                    'ram' => $request->ram ?? '8GB', // Default
                    'colour' => $request->colour ?? 'Default',
                    'price' => $validated['price'],
                    'mrp' => $request->mrp ?? ($validated['price'] * 1.2), // Default MRP
                    'stock_qty' => $validated['stock_qty'],
                    'description' => $validated['description'] ?? '',
                    'is_active' => true,
                ]);

                // 4. Handle Image Upload
                if ($request->hasFile('image')) {
                    $image = $request->file('image');
                    // Store in public/products
                    $path = $image->store('products', 'public');

                    \App\Models\ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'is_primary' => true
                    ]);
                }

<<<<<<< HEAD
                // Log creation — use fallback admin ID if unauthenticated
                try {
                    InventoryAuditLog::create([
                        'product_id' => $product->id,
                        'admin_id' => auth('api')->id() ?? 1,
=======
                // Log creation
                try {
                    InventoryAuditLog::create([
                        'product_id' => $product->id,
                        'admin_id' => $adminId,
>>>>>>> a45f52b (payment-integrated)
                        'action' => 'add',
                        'new_stock' => $product->stock_qty,
                        'notes' => 'Product initialized via Admin Panel',
                    ]);
                }
                catch (\Exception $logEx) {
                    \Log::warning('Audit log failed: ' . $logEx->getMessage());
                }

                return $product;
            });

            return $this->response(true, 'Product created successfully', $product, null, 201);
        }
        catch (\Exception $e) {
<<<<<<< HEAD
            \Log::error('Product creation failed: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
=======
>>>>>>> a45f52b (payment-integrated)
            return $this->response(false, 'Failed to create product', null, $e->getMessage(), 500);
        }
    }

    /**
     * DELETE /api/v1/admin/products/{id}
     */
    public function destroy($id)
    {
        try {
<<<<<<< HEAD
            $user = auth('api')->user();
            $product = Product::findOrFail($id);

            // Ownership Check
            if ($user->role !== 'superadmin' && $product->admin_id !== $user->id) {
                return $this->response(false, 'Unauthorized. You do not own this product.', null, null, 403);
            }

=======
            $product = Product::findOrFail($id);

>>>>>>> a45f52b (payment-integrated)
            DB::transaction(function () use ($product) {
                // Delete all FK-dependent child records first
                \Illuminate\Support\Facades\DB::table('inventory_audit_logs')->where('product_id', $product->id)->delete();
                \Illuminate\Support\Facades\DB::table('product_images')->where('product_id', $product->id)->delete();
                \Illuminate\Support\Facades\DB::table('product_specs')->where('product_id', $product->id)->delete();
                \Illuminate\Support\Facades\DB::table('product_tags')->where('product_id', $product->id)->delete();
                \Illuminate\Support\Facades\DB::table('product_variants')->where('product_id', $product->id)->delete();
                \Illuminate\Support\Facades\DB::table('product_accessories')->where('product_id', $product->id)->delete();
                \Illuminate\Support\Facades\DB::table('cart_items')->where('product_id', $product->id)->delete();

                // Now safe to delete the product
                $product->delete();
            });

            return $this->response(true, 'Product deleted successfully');
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to delete product', null, $e->getMessage(), 500);
        }
    }

    /**
     * PUT /api/v1/admin/products/{id}
     */
    public function update(Request $request, $id)
    {
<<<<<<< HEAD
        $user = auth('api')->user();
        $product = Product::findOrFail($id);

        // Ownership Check
        if ($user->role !== 'superadmin' && $product->admin_id !== $user->id) {
            return $this->response(false, 'Unauthorized. You do not own this product.', null, null, 403);
        }

=======
        $product = Product::findOrFail($id);
>>>>>>> a45f52b (payment-integrated)
        $validated = $request->validate([
            'brand' => 'string',
            'model' => 'string',
            'price' => 'numeric|min:0',
            'stock_qty' => 'integer|min:0',
            'is_active' => 'boolean'
        ]);

        try {
            DB::transaction(function () use ($product, $validated) {
                $product->update($validated);

                try {
                    InventoryAuditLog::create([
                        'product_id' => $product->id,
                        'admin_id' => auth('api')->id() ?? 1,
                        'action' => 'edit',
                        'notes' => 'General product update',
                    ]);
                }
                catch (\Exception $logEx) {
                    \Log::warning('Audit log failed: ' . $logEx->getMessage());
                }
            });

            return $this->response(true, 'Product updated successfully', $product);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to update product', null, $e->getMessage(), 500);
        }
    }

    /**
     * PATCH /api/v1/admin/products/{id}/stock
     */
    public function updateStock(Request $request, $id)
    {
<<<<<<< HEAD
        $user = auth('api')->user();
        $product = Product::findOrFail($id);

        // Ownership Check
        if ($user->role !== 'superadmin' && $product->admin_id !== $user->id) {
            return $this->response(false, 'Unauthorized. You do not own this product.', null, null, 403);
        }

=======
>>>>>>> a45f52b (payment-integrated)
        $request->validate([
            'stock_qty' => 'required|integer|min:0',
            'notes' => 'nullable|string'
        ]);

        try {
<<<<<<< HEAD
=======
            $product = Product::findOrFail($id);
>>>>>>> a45f52b (payment-integrated)
            $oldStock = $product->stock_qty;

            DB::transaction(function () use ($product, $request, $oldStock) {
                $product->update(['stock_qty' => $request->stock_qty]);

                try {
                    InventoryAuditLog::create([
                        'product_id' => $product->id,
                        'admin_id' => auth('api')->id() ?? 1,
                        'action' => 'stock_update',
                        'old_stock' => $oldStock,
                        'new_stock' => $request->stock_qty,
                        'notes' => $request->notes ?? 'Manual stock update',
                    ]);
                }
                catch (\Exception $logEx) {
                    \Log::warning('Audit log failed: ' . $logEx->getMessage());
                }
            });

            return $this->response(true, 'Stock updated successfully', $product);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to update stock', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/admin/products/bulk-upload
     */
    public function bulkUpload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048'
        ]);

        try {
            $file = $request->file('file');
            $reader = Reader::createFromPath($file->getPathname());
            $reader->setHeaderOffset(0);

            $inserted = 0;
            $skipped = 0;
            $errors = [];
            $rowNum = 1;

            foreach ($reader->getRecords() as $row) {
                $rowNum++;

                // Basic inline validation
                if (empty($row['brand']) || empty($row['model']) || empty($row['price'])) {
                    $skipped++;
                    $errors[] = ['row' => $rowNum, 'error' => 'Missing required fields'];
                    continue;
                }

                try {
<<<<<<< HEAD
                    $adminId = auth('api')->id();
                    DB::transaction(function () use ($row, &$inserted, $adminId) {
=======
                    DB::transaction(function () use ($row, &$inserted) {
>>>>>>> a45f52b (payment-integrated)
                        $product = Product::create([
                            'brand' => $row['brand'],
                            'model' => $row['model'],
                            'storage' => $row['storage'] ?? 'N/A',
                            'ram' => $row['ram'] ?? 'N/A',
                            'colour' => $row['colour'] ?? 'N/A',
                            'category_id' => $row['category_id'] ?? 1,
<<<<<<< HEAD
                            'admin_id' => $adminId, // Ownership
=======
>>>>>>> a45f52b (payment-integrated)
                            'price' => $row['price'],
                            'mrp' => $row['mrp'] ?? $row['price'],
                            'stock_qty' => $row['stock_qty'] ?? 0,
                            'description' => $row['description'] ?? '',
                            'condition_grade_id' => 1 // Default or lookup
                        ]);

                        try {
                            InventoryAuditLog::create([
                                'product_id' => $product->id,
                                'admin_id' => auth('api')->id() ?? 1,
                                'action' => 'add',
                                'new_stock' => $product->stock_qty,
                                'notes' => 'Bulk CSV Upload',
                            ]);
                        }
                        catch (\Exception $logEx) {
                            \Log::warning('Audit log failed: ' . $logEx->getMessage());
                        }

                        $inserted++;
                    });
                }
                catch (\Exception $e) {
                    $skipped++;
                    $errors[] = ['row' => $rowNum, 'error' => $e->getMessage()];
                }
            }

            return $this->response(true, 'Bulk upload completed', [
                'total_rows' => $inserted + $skipped,
                'inserted' => $inserted,
                'skipped' => $skipped,
                'errors' => $errors
            ]);

        }
        catch (\Exception $e) {
            return $this->response(false, 'Bulk upload failed', null, $e->getMessage(), 500);
        }
    }
}
