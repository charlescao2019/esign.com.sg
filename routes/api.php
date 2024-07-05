<?php

use App\Http\Controllers\SignerController;
use App\Http\Controllers\SaveDocumentController;
use App\Http\Controllers\SignatureController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/save-document', [SaveDocumentController::class, 'store']);
Route::get('/auth-signer/{id}', [SignerController::class, 'getSignerById'])->where('short_url', '[A-Za-z0-9]+');
Route::post('/notify-customer/{short_url}', [SignerController::class, 'notifyCustomer'])->where('short_url', '[A-Za-z0-9]+');
Route::post('/request-otp/{short_url}', [SignerController::class, 'requestOTP'])->where('short_url', '[A-Za-z0-9]+');
Route::post('/signature-history/{short_url}', [SignerController::class, 'history'])->where('short_url', '[A-Za-z0-9]+');
Route::post('/signer/{short_url}', [SignatureController::class, 'fetchMarkedDocument'])->where('short_url', '[A-Za-z0-9]+');;
Route::get('/signer/{short_url}', [SignerController::class, 'fetchSigner'])->where('short_url', '[A-Za-z0-9]+');;

Route::post('/signature/{short_url}', [SignatureController::class, 'signature']);

Route::get('/frame', [SignatureController::class, 'frame']);
Route::get('/web/certificate/{id}', [SignatureController::class, 'signedCertificateWeb']);
Route::get('/pdf/certificate/{id}', [SignatureController::class, 'signedCertificatePDF']);
