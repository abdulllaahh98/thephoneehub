<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
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
     * GET /api/v1/admin/users
     */
    public function index(Request $request)
    {
        try {
            $users = User::when($request->search, function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%")
                    ->orWhere('phone', 'like', "%{$request->search}%");
            })
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return $this->response(true, 'Users retrieved', $users);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve users', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/admin/users/{id}
     */
    public function show($id)
    {
        try {
            $user = User::with(['addresses', 'orders', 'warranties'])->findOrFail($id);
            return $this->response(true, 'User details retrieved', $user);
        }
        catch (\Exception $e) {
            return $this->response(false, 'User not found', null, $e->getMessage(), 404);
        }
    }

    /**
     * PATCH /api/v1/admin/users/{id}/role
     */
    public function updateRole(Request $request, $id)
    {
        $request->validate(['role' => 'required|in:customer,admin,superadmin']);

        try {
            $user = User::findOrFail($id);
            $user->update(['role' => $request->role]);

            return $this->response(true, "User role updated to {$request->role}", $user);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to update role', null, $e->getMessage(), 500);
        }
    }
}
