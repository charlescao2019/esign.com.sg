<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class NotifyCustomer implements ShouldQueue
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
        info('Notify Customer Job');
        Mail::to($this->notifier->email)->send(new \App\Mail\NotifyCustomer($this->document, $this->notifier));
    }
}
