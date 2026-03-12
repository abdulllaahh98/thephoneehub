<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Warranty;

class WarrantyActivatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $warranty;

    public function __construct(Warranty $warranty)
    {
        $this->warranty = $warranty;
    }

    public function build()
    {
        return $this->subject("Warranty Activated! Order #{$this->warranty->order->order_number}")
            ->markdown('emails.warranty.activated');
    }
}
