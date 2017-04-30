<?php
use App\Entities\Client;
use Carbon\Carbon;
use App\Entities\Admin;
use App\Entities\Notification;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\Entities\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

$factory->define(Admin::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->email,
        'password' => bcrypt('123456'),
        'is_super' => true,
    ];
});

$factory->define(Client::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->email,
        'password' => bcrypt('123456'),
        'is_active' => true,
    ];
});


$factory->define(Teacher::class, function (Faker\Generator $faker) {
    $universities = config('common.universities');
    $randomUniversity = $faker->randomElement($universities);

    return [
        'first_name' => $faker->firstName,
        'last_name' => $faker->lastName,
        'email' => $faker->email,
        'password' => bcrypt('12345678'),
        'is_active' => true,
        'offices' => json_encode([
            ['id' => $faker->unique(), 'university_id' => $randomUniversity['id'], 'timekeeping_id' => $faker->unique()],
            ['id' => $faker->unique(), 'university_id' => $randomUniversity['id'], 'timekeeping_id' => $faker->unique()],
        ], true),
    ];
});

$factory->define(Evaluation::class, function (Faker\Generator $faker) {
    $maxCriteria = config('common.max_criteria');

    return [
        'teacher_id' => function() {
            return factory(Teacher::class)->create()->id;
        },
        'comment' => $faker->sentence(),
        'month' => Carbon::now()->toDateString(),
        'knowledge' => $faker->numberBetween(0, $maxCriteria),
        'standard_of_work' => $faker->numberBetween(0, $maxCriteria),
        'autonomy' => $faker->numberBetween(0, $maxCriteria),
        'coping_with_complexity' => $faker->numberBetween(0, $maxCriteria),
        'perception_of_context' => $faker->numberBetween(0, $maxCriteria),
        'hou_ren_sou' => $faker->numberBetween(0, $maxCriteria),
        'team_work' => $faker->numberBetween(0, $maxCriteria),
        'management' => $faker->numberBetween(0, $maxCriteria),
        'lesson_report' => $faker->numberBetween(0, $maxCriteria),
        'avg' => $faker->numberBetween(0, $maxCriteria),
    ];
});

$factory->define(Course::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'description' => $faker->text,
        'university_id' => 1,
        'grade_id' => 1,
        'started_at' => Carbon::now()->subDay(),
        'ended_at' => Carbon::now()->addMonths(2),
        'is_active' => true,
    ];
});

//make sure already run seeding App\Entities\Course, Teacher first
$factory->define(CourseClass::class, function (Faker\Generator $faker) {
    return [
        'name' => $faker->name,
        'description' => $faker->text,
        'course_id' => function () {
            return factory(Course::class)->create()->id;
        },
        'document_id' => 1,
        'is_active' => true,
        'supervisor_id' => 1,
        'suggestions' => json_encode([
            ['day' => 'mon', 'from' => '09:00', 'to' => '11:00', 'room' => '123'],
            ['day' => 'wed', 'from' => '09:00', 'to' => '11:00', 'room' => '123'],
            ['day' => 'fri', 'from' => '09:00', 'to' => '11:00', 'room' => '123'],
        ]),
    ];
});

$factory->define(Lesson::class, function (Faker\Generator $faker) {
    return [
        'content' => $faker->name,
        'room' => $faker->numberBetween(0, 100),
        'teacher_id' => function () {
            return factory(Teacher::class)->create()->id;
        },
        'day' => Carbon::now(),
        'class_id' => function () {
            return factory(CourseClass::class)->create()->id;
        },
        'document_id' => 1,
        'started_at' => Carbon::now()->subDay(),
        'ended_at' => Carbon::now()->addDays($faker->numberBetween(1, 10)),
    ];
});

/**
 * Factory for notifications
 */
$factory->define(Notification::class, function (Faker\Generator $faker) {
    return [
        'message' => $faker->text,
        'is_read' => random_int(0, 1),
        'viewable_id' => 1,
        'viewable_type' => '',
    ];
});
