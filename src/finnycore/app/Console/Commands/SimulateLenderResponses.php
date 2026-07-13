<?php
namespace App\Console\Commands;

use App\Models\LoanApplication;
use Illuminate\Console\Command;

/**
 * Demo-only: auto-progresses mocked applications through the status
 * pipeline so a live walkthrough can show submission through
 * disbursement in a few minutes without a real lender responding.
 * Scheduled every minute — see routes/console.php.
 */
class SimulateLenderResponses extends Command
{
    protected $signature = 'finny:simulate-lender-responses';
    protected $description = 'Progresses mocked loan applications through their status pipeline for demo purposes.';

    private const NEXT_STATUS = [
        'pending_verification' => 'approved',
        'approved' => 'disbursed',
    ];

    public function handle(): void
    {
        foreach (self::NEXT_STATUS as $from => $to) {
            LoanApplication::where('status', $from)
                ->where('updated_at', '<=', now()->subMinute())
                ->get()
                ->each(function (LoanApplication $application) use ($from, $to) {
                    $application->update(['status' => $to]);
                    $application->statusLogs()->create([
                        'from_status' => $from,
                        'to_status' => $to,
                        'note' => 'Simulated lender response (MVP mock gateway)',
                        'created_at' => now(),
                    ]);
                });
        }
    }
}