<?php
namespace App\Http\Controllers\Api\Loan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Loan\LoanApplicationSubmitRequest;
use App\Models\Lender;
use App\Models\LoanApplication;
use App\Services\Loan\LoanApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoanApplicationController extends Controller
{
    public function __construct(private readonly LoanApplicationService $applications) {}

    public function store(LoanApplicationSubmitRequest $request, Lender $lender): JsonResponse
    {
        $application = $this->applications->submit(
            $request->user(),
            $lender,
            $request->validated('recommendation_token'),
            $request->validated('fields'),
        );

        return response()->json([
            'message' => 'Application submitted.',
            'data' => [
                'id' => $application->id,
                'status' => $application->status,
                'lender' => $application->lender->name,
                'requested_amount' => $application->requested_amount,
                'submitted_at' => $application->created_at->toIso8601String(),
            ],
        ], 201);
    }

    public function show(Request $request, LoanApplication $loanApplication): JsonResponse
    {
        abort_unless($loanApplication->borrower_id === $request->user()->id, 403);

        return response()->json([
            'data' => [
                'id' => $loanApplication->id,
                'lender' => $loanApplication->lender->name,
                'requested_amount' => $loanApplication->requested_amount,
                'status' => $loanApplication->status,
                'lender_reference_id' => $loanApplication->lender_reference_id,
                'created_at' => $loanApplication->created_at->toIso8601String(),
            ],
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $applications = $request->user()->loanApplications()->with('lender')->latest()->get();

        return response()->json([
            'data' => $applications->map(fn (LoanApplication $a) => [
                'id' => $a->id,
                'lender' => $a->lender->name,
                'requested_amount' => $a->requested_amount,
                'status' => $a->status,
                'created_at' => $a->created_at->toIso8601String(),
            ]),
        ]);
    }
}