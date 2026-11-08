<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'reviewer_id' => ['required', 'exists:employees,id'],
            'review_date' => ['required', 'date', 'before_or_equal:today'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comments' => ['nullable', 'string', 'max:5000'],
            'review_type' => ['required', 'in:quarterly,annual,probation,other'],
            'status' => ['required', 'in:draft,completed'],
        ];
    }
}
