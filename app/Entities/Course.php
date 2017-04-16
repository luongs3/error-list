<?php

namespace App\Entities;

use App\Entities\Traits\Filterable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Events\Assign\TeacherWasAssigned;
use Illuminate\Support\Facades\Validator;

/**
 * App\Entities\Course
 * @property int $id
 * @property string $name
 * @property string $description
 * @property int $teacher_id
 * @property int $university
 * @property int $grade_id
 * @property \Carbon\Carbon $start_at
 * @property \Carbon\Carbon $ended_at
 * @property bool $is_active
 * @property bool $official
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class Course extends Model
{
    use Filterable;

    protected $table = 'courses';
    protected $fillable = [
        'name',
        'description',
        'teacher_id',
        'university_id',
        'grade_id',
        'started_at',
        'ended_at',
        'is_active',
        'official',
    ];
    protected $dates = ['started_at', 'ended_at'];
    protected $casts = ['is_active' => 'bool', 'official' => 'bool'];

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'course_teachers');
    }

    public function courseClasses()
    {
        return $this->hasMany(CourseClass::class);
    }

    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, CourseClass::class, 'course_id', 'class_id', 'id');
    }

    public function activeClasses()
    {
        return $this->hasMany(CourseClass::class)->where('classes.is_active', true);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Close course
     */
    public function close()
    {
        $this->update(['is_active' => false]);
        $this->courseClasses()->update(['is_active' => false]);
        foreach ($this->courseClasses as $class) {
            $class->lessons()->update(['is_active' => false]);
        }
    }

    /**
     * get distinct teacherIds in course
     * @return array
     */
    public function getDistinctTeacherIdsInCourse()
    {
        $teacherIdsInCourse = $this->teachers->pluck('id')->all();
        $classesInCourse = $this->courseClasses->load('teachers');

        foreach ($classesInCourse as $courseClass) {
            $teacherIdsInCourse = array_merge($teacherIdsInCourse, $courseClass->teachers->pluck('id')->all());
        }

        return array_unique($teacherIdsInCourse);
    }

    /**
     * Import class of this course from excel
     * @param array $data
     * @return int
     */
    public function import($data)
    {
        /**
         * @var \Illuminate\Support\Collection $courseClasses
         * @var CourseClass $courseClass
         */
        $courseClasses = $this->activeClasses;
        $countImportedLesson = 0;
        foreach ($data as $weekName => $classList) {
            foreach ($classList as $classData) {
                if (isset($classData['class']) && isset($classData['lessons'])) {
                    $courseClass = $courseClasses->where('name', $classData['class'])->first();

                    if ($courseClass) {
                        $lessons = $this->makeLessonData($courseClass, $classData['lessons']);
                        $updatedLessons = $courseClass->lessons()->saveMany($lessons);
                        $countImportedLesson += $lessons->count();
                        $this->createNotifications($updatedLessons);
                    }
                }
            }
        }

        return $countImportedLesson;
    }

    /**
     * Save lesson for this class from excel data
     * @param $courseClass
     * @param array $importData
     * @return \Illuminate\Support\Collection
     */
    protected function makeLessonData($courseClass, array $importData)
    {
        $result = collect([]);
        foreach ($importData as $lessonData) {
            $lessonData = $this->formatTime($lessonData);
            $isNotValid = $this->isNotValid($lessonData);
            $isDuplicated = $this->checkDuplicatedLesson($courseClass, $lessonData);

            if ($isDuplicated || $isNotValid) {
                continue;
            }

            $lesson = new Lesson();
            $lesson->content = $lessonData['content'];
            $lesson->room = $lessonData['room'];
            $lesson->started_at = $lessonData['from'];
            $lesson->ended_at = $lessonData['to'];
            $lesson->day = Carbon::parse($lessonData['day']);
            $lesson->teacher_id = $lessonData['teacher_id'];
            $lesson->is_active = true;

            $result->push($lesson);
        }

        return $result;
    }

    public function isNotValid($lessonData)
    {
        $startTime = Carbon::parse($this->started_at)->subDay();
        $endedTime = Carbon::parse($this->ended_at)->addDay();
        $dateValidate = '|after:' . $startTime->toDateString() . '|before:' . $endedTime->toDateString();
        $validator = Validator::make($lessonData, [
            'content' => 'required|string',
            'room' => 'required|string|max:255',
            'day' => 'required|date' . $dateValidate,
            'from' => 'required|date',
            'to' => 'required|date|after:started_at',
            'teacher_id' => 'required|integer|exists:teachers,id',
        ]);

        return $validator->fails();
    }

    public function formatTime($lessonData)
    {
        $lessonData['from'] = Carbon::parse("{$lessonData['day']} {$lessonData['from']}")->toDateTimeString();
        $lessonData['to'] = Carbon::parse("{$lessonData['day']} {$lessonData['to']}")->toDateTimeString();

        return $lessonData;
    }

    /**
     * Check can insert lesson data
     * @param $courseClass
     * @param array $lessonData
     * @return bool
     */
    public function checkDuplicatedLesson($courseClass, $lessonData)
    {
        $lessonExists = $courseClass->lessons()
            ->where([
                'room' => $lessonData['room'],
                'day' => $lessonData['day'],
                'started_at' => $lessonData['from'],
                'ended_at' => $lessonData['to'],
                'is_active' => true,
            ])
            ->first();

        return $lessonData['room']
            && $lessonData['day']
            && $lessonData['from']
            && $lessonData['to']
            && $lessonData['teacher_id']
            && $lessonData['content']
            && isset($lessonExists);
    }

    public function createNotifications($lessons)
    {
        if (!empty($lessons)) {
            foreach ($lessons as $lesson) {
                event(new TeacherWasAssigned(
                    [$lesson['teacher_id']],
                    [],
                    ['type' => 'Lesson', 'name' => $lesson['content'], 'data' => $lesson]
                ));
            }
        }
    }
}
