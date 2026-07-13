<?php
namespace App\Http\Controllers\Api\Loan;

use App\Http\Controllers\Controller;
use App\Models\Lender;
use App\Services\Loan\DynamicLoanFormSchemaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LenderSchemaController extends Controller
{
    public function __construct(private readonly DynamicLoanFormSchemaService $schema) {}

    public function show(Request $request, Lender $lender): JsonResponse
    {
        return response()->json([
            'data' => [
                'lender' => [
                    'id' => $lender->id,
                    'name' => $lender->name,
                    'interest_rate_min' => $lender->interest_rate_min,
                    'interest_rate_max' => $lender->interest_rate_max,
                    'terms_and_conditions' => $lender->terms_and_conditions,
                ],
                'fields' => $this->schema->resolveForBorrower($lender, $request->user()),
            ],
        ]);
    }
}