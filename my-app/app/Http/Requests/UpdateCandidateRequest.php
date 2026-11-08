<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCandidateRequest extends FormRequest
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
        $candidate = $this->route('candidate');
        $candidateId = $candidate instanceof \App\Models\Candidate ? $candidate->id : $candidate;

        return [
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:candidates,email,{$candidateId}",
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|url',
            'position' => 'required|string|max:255',
            'application_date' => 'required|date',
            'interview_date' => 'nullable|date',
            'resume_url' => 'nullable|url',
            'status' => 'required|in:new,screening,interview,offer,hired,rejected',
            'expected_salary' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ];
    }
}
