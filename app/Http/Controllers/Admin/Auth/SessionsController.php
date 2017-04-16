<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Common\SessionsController as BaseSessionsController;

class SessionsController extends BaseSessionsController
{
    protected $guard = 'admin';
}
