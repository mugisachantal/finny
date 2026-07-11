<?php

use App\Http\Controllers\FinnyController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::post('/api/finny/recommend', [FinnyController::class, 'recommend']);
Route::post('/api/finny/chat', [FinnyController::class, 'chat']);
