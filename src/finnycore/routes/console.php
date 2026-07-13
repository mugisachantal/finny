<?php
use App\Console\Commands\RecomputePlatformInsights;
use App\Console\Commands\SimulateLenderResponses;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


// routes/console.php (additions)



Schedule::command(RecomputePlatformInsights::class)->daily();
Schedule::command(SimulateLenderResponses::class)->everyMinute();