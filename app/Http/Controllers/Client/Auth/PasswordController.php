<?php

namespace App\Http\Controllers\Client\Auth;

use App\Http\Controllers\Common\PasswordController as BasePasswordController;

class PasswordController extends BasePasswordController
{
    protected $guard = 'client';
    protected $broker = 'clients';
}
