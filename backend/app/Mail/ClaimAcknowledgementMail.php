<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\WarrantyClaim;

class ClaimAcknowledgementMail extends Mailable
{
    use Queueable, SerializesModels;

    public $claim;

    public function __construct(WarrantyClaim $claim)
    {
        $this->claim = $claim;
    }

    public function build()
    {
        return $this->subject("Claim Acknowledgement - {$this->claim->claim_number}")
            ->markdown('emails.warranty.claim_ack');
    }
}
