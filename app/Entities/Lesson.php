<?php
namespace App\Entities;

use App\Entities\Traits\Filterable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Entities\CourseClass
 *
 * @property int $id
 * @property string $content
 * @property string $description
 * @property int $document_id
 * @property int $teacher_id
 * @property string $room
 * @property string $day
 * @property int $class_id
 * @property bool $is_active
 * @property \Carbon\Carbon $started_at
 * @property \Carbon\Carbon $ended_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Lesson extends Model
{
    use Filterable;

    protected $table = 'lessons';
    protected $fillable = [
        'content',
        'room',
        'teacher_id',
        'document_id',
        'day',
        'is_active',
        'class_id',
        'started_at',
        'ended_at',
    ];
    protected $dates = ['started_at', 'ended_at'];
    protected $casts = ['is_active' => 'bool'];

    public function courseClass()
    {
        return $this->belongsTo(CourseClass::class, 'class_id');
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function lessonLogs()
    {
        return $this->hasMany(LessonLog::class);
    }

    public function close()
    {
        $this->update(['is_active' => false]);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get all documents
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    public function scopeYesterday($query)
    {
        return $query->whereDate('day', '<', Carbon::today())->whereDate('day', '>=', Carbon::yesterday());
    }
}
