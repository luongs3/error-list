<?php

namespace App\Http\Controllers\Client\Auth;

use App\Http\Controllers\Common\ProfileController as BaseProfileController;

class ProfileController extends BaseProfileController
{
    protected $guard = 'Client';
}
