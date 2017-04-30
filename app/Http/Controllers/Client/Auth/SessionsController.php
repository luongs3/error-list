<?php

namespace App\Http\Controllers\Client\Auth;

use App\Http\Controllers\Common\SessionsController as BaseSessionsController;

class SessionsController extends BaseSessionsController
{
    protected $guard = 'client';
}
