<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::delete('/user/destroy/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/message/{id}', [MessageController::class,'listMessages'])->name('massage.listMessages');
    Route::post('/massages', [MessageController::class,'store'])->name('massage.store');
});
