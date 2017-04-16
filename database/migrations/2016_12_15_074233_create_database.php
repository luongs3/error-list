<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatabase extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Table: admins
        Schema::create('admins', function ($table) {
            $table->increments('id')->unsigned();
            $table->string('email')->unique();
            $table->string('name');
            $table->text('password')->nullable();
            $table->boolean('is_super')->default(0);
            $table->boolean('is_active')->default(0);
            $table->boolean('is_remove')->default(0);
            $table->string('invite_token', 64)->nullable();
            $table->string('reset_token', 64)->nullable();
            $table->rememberToken();
            $table->softDeletes();
            $table->nullableTimestamps();
        });

        // Table: teachers
        Schema::create('clients', function ($table) {
            $table->increments('id')->unsigned();
            $table->string('name', 256)->nullable();
            $table->string('email')->unique();
            $table->string('avatar', 256)->nullable();
            $table->text('password')->nullable();
            $table->boolean('is_active')->default(0);
            $table->string('invite_token', 64)->nullable();
            $table->string('reset_token', 64)->nullable();
            $table->rememberToken();
            $table->softDeletes();
            $table->nullableTimestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('admins');
        Schema::drop('clients');
    }
}
