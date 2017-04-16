<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Common\ProfileController as BaseProfileController;

class ProfileController extends BaseProfileController
{
    protected $guard = 'admin';
}
