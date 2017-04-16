<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Entities\Course
 *
 * @property int $id
 * @property string $email
 * @property string $password
 * @property bool $is_super
 * @property bool $is_active
 * @property string $invite_token
 * @property string $reset_token
 * @property string $remember_token
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class University extends Model
{
    protected $table = 'universities';
    protected $fillable = ['name', 'short_name'];
}
