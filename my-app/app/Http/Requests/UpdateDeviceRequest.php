<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeviceRequest extends FormRequest
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
        $deviceId = $this->route('device');
        
        return [
            'name' => ['required', 'string', 'max:255'],
            'serial_number' => ['required', 'string', 'max:255', 'unique:devices,serial_number,' . $deviceId],
            'device_type' => ['required', 'in:laptop,desktop,phone,tablet,monitor,other'],
            'assigned_to' => ['nullable', 'exists:employees,id'],
            'status' => ['required', 'in:in_use,available,maintenance,retired'],
            'health_score' => ['required', 'integer', 'min:0', 'max:100'],
            'purchase_date' => ['nullable', 'date', 'before_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
