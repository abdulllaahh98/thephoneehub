<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\WarrantyClaim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminReportController extends Controller
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
     * GET /api/v1/admin/reports/dashboard
     */
    public function dashboard()
    {
        try {
            $today = Carbon::today();
            $startOfMonth = Carbon::now()->startOfMonth();

            $stats = [
<<<<<<< HEAD
                'today_orders' => Order::whereDate('created_at', $today)->count(),
                'today_revenue' => Order::whereDate('created_at', $today)
                    ->whereIn('status', ['delivered', 'processing', 'shipped'])
                    ->sum('grand_total'),
                'total_orders_this_month' => Order::where('created_at', '>=', $startOfMonth)->count(),
                'revenue_this_month' => Order::where('created_at', '>=', $startOfMonth)
                    ->whereIn('status', ['delivered', 'processing', 'shipped'])
                    ->sum('grand_total'),
                'low_stock_products' => Product::where('stock_qty', '<=', 5)->count(),
                'pending_warranty_claims' => WarrantyClaim::whereIn('status', ['received', 'under_review'])->count(),
                'pending_orders' => Order::where('status', 'processing')->count(),
=======
                'total_revenue' => Order::whereNotIn('status', ['cancelled'])->sum('grand_total'),
                'today_orders' => Order::whereDate('created_at', $today)->count(),
                'orders_yesterday' => Order::whereDate('created_at', Carbon::yesterday())->count(),
                'low_stock_count' => Product::where('stock_qty', '<=', 5)->count(),
                'pending_warranty_claims' => WarrantyClaim::whereIn('status', ['received', 'under_review'])->count(),
                'recent_orders' => Order::with('user')
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get()
                    ->map(fn($o) => [
                        'id' => $o->order_number,
                        'customer' => $o->user->name,
                        'amount' => number_format($o->grand_total, 2),
                        'status' => $o->status
                    ]),
                'low_stock_items' => Product::where('stock_qty', '<=', 5)
                    ->select('id', 'brand', 'model', 'stock_qty')
                    ->limit(5)
                    ->get(),
>>>>>>> a45f52b (payment-integrated)
                'top_selling_products' => DB::table('order_items')
                    ->join('products', 'order_items.product_id', '=', 'products.id')
                    ->select('products.id', 'products.brand', 'products.model', DB::raw('SUM(order_items.quantity) as total_qty'))
                    ->where('order_items.created_at', '>=', Carbon::now()->subDays(30))
                    ->groupBy('products.id', 'products.brand', 'products.model')
                    ->orderByDesc('total_qty')
                    ->limit(5)
                    ->get()
            ];

            return $this->response(true, 'Dashboard stats retrieved', $stats);
        } catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve dashboard stats', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/admin/reports/sales
     */
    public function sales(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
            'group_by' => 'required|in:day,week,month'
        ]);

        try {
            $format = match($request->group_by) {
                'day' => '%Y-%m-%d',
                'week' => '%x-%v',
                'month' => '%Y-%m'
            };

            $sales = Order::select(
                    DB::raw("DATE_FORMAT(created_at, '{$format}') as period"),
                    DB::raw('COUNT(*) as order_count'),
                    DB::raw('SUM(grand_total) as revenue'),
                    DB::raw('AVG(grand_total) as avg_order_value')
                )
                ->whereBetween('created_at', [$request->date_from, $request->date_to])
                ->where('status', '!=', 'cancelled')
                ->groupBy('period')
                ->orderBy('period', 'asc')
                ->get();

            return $this->response(true, 'Sales data retrieved', $sales);
        } catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve sales data', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/admin/reports/sales/export
     */
    public function exportCsv(Request $request)
    {
        $request->validate([
            'date_from' => 'required|date',
            'date_to' => 'required|date|after_or_equal:date_from',
        ]);

        try {
            $orders = Order::with('user')
                ->whereBetween('created_at', [$request->date_from, $request->date_to])
                ->get();

            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"sales-report-{$request->date_from}-to-{$request->date_to}.csv\"",
            ];

            $callback = function() use ($orders) {
                $file = fopen('php://output', 'w');
                fputcsv($file, ['Order Number', 'Customer', 'Phone', 'Items Total', 'Grand Total', 'Method', 'Status', 'Date']);

                foreach ($orders as $order) {
                    fputcsv($file, [
                        $order->order_number,
                        $order->user->name,
                        $order->user->phone,
                        $order->subtotal,
                        $order->grand_total,
                        strtoupper($order->payment_method),
                        ucfirst($order->status),
                        $order->created_at->format('Y-m-d H:i')
                    ]);
                }
                fclose($file);
            };

            return response()->streamDownload($callback, "sales-report.csv", $headers);

        } catch (\Exception $e) {
            return $this->response(false, 'Export failed', null, $e->getMessage(), 500);
        }
    }
}
