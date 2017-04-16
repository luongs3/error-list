<?php

namespace App\Entities;

use Storage;
use Illuminate\Auth\Authenticatable;
use App\Entities\Contracts\UserProvider;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

/**
 * App\Entities\Teacher
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $avatar
 * @property string $password
 * @property bool $is_active
 * @property string $invite_token
 * @property string $reset_token
 * @property string $remember_token
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Teacher extends BaseUser implements
    UserProvider,
    AuthenticatableContract,
    CanResetPasswordContract
{
    use Authenticatable, CanResetPassword, Authorizable;

    protected $table = 'teachers';
    protected $fillable = [
        'email',
        'password',
        'first_name',
        'last_name',
        'office',
        'timekeeping_id',
        'description',
        'telephone',
        'office',
        'description',
        'avatar',
        'background',
        'background_position',
        'is_active',
        'is_remove',
        'full_time',
        'invite_token',
    ];
    protected $hidden = ['password', 'remember_token', 'invite_token', 'reset_token'];
    protected $casts = ['is_active' => 'bool', 'is_remove' => 'bool', 'full_time' => 'bool'];

    public function setFullTimeAttribute($value)
    {
        $this->attributes['full_time'] = 0;

        if ($value == 'true' || $value == '1') {
            $this->attributes['full_time'] = 1;
        }
    }

    public function scopeFulltime($query)
    {
        return $query->where('full_time', true);
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    /**
     * Get all notifications for teacher
     */
    public function notifications()
    {
        return $this->morphMany(Notification::class, 'viewable');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function monthlyReports()
    {
        return $this->hasMany(MonthlyReport::class);
    }

    public function getBackgroundAttribute($value)
    {
        if (is_null($value) || !Storage::exists($value)) {
            return $this->avatar;
        }

        return Storage::url($value);
    }

    /**
     * Format phone input
     * @param $string
     * @return mixed
     */
    public function setTelephoneAttribute($string)
    {
        $string = preg_replace('/[^0-9]/', '', $string);
        $this->attributes['telephone'] = $string;
    }

    /**
     * Get all documents
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'uploadable');
    }
}
