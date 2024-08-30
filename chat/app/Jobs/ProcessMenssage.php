<?php

namespace App\Jobs;

use App\Events\ProcessMenssage as EventsProcessMenssage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessMenssage implements ShouldQueue
{
    use Queueable;
    public $message;
    /**
     * Create a new job instance.
     */
    public function __construct($message , public int $user_id)
    {
        $this->message = $message;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        EventsProcessMenssage::dispatch($this->user_id);
    }
}
