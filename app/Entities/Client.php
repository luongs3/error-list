<?php

namespace App\Entities;

use App\Entities\Contracts\UserProvider;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Entities\Admin
 *
 * @property int $id
 * @property string $email
 * @property string $name
 * @property string $password
 * @property bool $is_super
 * @property bool $is_active
 * @property string $invite_token
 * @property string $reset_token
 * @property string $remember_token
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */

class Client extends BaseUser implements
    UserProvider,
    AuthenticatableContract,
    CanResetPasswordContract
{
    use Authenticatable, CanResetPassword, Authorizable, SoftDeletes;

    protected $table = 'admins';
    protected $fillable = [
        'email',
        'name',
        'avatar',
        'password',
        'is_super',
        'is_active',
        'is_remove',
        'remember_token',
        'invite_token',
    ];
    protected $hidden = ['password', 'remember_token', 'invite_token', 'reset_token'];
    protected $casts = ['is_active' => 'bool', 'is_super' => 'bool', 'is_remove' => 'bool'];
    public $timestamps = true;

    /**
     * Get all notifications for admin
     */
    public function notifications()
    {
        return $this->morphMany(Notification::class, 'viewable');
    }
}
