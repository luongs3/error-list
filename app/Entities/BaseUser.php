<?php

namespace App\Entities;

use App\Entities\Traits\Filterable;
use Illuminate\Database\Eloquent\Model;
use App\Entities\Contracts\UserProvider;
use Storage;

/**
 * Base user
 * @property string $full_name
 * @property string $email
 * @property string $name
 */
abstract class BaseUser extends Model implements UserProvider
{
    use Filterable;

    public function getType()
    {
        $className = static::class;

        return (substr($className, strrpos($className, '\\') + 1));
    }

    public function isAdmin()
    {
        return $this->getType() === UserProvider::ADMIN;
    }

    public function isClient()
    {
        return $this->getType() === UserProvider::CLIENT;
    }

    public function getName()
    {
        return trim($this->name);
    }

    public function getIdentifier()
    {
        return $this->getName() ?: $this->email;
    }

    public function getAvatarAttribute($value)
    {
        if (is_null($value) || !Storage::exists($value)) {
            return config('common.default_avatar');
        }

        return get_resized_avatar($value);
    }

    public function isActive()
    {
        return $this->is_active && !$this->is_remove;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function filterDocuments($documents)
    {
        $documentFiltered = [];
        $uploadableType = get_class($this);
        foreach ($documents as $document) {
            $document['my_document'] = false;
            if ($document['uploadable_id'] == $this->id && $document['uploadable_type'] == $uploadableType) {
                $document['my_document'] = true;
            }

            $documentFiltered[] = $document;
        }

        return $documentFiltered;
    }
}
