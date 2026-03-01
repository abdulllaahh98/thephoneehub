<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $addresses = auth('api')->user()->addresses;
        return response()->json($addresses);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'line1' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'pin' => 'required|string|max:6',
            'type' => 'nullable|string|max:50',
            'is_default' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = auth('api')->user();

        // If this is the first address or marked as default, unset others
        if ($request->is_default || $user->addresses()->count() === 0) {
            $user->addresses()->update(['is_default' => false]);
            $request->merge(['is_default' => true]);
        }

        $address = $user->addresses()->create($request->all());

        return response()->json($address, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $address = auth('api')->user()->addresses()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'phone' => 'string|max:15',
            'line1' => 'string|max:255',
            'city' => 'string|max:255',
            'state' => 'string|max:255',
            'pin' => 'string|max:6',
            'is_default' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        if ($request->is_default) {
            auth('api')->user()->addresses()->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $address->update($request->all());

        return response()->json($address);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $address = auth('api')->user()->addresses()->findOrFail($id);

        $wasDefault = $address->is_default;
        $address->delete();

        // If we deleted the default, make another one default if exists
        if ($wasDefault) {
            $next = auth('api')->user()->addresses()->first();
            if ($next) {
                $next->update(['is_default' => true]);
            }
        }

        return response()->json(['message' => 'Address deleted successfully']);
    }
}
