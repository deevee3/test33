<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDeviceRequest;
use App\Http\Requests\UpdateDeviceRequest;
use App\Models\Device;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeviceController extends Controller
{
    /**
     * Display a listing of devices.
     */
    public function index(Request $request)
    {
        $query = Device::with('assignedEmployee');

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Apply type filter
        if ($type = $request->input('type')) {
            $query->byType($type);
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            $query->byStatus($status);
        }

        $devices = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Get all employees for assignment dropdown
        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('devices/index', [
            'devices' => $devices,
            'employees' => $employees,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new device.
     */
    public function create()
    {
        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('devices/form', [
            'device' => null,
            'employees' => $employees,
            'deviceTypes' => [
                ['value' => 'laptop', 'label' => 'Laptop'],
                ['value' => 'desktop', 'label' => 'Desktop'],
                ['value' => 'phone', 'label' => 'Phone'],
                ['value' => 'tablet', 'label' => 'Tablet'],
                ['value' => 'monitor', 'label' => 'Monitor'],
                ['value' => 'other', 'label' => 'Other'],
            ],
            'statuses' => [
                ['value' => 'in_use', 'label' => 'In Use'],
                ['value' => 'available', 'label' => 'Available'],
                ['value' => 'maintenance', 'label' => 'Maintenance'],
                ['value' => 'retired', 'label' => 'Retired'],
            ],
        ]);
    }

    /**
     * Store a newly created device in storage.
     */
    public function store(StoreDeviceRequest $request)
    {
        $device = Device::create($request->validated());

        return redirect()->route('devices.index')
            ->with('success', "Device {$device->name} has been added successfully!");
    }

    /**
     * Show the form for editing the specified device.
     */
    public function edit(Device $device)
    {
        $device->load('assignedEmployee');

        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('devices/form', [
            'device' => $device,
            'employees' => $employees,
            'deviceTypes' => [
                ['value' => 'laptop', 'label' => 'Laptop'],
                ['value' => 'desktop', 'label' => 'Desktop'],
                ['value' => 'phone', 'label' => 'Phone'],
                ['value' => 'tablet', 'label' => 'Tablet'],
                ['value' => 'monitor', 'label' => 'Monitor'],
                ['value' => 'other', 'label' => 'Other'],
            ],
            'statuses' => [
                ['value' => 'in_use', 'label' => 'In Use'],
                ['value' => 'available', 'label' => 'Available'],
                ['value' => 'maintenance', 'label' => 'Maintenance'],
                ['value' => 'retired', 'label' => 'Retired'],
            ],
        ]);
    }

    /**
     * Update the specified device in storage.
     */
    public function update(UpdateDeviceRequest $request, Device $device)
    {
        $device->update($request->validated());

        return redirect()->route('devices.index')
            ->with('success', "Device {$device->name} has been updated successfully!");
    }

    /**
     * Remove the specified device from storage.
     */
    public function destroy(Device $device)
    {
        $name = $device->name;
        $device->delete();

        return redirect()->route('devices.index')
            ->with('success', "Device {$name} has been deleted successfully!");
    }
}
