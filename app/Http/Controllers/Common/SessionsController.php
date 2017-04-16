<?php

namespace App\Http\Controllers\Common;

use App;
use Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

abstract class SessionsController extends Controller
{
    public function __construct()
    {
        $this->middleware($this->guestMiddleware(), ['except' => ['logout', 'index']]);
    }

    public function index()
    {
        $auth = ['loggedIn' => false];
        $language = [];
        $authUser = Auth::guard($this->getGuard());

        if ($authUser->check()) {
            $auth['user'] = $authUser->user()->toArray();
            $auth['loggedIn'] = true;

            if (!$authUser->user()->isActive()) {
                $this->logout();
                return $this->response(['error' => trans('auth.deactived')], 400);
            }
        }

        return $this->response(['auth' => $auth]);
    }

    public function store(Request $request)
    {
        $this->validateLogin($request);
        $credentials = $this->getCredentials($request);

        if ($this->attemptLogin($request, $credentials)) {
            return $this->userWasAuthenticated();
        }

        return $this->responseToFailedLogin();
    }

    public function logout()
    {
        Auth::guard($this->getGuard())->logout();

        return redirect('/');
    }

    protected function attemptLogin(Request $request, $credentials)
    {
        return Auth::guard($this->getGuard())->attempt($credentials, true);
    }

    protected function validateLogin(Request $request)
    {
        $this->validate($request, [
            'email' => 'required',
            'password' => 'required',
        ]);
    }

    protected function getCredentials(Request $request)
    {
        return $request->only('email', 'password');
    }

    protected function userWasAuthenticated()
    {
        $guard = $this->getGuard();
        $user = Auth::guard($guard)->user();
        if ($user->isActive()) {
            return $this->response(['user' => $user->toArray()]);
        }

        $this->logout();
        return $this->response(['error' => trans('auth.deactived')], 400);
    }

    protected function responseToFailedLogin()
    {
        return $this->response(['error' => trans('auth.failed')], 400);
    }
}
