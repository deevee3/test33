<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCalendarEventRequest;
use App\Http\Requests\UpdateCalendarEventRequest;
use App\Models\CalendarEvent;
use App\Models\Employee;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CalendarController extends Controller
{
    /**
     * Display a listing of calendar events.
     */
    public function index(Request $request)
    {
        $view = $request->string('view')->value() === 'week' ? 'week' : 'month';
        $focusDate = $request->input('date')
            ? Carbon::parse($request->input('date'))
            : now();

        $rangeStart = $view === 'week'
            ? $focusDate->copy()->startOfWeek()
            : $focusDate->copy()->startOfMonth()->startOfWeek();
        $rangeEnd = $view === 'week'
            ? $focusDate->copy()->endOfWeek()
            : $focusDate->copy()->endOfMonth()->endOfWeek();

        $query = CalendarEvent::with('organizer');

        if ($search = $request->input('search')) {
            $query->search($search);
        }

        if ($type = $request->input('type')) {
            $query->byType($type);
        }

        $events = $query->betweenDates($rangeStart, $rangeEnd)
            ->orderBy('start_datetime', 'asc')
            ->get();

        $tasks = Task::with('employee:id,name')
            ->whereNotNull('due_date')
            ->whereBetween('due_date', [
                $rangeStart->toDateString(),
                $rangeEnd->toDateString(),
            ])
            ->orderBy('due_date')
            ->get();

        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('calendar/index', [
            'events' => $events,
            'tasks' => $tasks,
            'employees' => $employees,
            'filters' => [
                'search' => $request->input('search'),
                'type' => $request->input('type'),
                'view' => $view,
                'date' => $focusDate->toDateString(),
            ],
            'range' => [
                'start' => $rangeStart->toDateString(),
                'end' => $rangeEnd->toDateString(),
            ],
            'eventTypes' => $this->eventTypes(),
        ]);
    }

    /**
     * Show the form for creating a new calendar event.
     */
    public function create()
    {
        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('calendar/form', [
            'event' => null,
            'employees' => $employees,
            'eventTypes' => $this->eventTypes(),
        ]);
    }

    /**
     * Store a newly created calendar event in storage.
     */
    public function store(StoreCalendarEventRequest $request)
    {
        $event = CalendarEvent::create($request->validated());

        return redirect()->route('calendar.index')
            ->with('success', "Event '{$event->title}' has been created successfully!");
    }

    /**
     * Show the form for editing the specified calendar event.
     */
    public function edit(CalendarEvent $calendar)
    {
        $calendar->load('organizer');

        $employees = Employee::select('id', 'name')
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return Inertia::render('calendar/form', [
            'event' => $calendar,
            'employees' => $employees,
            'eventTypes' => $this->eventTypes(),
        ]);
    }

    /**
     * Update the specified calendar event in storage.
     */
    public function update(UpdateCalendarEventRequest $request, CalendarEvent $calendar)
    {
        $calendar->update($request->validated());

        return redirect()->route('calendar.index')
            ->with('success', "Event '{$calendar->title}' has been updated successfully!");
    }

    /**
     * Remove the specified calendar event from storage.
     */
    public function destroy(CalendarEvent $calendar)
    {
        $title = $calendar->title;
        $calendar->delete();

        return redirect()->route('calendar.index')
            ->with('success', "Event '{$title}' has been deleted successfully!");
    }

    /**
     * Get shared event types list.
     */
    private function eventTypes(): array
    {
        return [
            ['value' => CalendarEvent::TYPE_MEETING, 'label' => 'Meeting'],
            ['value' => CalendarEvent::TYPE_HOLIDAY, 'label' => 'Holiday'],
            ['value' => CalendarEvent::TYPE_DEADLINE, 'label' => 'Deadline'],
            ['value' => CalendarEvent::TYPE_OTHER, 'label' => 'Other'],
        ];
    }
}
