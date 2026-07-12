<?php

namespace App\Support;

/**
 * Maps a borrower's district to a coarser region grouping.
 *
 * Kept as a static lookup rather than a database table for MVP speed.
 * The mapping is intentionally small and easy to extend — add districts
 * as real borrowers register from them. Any district not listed falls
 * back to 'unspecified' rather than throwing, since we never want a
 * missing map entry to block registration or profile display.
 */
class DistrictRegionMap
{
    private const MAP = [
        // Central
        'kampala' => 'central', 'wakiso' => 'central', 'mukono' => 'central',
        'mpigi' => 'central', 'luwero' => 'central', 'mubende' => 'central',

        // Eastern
        'jinja' => 'eastern', 'mbale' => 'eastern', 'busia' => 'eastern',
        'tororo' => 'eastern', 'soroti' => 'eastern', 'iganga' => 'eastern',

        // Northern
        'gulu' => 'northern', 'lira' => 'northern', 'arua' => 'northern',
        'kitgum' => 'northern', 'moroto' => 'northern',

        // Western
        'mbarara' => 'western', 'fort portal' => 'western', 'kabale' => 'western',
        'hoima' => 'western', 'kasese' => 'western', 'masaka' => 'western',
    ];

    public static function regionFor(?string $district): string
    {
        if (! $district) {
            return 'unspecified';
        }

        return self::MAP[strtolower(trim($district))] ?? 'unspecified';
    }
}