<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidateRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:candidates,email',
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|url',
            'position' => 'required|string|max:255',
            'application_date' => 'required|date',
            'interview_date' => 'nullable|date',
            'resume_url' => 'nullable|url',
            'status' => 'nullable|in:new,screening,interview,offer,hired,rejected',
            'expected_salary' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
