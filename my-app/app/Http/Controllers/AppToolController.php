<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppToolRequest;
use App\Http\Requests\UpdateAppToolRequest;
use App\Models\AppTool;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppToolController extends Controller
{
    /**
     * Display a listing of app tools.
     */
    public function index(Request $request)
    {
        $query = AppTool::query();

        // Apply search filter
        if ($search = $request->input('search')) {
            $query->search($search);
        }

        // Apply category filter
        if ($category = $request->input('category')) {
            $query->byCategory($category);
        }

        // Apply status filter
        if ($status = $request->input('status')) {
            $query->byStatus($status);
        }

        // Get unique categories for filter dropdown
        $categories = AppTool::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->orderBy('category')
            ->pluck('category');

        $apps = $query->orderBy('name', 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('apps/index', [
            'apps' => $apps,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new app tool.
     */
    public function create()
    {
        // Get unique categories
        $categories = AppTool::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('apps/form', [
            'app' => null,
            'categories' => $categories,
            'statuses' => [
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'inactive', 'label' => 'Inactive'],
                ['value' => 'pending', 'label' => 'Pending'],
            ],
        ]);
    }

    /**
     * Store a newly created app tool in storage.
     */
    public function store(StoreAppToolRequest $request)
    {
        $app = AppTool::create($request->validated());

        return redirect()->route('apps.index')
            ->with('success', "App '{$app->name}' has been added successfully!");
    }

    /**
     * Show the form for editing the specified app tool.
     */
    public function edit(AppTool $app)
    {
        // Get unique categories
        $categories = AppTool::select('category')
            ->distinct()
            ->whereNotNull('category')
            ->orderBy('category')
            ->pluck('category');

        return Inertia::render('apps/form', [
            'app' => $app,
            'categories' => $categories,
            'statuses' => [
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'inactive', 'label' => 'Inactive'],
                ['value' => 'pending', 'label' => 'Pending'],
            ],
        ]);
    }

    /**
     * Update the specified app tool in storage.
     */
    public function update(UpdateAppToolRequest $request, AppTool $app)
    {
        $app->update($request->validated());

        return redirect()->route('apps.index')
            ->with('success', "App '{$app->name}' has been updated successfully!");
    }

    /**
     * Remove the specified app tool from storage.
     */
    public function destroy(AppTool $app)
    {
        $name = $app->name;
        $app->delete();

        return redirect()->route('apps.index')
            ->with('success', "App '{$name}' has been deleted successfully!");
    }
}
