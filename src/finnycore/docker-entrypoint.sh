#!/bin/sh
set -e

if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
    APP_KEY=$(grep '^APP_KEY=' /var/www/html/.env | cut -d= -f2-)
    export APP_KEY
fi

php artisan migrate --force

exec php -S 0.0.0.0:8080 -t public
