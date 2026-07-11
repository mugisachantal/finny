<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FinnyController extends Controller
{
    public function recommend(Request $request)
    {
        $payload = [
            'requestedAmount' => (float) $request->input('requestedAmount', 200000),
            'requestedTenure' => (int) $request->input('requestedTenure', 30),
            'urgency' => $request->input('urgency', 'medium'),
            'borrowerProfile' => $request->input('borrowerProfile', []),
            'lenderList' => $request->input('lenderList', [
                [
                    'id' => 'lender-1',
                    'name' => 'Apex Finance',
                    'minAmount' => 100000,
                    'maxAmount' => 1000000,
                    'minTenureDays' => 7,
                    'maxTenureDays' => 90,
                    'totalRepayment' => 250000,
                    'upheldComplaints' => 0,
                    'licensedByUMRA' => true,
                    'status' => 'active',
                ],
                [
                    'id' => 'lender-2',
                    'name' => 'Bridge Credit',
                    'minAmount' => 100000,
                    'maxAmount' => 800000,
                    'minTenureDays' => 14,
                    'maxTenureDays' => 60,
                    'totalRepayment' => 300000,
                    'upheldComplaints' => 1,
                    'licensedByUMRA' => true,
                    'status' => 'active',
                ],
            ]),
        ];

        $response = Http::timeout(8)->post('http://127.0.0.1:8001/recommend', $payload);

        if ($response->failed()) {
            return response()->json([
                'error' => 'Recommendation service unavailable',
            ], 502);
        }

        return response()->json($response->json());
    }

    public function chat(Request $request)
    {
        $payload = [
            'message' => $request->input('message'),
            'sessionId' => $request->input('sessionId'),
            'userProfile' => $request->input('userProfile', []),
            'currentApplication' => $request->input('currentApplication', null),
        ];

        $response = Http::timeout(8)->post('http://127.0.0.1:8001/chat', $payload);

        if ($response->failed()) {
            return response()->json([
                'answer' => 'I can help explain loan costs, complaints, and fraud warnings in plain language.',
                'fallback' => true,
            ], 200);
        }

        return response()->json($response->json());
    }
}
