<?php

use App\Http\Controllers\AppToolController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('people', EmployeeController::class)
        ->parameters(['people' => 'employee'])
        ->except(['show']);

    Route::get('salary', [EmployeeController::class, 'salary'])->name('salary');

    Route::get('hiring/kanban', [CandidateController::class, 'kanban'])->name('hiring.kanban');
    
    Route::resource('hiring', CandidateController::class)
        ->parameters(['hiring' => 'candidate'])
        ->except(['show']);
    
    Route::post('hiring/{candidate}/hire', [CandidateController::class, 'hire'])->name('hiring.hire');

    Route::resource('reviews', ReviewController::class)
        ->except(['show']);

    Route::resource('devices', DeviceController::class)
        ->except(['show']);

    Route::resource('apps', AppToolController::class)
        ->except(['show']);

    Route::resource('calendar', CalendarController::class)
        ->except(['show']);
});

require __DIR__.'/settings.php';
