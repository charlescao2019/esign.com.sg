<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class NotifySender implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $notifier;
    public $document;

    /**
     * Create a new job instance.
     */
    public function __construct($notifier, $document)
    {
        $this->notifier = $notifier;
        $this->document = $document;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->document->sender_email)->send(new \App\Mail\NotifySender($this->document, $this->notifier));
    }
}
