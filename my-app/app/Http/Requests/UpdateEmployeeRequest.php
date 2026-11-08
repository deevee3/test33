<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
        $employee = $this->route('employee');
        $employeeId = $employee instanceof \App\Models\Employee ? $employee->id : $employee;
        
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email,' . $employeeId],
            'phone' => ['nullable', 'string', 'max:50'],
            'role' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:active,inactive,on_leave'],
            'salary' => ['required', 'numeric', 'min:0'],
            'pay_frequency' => ['required', 'in:monthly,biweekly,weekly'],
            'hired_date' => ['required', 'date', 'before_or_equal:today'],
            'last_raise' => ['nullable', 'date', 'after_or_equal:hired_date'],
            'last_review_date' => ['nullable', 'date', 'after_or_equal:hired_date'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Employee name is required',
            'email.required' => 'Email address is required',
            'email.email' => 'Please enter a valid email address',
            'email.unique' => 'This email is already in use',
            'salary.min' => 'Salary must be a positive number',
            'hired_date.before_or_equal' => 'Hired date cannot be in the future',
            'last_raise.after_or_equal' => 'Last raise date must be after hired date',
            'last_review_date.after_or_equal' => 'Last review date must be after hired date',
        ];
    }
}
