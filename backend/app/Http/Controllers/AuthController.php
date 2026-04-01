<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Otp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
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
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:15|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->response(false, 'Validation failed', null, $validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password, ['rounds' => 12]),
            'role' => 'customer',
<<<<<<< HEAD
        ]);

        return $this->issueTokens($user, 'Registration successful', 210);
=======
            'is_verified' => true, // Automatically verify for smoother onboarding
        ]);

        return $this->issueTokens($user, 'Registration successful', 201);
>>>>>>> a45f52b (payment-integrated)
    }

    /**
     * Send OTP to phone (simulator).
     */
    public function sendOtp(Request $request)
    {
        $request->validate(['phone' => 'required|string|max:15']);

        $code = rand(100000, 999999);
        Otp::create([
            'phone' => $request->phone,
            'code' => $code, // In production, hash this
            'expires_at' => Carbon::now()->addMinutes(10),
        ]);

        // SIMULATOR: Log the OTP instead of sending SMS
        \Log::info("OTP for {$request->phone}: {$code}");

        return $this->response(true, 'OTP sent successfully (Simulator: Check Laravel logs)');
    }

    /**
     * Verify OTP.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|string',
        ]);

        $otp = Otp::where('phone', $request->phone)
            ->where('code', $request->code)
            ->where('is_used', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$otp) {
            return $this->response(false, 'Invalid or expired OTP', null, null, 400);
        }

        $otp->update(['is_used' => true]);

        // Mark user as verified if they exist
        $user = User::where('phone', $request->phone)->first();
        if ($user) {
            $user->update(['is_verified' => true]);
        }

        return $this->response(true, 'OTP verified successfully');
    }

    /**
     * Login user.
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $request->email)->first();

        if ($user && $user->locked_until && $user->locked_until > Carbon::now()) {
            return $this->response(false, 'Account is locked. Please try again after 30 minutes.', null, null, 423);
        }

        if (!$token = auth('api')->attempt($credentials)) {
            if ($user) {
                $user->increment('failed_login_attempts');
                if ($user->failed_login_attempts >= 5) {
                    $user->update([
                        'locked_until' => Carbon::now()->addMinutes(30),
                        'failed_login_attempts' => 0
                    ]);
                }
            }
<<<<<<< HEAD
            return $this->response(false, 'Invalid email or password', null, null, 401);
=======
            return $this->response(false, 'Invalid email or password', null, ['auth' => ['Invalid email or password']], 401);
>>>>>>> a45f52b (payment-integrated)
        }

        // Reset fail count on success
        $user->update(['failed_login_attempts' => 0, 'locked_until' => null]);

        return $this->issueTokens($user, 'Login successful');
    }

    /**
     * Refresh Token (Access Token).
     */
    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            // Some clients might send it in body for testing
            $refreshToken = $request->refresh_token;
        }

        if (!$refreshToken) {
            return $this->response(false, 'Refresh token missing', null, null, 401);
        }

        $user = User::where('refresh_token', $refreshToken)->first();

        if (!$user) {
            return $this->response(false, 'Invalid refresh token', null, null, 401);
        }

        // Generate new access token
        $token = auth('api')->tokenById($user->id);

        return $this->response(true, 'Token refreshed', [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user
        ]);
    }

    /**
     * Logout.
     */
    public function logout()
    {
        $user = auth('api')->user();
        if ($user) {
            $user->update(['refresh_token' => null]);
        }

        auth('api')->logout();

        return $this->response(true, 'Successfully logged out')
            ->withCookie(cookie()->forget('refresh_token'));
    }

    /**
     * Forgot Password (OTP based).
     */
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();

        // In a real app we'd send an email link, but the user asked for OTP-like endpoints 
        // We'll simulate a reset token request
        $token = Str::random(60);
        DB::table('password_resets')->updateOrInsert(
        ['email' => $user->email],
        ['token' => Hash::make($token), 'created_at' => Carbon::now()]
        );

        \Log::info("Password reset token for {$user->email}: {$token}");

        return $this->response(true, 'Password reset link sent (Simulator: Check Laravel logs)');
    }

    /**
     * Reset Password.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->response(false, 'Validation failed', null, $validator->errors(), 400);
        }

        $reset = DB::table('password_resets')->where('email', $request->email)->first();

        if (!$reset || !Hash::check($request->token, $reset->token)) {
            return $this->response(false, 'Invalid reset token', null, null, 400);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password' => Hash::make($request->password, ['rounds' => 12])]);

        DB::table('password_resets')->where('email', $request->email)->delete();

        return $this->response(true, 'Password reset successful');
    }

    /**
     * Issue Access & Refresh tokens.
     */
    protected function issueTokens($user, $message, $code = 200)
    {
        $accessToken = auth('api')->login($user);
        $refreshToken = Str::random(64);

        $user->update(['refresh_token' => $refreshToken]);

        // HTTP-only cookie for refresh token (30 days)
        $cookie = cookie(
            'refresh_token',
            $refreshToken,
            60 * 24 * 30, // 30 days in minutes
            '/',
            null,
            false, // secure (true in production)
            true, // httpOnly
            false, // raw
            'Lax' // sameSite
        );

        return $this->response(true, $message, [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken, // Also returning in body for easy testing
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user
        ], null, $code)->withCookie($cookie);
    }

    public function me()
    {
        return $this->response(true, 'User details retrieved', auth('api')->user());
    }
<<<<<<< HEAD
=======

    /**
     * Update profile details and optionally password.
     */
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();
        if (!$user) {
            return $this->response(false, 'Unauthorized', null, null, 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:15|unique:users,phone,' . $user->id,
            'password' => 'sometimes|string|min:6',
        ]);

        if ($validator->fails()) {
            return $this->response(false, 'Validation failed', null, $validator->errors(), 400);
        }

        $payload = $request->only(['name', 'email', 'phone']);
        if ($request->filled('password')) {
            $payload['password'] = Hash::make($request->password, ['rounds' => 12]);
        }

        $user->update($payload);

        return $this->response(true, 'Profile updated successfully', $user->fresh());
    }
>>>>>>> a45f52b (payment-integrated)
}
