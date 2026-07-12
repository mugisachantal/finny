<?php

namespace App\Support;

class DistrictRegionMap
{
    public static function regionFor(?string $district): string
    {
        if ($district === null) {
            return 'unknown';
        }

        $district = trim(mb_strtolower($district));

        if ($district === '') {
            return 'unknown';
        }

        $map = [
            // Kampala & Central
            'kampala'    => 'central',
            'kawempe'    => 'central',
            'rubaga'     => 'central',
            'makindye'   => 'central',
            'nakawa'     => 'central',
            'lubaga'     => 'central',
            'wakiso'     => 'central',
            'mukono'     => 'central',
            'mpigi'      => 'central',
            'luwero'     => 'central',

            // Eastern
            'jinja'      => 'eastern',
            'kamuli'     => 'eastern',
            'tororo'     => 'eastern',
            'mbale'      => 'eastern',
            'soroti'     => 'eastern',
            'kumi'       => 'eastern',

            // Northern
            'gulu'       => 'northern',
            'lira'       => 'northern',
            'arua'       => 'northern',
            'kitgum'     => 'northern',

            // Western
            'mbarara'    => 'western',
            'kabale'     => 'western',
            'fort portal' => 'western',
            'kasese'     => 'western',
            'kabarole'   => 'western',
            'bushenyi'   => 'western',
        ];

        return $map[$district] ?? 'unknown';
    }
}
