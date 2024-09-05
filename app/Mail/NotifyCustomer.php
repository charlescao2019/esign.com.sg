<?php

namespace App\Mail;

use App\Models\LeaveRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyCustomer extends Mailable
{
    /**
     * Create a new message instance.
     *
     * @return void
     */

    public $document;
    public $signer;

    public function __construct($document, $signer)
    {
        $this->document = $document;
        $this->signer = $signer;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $url = asset('storage/documents/signed/' . $this->document->signed_filename);
        return
            $this->from(env('MAIL_FROM_ADDRESS'), 'E-sign')
            ->subject("Signature has been completed")
            ->view('notifyCustomer', ['senderName' => $this->signer->name, 'senderEmail' => $this->signer->email, 'senderType' => $this->signer->type, 'document' => $this->document, 'url' => $url]);
    }
}
