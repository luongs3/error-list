<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['domain' => 'admin.' . $_ENV['APP_DOMAIN']], function() {
    Route::get('', function () {
        return view('admin/index');
    });

    Route::group(['namespace' => 'Admin'], function () {
        Route::get('auth', 'Auth\SessionsController@index')->name('admin.auth');
        Route::post('login', 'Auth\SessionsController@store')->name('admin.login');
        Route::get('logout', 'Auth\SessionsController@logout')->name('admin.logout');
    });
});

Route::group(['domain' => $_ENV['APP_DOMAIN']], function() {
    Route::get('', function () {
        return view('client/index');
    });
});
