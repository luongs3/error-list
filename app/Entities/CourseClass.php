<?php
namespace App\Entities;

use App\Entities\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Entities\CourseClass
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int $document_id
 * @property int $course_id
 * @property string $day
 * @property \Carbon\Carbon $start_at
 * @property \Carbon\Carbon $ended_at
 * @property bool $is_active
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class CourseClass extends Model
{
    use Filterable;

    protected $table = 'classes';
    protected $fillable = [
        'name',
        'description',
        'course_id',
        'document_id',
        'supervisor_id',
        'is_active',
        'suggestions',
    ];

    /**
     * @param array $value
     */
    public function setSuggestionsAttribute($value)
    {
        $this->attributes['suggestions'] = json_encode($value);
    }

    /**
     * @param mixed $value
     * @return array
     */
    public function getSuggestionsAttribute($value)
    {
        return json_decode($value, true);
    }

    public function supervisor()
    {
        return $this->belongsTo(Teacher::class, 'supervisor_id');
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'class_teachers', 'class_id', 'teacher_id');
    }

    public function lessons()
    {
        return $this->hasMany(Lesson::class, 'class_id');
    }

    public function activeLessons()
    {
        return $this->lessons()->where('lessons.is_active', true);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'class_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Close class and it's lessons
     */
    public function close()
    {
        $this->update(['is_active' => false]);
        $this->lessons()->update(['is_active' => false]);
    }

    /**
     * Get all documents
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}
