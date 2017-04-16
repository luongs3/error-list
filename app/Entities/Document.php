<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * App\Entities\Course
 * @property int $id
 * @property string $message
 * @property bool $is_read
 * @property int $viewable_id
 * @property int $type
 * @property string $viewable_type
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Document extends Model
{
    protected $table = 'documents';
    protected $fillable = [
        'title',
        'file_name',
        'size',
        'description',
        'uploadable_id',
        'uploadable_type',
        'documentable_id',
        'documentable_type',
        'token',
    ];

    public function documentable()
    {
        return $this->morphTo();
    }

    public function uploadable()
    {
        return $this->morphTo();
    }

    /**
     * Get owner for teacher
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'uploadable_id');
    }

    /**
     *  Get owner
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'uploadable_id');
    }

    public function getFileNameAttribute($value)
    {
        if (is_null($value)) {
            return '';
        }

        return Storage::url($value);
    }

    /**
     * Get owner
     * @return BaseUser
     */
    public function getUploader()
    {
        return $this->uploadable_type === Admin::class ? $this->admin : $this->teacher;
    }
}
