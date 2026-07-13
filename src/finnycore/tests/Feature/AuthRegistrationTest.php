<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class AuthRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_allows_blank_email(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'full_name' => 'Test User',
            'date_of_birth' => '1990-01-01',
            'phone_number' => '+256700000000',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'income_bracket' => '100k_300k',
            'district' => 'Kampala',
            'education_level' => 'secondary',
            'terms_accepted' => true,
            'nin_image' => UploadedFile::fake()->image('nin.png', 600, 600),
            'liveliness_image' => UploadedFile::fake()->image('selfie.png', 600, 600),
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'borrower',
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('borrowers', ['full_name' => 'Test User']);
    }
}
