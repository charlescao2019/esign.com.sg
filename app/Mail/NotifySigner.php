<?php

namespace App\Mail;

use App\Models\LeaveRequest;
use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifySigner extends Mailable
{
    /**
     * Create a new message instance.
     *
     * @return void
     */

     public $document;
     public $name;
     public $url;

    public function __construct($document, $name, $url)
    {
        $this->document = $document;
        $this->url = $url;
        $this->name = $name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return
            $this->from(env('MAIL_FROM_ADDRESS'), 'E-sign')
                ->subject("You Have Been Assigned As Signer")
                ->view('notifySigner', ['document'=>$document, 'name' => $this->name, 'url' => $this->url]);
    }
}
