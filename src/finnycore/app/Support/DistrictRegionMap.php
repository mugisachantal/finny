<?php

namespace App\Support;

class DistrictRegionMap
{
    /**
     * Minimal district -> region mapping.
     *
     * If a district is missing/unknown, we return 'unknown' so that
     * borrower registration/profile APIs never 500 due to this mapping.
     */
    public static function regionFor(?string $district): string
    {
        if ($district === null) {
            return 'unknown';
        }

        $district = trim(mb_strtolower($district));

        if ($district === '') {
            return 'unknown';
        }

        // NOTE: Populate/extend this mapping as your product data requires.
        // Keys are lowercased district names.
        $map = [
            // Kampala
            'kampala' => 'central',
            'kawempe' => 'central',
            'rubaga' => 'central',
            'makindye' => 'central',
            'nakawa' => 'central',
            'lubaga' => 'central',

            // Central (examples)
            'wakiso' => 'central',
            'mukono' => 'central',
            'mpigi' => 'central',
            'luwero' => 'central',
            'nabisunsa' => 'central',

            // Eastern (examples)
            'jinja' => 'eastern',
            'kamuli' => 'eastern',
            'tororo' => 'eastern',
            'mbale' => 'eastern',
            'soroti' => 'eastern',
            'kumi' => 'eastern',

            // Northern (examples)
            'gulu' => 'northern',
            'otum' => 'northern',
            'moyo' => 'northern',
            'madi' => 'northern',
            'arua' => 'northern',

            // Western (examples)
            'mbarara' => 'western',
            'kasese' => 'western',
            'fortportal' => 'western',
            'kabarole' => 'western',
        ];

        return $map[$district] ?? 'unknown';
    }
}

