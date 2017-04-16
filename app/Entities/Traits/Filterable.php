<?php

namespace App\Entities\Traits;

use App\Core\Queries\QueryFilter;

trait Filterable
{
    /**
     * Apply filtering conditions to the given query builder instance.
     *
     * @param  \Illuminate\Database\Eloquent\Builder $builder
     * @param  QueryFilter $queryFilter
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFilterBy($builder, QueryFilter $queryFilter)
    {
        return $queryFilter->apply($builder);
    }

    public function scopeAdvanceFilterBy($builder, QueryFilter $queryFilter)
    {
        return $queryFilter->applyAdvance($builder);
    }
}
