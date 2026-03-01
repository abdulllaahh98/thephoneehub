<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warranty;
use App\Models\WarrantyClaim;
use App\Mail\ClaimAcknowledgementMail;
use App\Jobs\SendSmsNotification;
;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class WarrantyClaimController extends Controller
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
     * GET /api/v1/warranty-claims
     */
    public function index()
    {
        try {
            $user = auth('api')->user();
            $claims = WarrantyClaim::whereHas('warranty', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
                ->with(['warranty.product', 'warranty.order'])
                ->orderBy('created_at', 'desc')
                ->get();

            $formatted = $claims->map(function ($claim) {
                return [
                'claim_id' => $claim->id,
                'claim_number' => $claim->claim_number,
                'issue_type' => $claim->issue_type,
                'status' => $claim->status,
                'created_at' => $claim->created_at,
                'product_brand' => $claim->warranty->product->brand,
                'product_model' => $claim->warranty->product->model,
                ];
            });

            return $this->response(true, 'Warranty claims retrieved', $formatted);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve claims', null, $e->getMessage(), 500);
        }
    }

    /**
     * POST /api/v1/warranty-claims
     */
    public function store(Request $request)
    {
        $request->validate([
            'warranty_id' => 'required|exists:warranties,id',
            'issue_type' => 'required|in:hardware_defect,screen_malfunction,battery_failure,other',
            'description' => 'required|string|min:20',
            'evidence' => 'required|array|min:1|max:5',
            'evidence.*' => 'required|file|mimes:jpeg,png,webp,mp4|max:5120', // 5MB
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $user = auth('api')->user();
                $warranty = Warranty::lockForUpdate()->find($request->warranty_id);

                if (!$warranty || $warranty->user_id !== $user->id) {
                    return $this->response(false, 'Warranty not found or unauthorized', null, null, 403);
                }

                if ($warranty->status !== 'active' || Carbon::parse($warranty->end_date)->isPast()) {
                    return $this->response(false, 'This warranty is no longer active or has expired.', null, null, 422);
                }

                // Generate Claim Number
                $dateStr = date('Ymd');
                $lastClaimCount = WarrantyClaim::whereDate('created_at', Carbon::today())->count();
                $sequence = str_pad($lastClaimCount + 1, 5, '0', STR_PAD_LEFT);
                $claimNumber = "WC-{$dateStr}-{$sequence}";

                // Store files
                $evidencePaths = [];
                if ($request->hasFile('evidence')) {
                    foreach ($request->file('evidence') as $file) {
                        $path = $file->store('claims/' . $claimNumber, 'public');
                        $evidencePaths[] = $path;
                    }
                }

                // Create claim
                $claim = WarrantyClaim::create([
                    'warranty_id' => $warranty->id,
                    'claim_number' => $claimNumber,
                    'issue_type' => $request->issue_type,
                    'description' => $request->description,
                    'evidence_paths' => $evidencePaths,
                    'status' => 'received'
                ]);

                // Update warranty status
                $warranty->update(['status' => 'claimed']);

                // Notifications (Queued)
                Mail::to($user->email)->queue(new ClaimAcknowledgementMail($claim));

                $smsMessage = "Claim Received! Your claim {$claimNumber} has been submitted successfully. We will update you within 24 hours.";
                dispatch(new SendSmsNotification($user->phone, $smsMessage))->delay(now()->addMinutes(1)); // Simulate queue/delay

                return $this->response(true, 'Claim submitted successfully. You will hear from us within 24 hours.', [
                    'claim_id' => $claim->id,
                    'claim_number' => $claim->claim_number,
                    'status' => 'received'
                ], null, 201);
            });
        }
        catch (\Exception $e) {
            return $this->response(false, 'Claim submission failed', null, $e->getMessage(), 500);
        }
    }

    /**
     * GET /api/v1/warranty-claims/{id}
     */
    public function show($id)
    {
        try {
            $user = auth('api')->user();
            $claim = WarrantyClaim::with(['warranty.product', 'warranty.order'])->find($id);

            if (!$claim || $claim->warranty->user_id !== $user->id) {
                return $this->response(false, 'Claim not found', null, null, 404);
            }

            return $this->response(true, 'Claim details retrieved', $claim);
        }
        catch (\Exception $e) {
            return $this->response(false, 'Failed to retrieve claim details', null, $e->getMessage(), 500);
        }
    }
}
