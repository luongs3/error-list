<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Common\PasswordController as BasePasswordController;

class PasswordController extends BasePasswordController
{
    protected $guard = 'admin';
    protected $broker = 'admins';
}
