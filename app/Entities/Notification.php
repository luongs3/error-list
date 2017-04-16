<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Entities\Course
 *
 * @property int $id
 * @property string $message
 * @property bool $is_read
 * @property int $viewable_id
 * @property int $type
 * @property string $viewable_type
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Notification extends Model
{
    protected $table = 'notifications';
    protected $fillable = ['message', 'is_read', 'viewable_id', 'viewable_type', 'type'];
    protected $casts = ['is_read' => 'bool'];
    protected $hidden = ['viewable_id', 'viewable_type'];
    protected $adminViewable = 'App\\Entities\\Admin';

    public function viewable()
    {
        return $this->morphTo();
    }

    public function scopeAdmin($query)
    {
        $query->where(['viewable_type' => $this->adminViewable]);
    }
}
