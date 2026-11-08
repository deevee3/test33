<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of reviews.
     */
    public function index(Request $request)
    {
        $query = Review::with(['employee', 'reviewer']);

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Apply rating filter
        if ($rating = $request->input('rating')) {
            $query->byRating($rating);
        }

        // Apply type filter
        if ($type = $request->input('type')) {
            $query->byType($type);
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            $query->byStatus($status);
        }

        $reviews = $query->orderBy('review_date', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Get all employees for dropdown
        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('reviews/index', [
            'reviews' => $reviews,
            'employees' => $employees,
            'filters' => $request->only(['search', 'rating', 'type', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new review.
     */
    public function create()
    {
        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('reviews/form', [
            'review' => null,
            'employees' => $employees,
            'reviewTypes' => [
                ['value' => 'quarterly', 'label' => 'Quarterly'],
                ['value' => 'annual', 'label' => 'Annual'],
                ['value' => 'probation', 'label' => 'Probation'],
                ['value' => 'other', 'label' => 'Other'],
            ],
            'statuses' => [
                ['value' => 'draft', 'label' => 'Draft'],
                ['value' => 'completed', 'label' => 'Completed'],
            ],
        ]);
    }

    /**
     * Store a newly created review in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        $review = Review::create($request->validated());

        return redirect()->route('reviews.index')
            ->with('success', 'Review has been created successfully!');
    }

    /**
     * Show the form for editing the specified review.
     */
    public function edit(Review $review)
    {
        $review->load(['employee', 'reviewer']);

        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('reviews/form', [
            'review' => $review,
            'employees' => $employees,
            'reviewTypes' => [
                ['value' => 'quarterly', 'label' => 'Quarterly'],
                ['value' => 'annual', 'label' => 'Annual'],
                ['value' => 'probation', 'label' => 'Probation'],
                ['value' => 'other', 'label' => 'Other'],
            ],
            'statuses' => [
                ['value' => 'draft', 'label' => 'Draft'],
                ['value' => 'completed', 'label' => 'Completed'],
            ],
        ]);
    }

    /**
     * Update the specified review in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
        $review->update($request->validated());

        return redirect()->route('reviews.index')
            ->with('success', 'Review has been updated successfully!');
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->route('reviews.index')
            ->with('success', 'Review has been deleted successfully!');
    }
}
