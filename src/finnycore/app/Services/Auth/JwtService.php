<?php

namespace App\Services\Auth;

use App\Models\Borrower;
use RuntimeException;

class JwtService
{
    private string $secret;
    private int $ttlSeconds;

    public function __construct()
    {
        $this->secret = config('jwt.secret') ?? throw new RuntimeException('JWT_SECRET is not set.');
        $this->ttlSeconds = config('jwt.ttl', 1440) * 60;
    }

    public function issue(Borrower $borrower): string
    {
        $header  = $this->base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = $this->base64UrlEncode(json_encode([
            'sub'   => (string) $borrower->id,
            'email' => $borrower->email,
            'iat'   => time(),
            'exp'   => time() + $this->ttlSeconds,
        ]));
        $signature = $this->base64UrlEncode(
            hash_hmac('sha256', "{$header}.{$payload}", $this->secret, true)
        );

        return "{$header}.{$payload}.{$signature}";
    }

    public function verify(string $token): array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new RuntimeException('Invalid token format.');
        }

        [$header, $payload, $signature] = $parts;

        $expected = $this->base64UrlEncode(
            hash_hmac('sha256', "{$header}.{$payload}", $this->secret, true)
        );

        if (!hash_equals($expected, $signature)) {
            throw new RuntimeException('Invalid token signature.');
        }

        $claims = json_decode($this->base64UrlDecode($payload), true);

        if (!is_array($claims) || ($claims['exp'] ?? 0) < time()) {
            throw new RuntimeException('Token has expired.');
        }

        return $claims;
    }

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
