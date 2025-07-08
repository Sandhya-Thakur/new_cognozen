import React, { useState } from "react";
import {
  Calendar,
  Mic,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Tag = {
  id: string;
  name: string;
};

interface HabitCreationWizardProps {
  onClose: () => void;
}

const HabitCreationWizard: React.FC<HabitCreationWizardProps> = ({
  onClose,
}) => {
  // Basic form state
  const [habitType, setHabitType] = useState<"routine" | "challenge">(
    "routine"
  );
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [repeatSchedule, setRepeatSchedule] = useState("daily");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [endRepeat, setEndRepeat] = useState("");
  const [challengeLength, setChallengeLength] = useState("");
  const [timePerSession, setTimePerSession] = useState("");
  const [reminder, setReminder] = useState("");
  const [showOnScheduledTime, setShowOnScheduledTime] = useState(true);
  const [reminderUnit, setReminderUnit] = useState("Minutes before");
  const [newTag, setNewTag] = useState("");

  // UI state for dropdowns and modals
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);

  // Time picker state
  const [selectedTime, setSelectedTime] = useState({
    hour: "8",
    minute: "00",
    period: "AM",
  });

  // Calendar state - NEW: Added separate state for both calendars
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [endDateMonth, setEndDateMonth] = useState(new Date().getMonth());
  const [endDateYear, setEndDateYear] = useState(new Date().getFullYear());

  // Static data
  const weekDays = [
    { short: "Mo", long: "Monday" },
    { short: "Tu", long: "Tuesday" },
    { short: "We", long: "Wednesday" },
    { short: "Th", long: "Thursday" },
    { short: "Fr", long: "Friday" },
    { short: "Sa", long: "Saturday" },
    { short: "Su", long: "Sunday" },
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "Habits" },
    { id: "2", name: "Motivation" },
    { id: "3", name: "Meditation" },
    { id: "4", name: "Selfawareness" },
  ]);
  // Calendar helper functions - NEW: Proper calendar calculations
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 7 : firstDay; // Convert Sunday (0) to 7 for Monday start
  };

  // Navigation functions for start date calendar
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Navigation functions for end date calendar
  const handleEndDatePrevMonth = () => {
    if (endDateMonth === 0) {
      setEndDateMonth(11);
      setEndDateYear(endDateYear - 1);
    } else {
      setEndDateMonth(endDateMonth - 1);
    }
  };

  const handleEndDateNextMonth = () => {
    if (endDateMonth === 11) {
      setEndDateMonth(0);
      setEndDateYear(endDateYear + 1);
    } else {
      setEndDateMonth(endDateMonth + 1);
    }
  };

  // Reusable calendar rendering function - NEW: Dynamic calendar generation
  const renderCalendarDays = (
    month: number,
    year: number,
    onDateSelect: (day: number) => void
  ) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const daysArray = [];

    // Add empty cells for days before the first day of the month
    for (let i = 1; i < firstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      daysArray.push(
        <button
          key={day}
          type="button"
          onClick={() => onDateSelect(day)}
          className={`h-8 w-8 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors
            ${isToday ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`}
        >
          {day}
        </button>
      );
    }

    return daysArray;
  };

  // Event handlers
  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags((prev) => [
        ...prev,
        { id: Date.now().toString(), name: newTag.trim() },
      ]);
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const handleDaySelection = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Date selection handlers - NEW: Proper date formatting
  const handleDateSelect = (day: number) => {
    const date = `${monthNames[currentMonth]} ${day}, ${currentYear}`;
    const time = `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`;
    setSchedule(`${date} @ ${time}`);
    setShowCalendar(false);
  };

  const handleEndDateSelect = (day: number) => {
    const date = `${monthNames[endDateMonth]} ${day}, ${endDateYear}`;
    setEndRepeat(date);
    setShowEndDateCalendar(false);
  };

  // Time change handler - FIXED: Properly updates schedule
  const handleTimeChange = (
    field: "hour" | "minute" | "period",
    value: string
  ) => {
    setSelectedTime((prev) => {
      const newTime = { ...prev, [field]: value };
      // Update schedule with new time if date is already selected
      if (schedule) {
        const [date] = schedule.split("@");
        setSchedule(
          `${date.trim()} @ ${newTime.hour}:${newTime.minute} ${newTime.period}`
        );
      }
      return newTime;
    });
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/habits/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          habitType,
          schedule: {
            startDate: schedule,
            repeat: repeatSchedule,
            selectedDays:
              repeatSchedule === "weekly" ? selectedDays : undefined,
          },
          endDate: endRepeat,
          challengeLength:
            habitType === "challenge" ? parseInt(challengeLength) : null,
          timePerSession: parseInt(timePerSession),
          reminder,
          showOnScheduledTime,
          tags: tags.map((tag) => tag.name),
        }),
      });

      if (!response.ok) throw new Error("Failed to create habit");
      onClose();
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6">Add Habit</h2>

      <div className="space-y-4">
        {/* Habit Type Selection */}
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2">
            <div className="relative">
              <input
                type="radio"
                checked={habitType === "routine"}
                onChange={() => setHabitType("routine")}
                className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:border-[6px] transition-all"
              />
            </div>
            <span className="text-gray-700">Routine Habit</span>
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-800 text-xs">
              i
            </span>
          </label>

          <label className="flex items-center gap-2">
            <div className="relative">
              <input
                type="radio"
                checked={habitType === "challenge"}
                onChange={() => setHabitType("challenge")}
                className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-blue-500 checked:border-[6px] transition-all"
              />
            </div>
            <span className="text-gray-700">
              <span className="text-yellow-400 mr-1">★</span>
              Challenge the Habit
            </span>
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-800 text-xs">
              i
            </span>
          </label>
        </div>

        {/* Habit Title */}
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Morning Meditation"
            className="w-full p-4 bg-gray-50 rounded-xl pr-10 placeholder-gray-400"
            required
          />
          <Mic className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600" />
        </div>

        {/* Habit Schedule */}
        <div className="relative">
          <label className="text-sm text-gray-600">Habit Schedule*</label>
          <div
            className="mt-1 w-full p-4 bg-gray-50 rounded-xl flex justify-between items-center cursor-pointer"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Select date and time"
              className="bg-transparent border-none outline-none w-full"
              readOnly
              required
            />
            <div className="flex gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {showCalendar && (
            <div className="absolute z-10 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-full">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <ChevronLeft
                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={handlePrevMonth}
                  />
                  <span className="font-medium">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <ChevronRight
                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={handleNextMonth}
                  />
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-600"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {renderCalendarDays(
                    currentMonth,
                    currentYear,
                    handleDateSelect
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Time</span>
                  <select
                    value={selectedTime.hour}
                    onChange={(e) => handleTimeChange("hour", e.target.value)}
                    className="w-16 p-2 bg-gray-50 rounded-lg text-center"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={selectedTime.minute}
                    onChange={(e) => handleTimeChange("minute", e.target.value)}
                    className="w-16 p-2 bg-gray-50 rounded-lg text-center"
                  >
                    {["00", "15", "30", "45"].map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`px-2 py-1 rounded-2xl ${
                        selectedTime.period === "AM"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => handleTimeChange("period", "AM")}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      className={`px-2 py-1 rounded-2xl ${
                        selectedTime.period === "PM"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() => handleTimeChange("period", "PM")}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex justify-end">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCalendar(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const date =
                        schedule.split("@")[0]?.trim() ||
                        `${monthNames[currentMonth]} ${new Date().getDate()}, ${currentYear}`;
                      const time = `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`;
                      setSchedule(`${date} @ ${time}`);
                      setShowCalendar(false);
                    }}
                    className="px-2 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Repeat Schedule */}
        <div className="relative">
          <label className="text-sm text-gray-600">Repeat Schedule</label>
          <div
            className="mt-1 w-full p-4 bg-gray-50 rounded-xl flex justify-between items-center cursor-pointer"
            onClick={() => setShowRepeatOptions(!showRepeatOptions)}
          >
            <span className="text-gray-700">
              {repeatSchedule === "daily" && "Daily"}
              {repeatSchedule === "everyday" && "Every day"}
              {repeatSchedule === "weekly" && "Every Week"}
              {repeatSchedule === "monthly" && "Every Month"}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {showRepeatOptions && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-2">
              <div className="space-y-1">
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    repeatSchedule === "daily"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setRepeatSchedule("daily");
                    setShowRepeatOptions(false);
                  }}
                >
                  Daily
                </button>
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    repeatSchedule === "everyday"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setRepeatSchedule("everyday");
                    setShowRepeatOptions(false);
                  }}
                >
                  Every day
                </button>
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    repeatSchedule === "weekly"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setRepeatSchedule("weekly");
                    setShowRepeatOptions(false);
                  }}
                >
                  Every Week
                </button>
                <button
                  type="button"
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    repeatSchedule === "monthly"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setRepeatSchedule("monthly");
                    setShowRepeatOptions(false);
                  }}
                >
                  Every Month
                </button>
              </div>
            </div>
          )}

          {repeatSchedule === "weekly" && (
            <div className="mt-2 p-2 bg-gray-50 rounded-xl flex justify-between">
              {weekDays.map((day) => (
                <button
                  key={day.short}
                  type="button"
                  onClick={() => handleDaySelection(day.short)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    selectedDays.includes(day.short)
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  title={day.long}
                >
                  {day.short}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* End Repeat */}
        <div className="relative">
          <label className="text-sm text-gray-600">End Repeat</label>
          <div
            className="mt-1 w-full p-4 bg-gray-50 rounded-xl flex justify-between items-center cursor-pointer"
            onClick={() => setShowEndDateCalendar(!showEndDateCalendar)}
          >
            <input
              type="text"
              value={endRepeat}
              onChange={(e) => setEndRepeat(e.target.value)}
              placeholder="End date"
              className="bg-transparent border-none outline-none w-full"
              required
            />
            <div className="flex gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {showEndDateCalendar && (
            <div className="absolute z-10 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 w-full">
              <div className="flex justify-between items-center mb-4">
                <ChevronLeft
                  className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={handleEndDatePrevMonth}
                />
                <span className="font-medium">
                  {monthNames[endDateMonth]} {endDateYear}
                </span>
                <ChevronRight
                  className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600"
                  onClick={handleEndDateNextMonth}
                />
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-600"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays(
                  endDateMonth,
                  endDateYear,
                  handleEndDateSelect
                )}
              </div>
            </div>
          )}
        </div>

        {/* Challenge Length */}
        {habitType === "challenge" && (
          <div className="flex items-center gap-2">
            <span>Challenge Length</span>
            <input
              type="number"
              value={challengeLength}
              onChange={(e) => setChallengeLength(e.target.value)}
              className="w-16 p-2 bg-gray-50 rounded-lg text-center"
              placeholder="30"
            />
            <span className="px-3 py-1 bg-yellow-400 text-black rounded-lg text-sm">
              Days
            </span>
          </div>
        )}

        {/* Time per Session */}
        <div className="flex items-center gap-2">
          <span>Time</span>
          <input
            type="number"
            value={timePerSession}
            onChange={(e) => setTimePerSession(e.target.value)}
            className="w-16 p-2 bg-gray-50 rounded-lg text-center"
          />
          <span className="px-3 py-1 bg-blue-900 text-white rounded-lg text-sm">
            Minutes
          </span>
          <span>per Session</span>
        </div>

        {/* Reminder */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <span>Reminder</span>
            <input
              type="number"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-16 p-2 bg-gray-50 rounded-lg text-center"
              placeholder="30"
            />
            <div className="relative">
              <div
                className="flex items-center gap-2 px-3 py-1 bg-blue-900 text-white rounded-lg text-sm cursor-pointer"
                onClick={() => setShowReminderOptions(!showReminderOptions)}
              >
                <span>{reminderUnit}</span>
                <ChevronDown className="w-4 h-4" />
              </div>

              {showReminderOptions && (
                <div className="absolute z-10 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="p-1">
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        setReminderUnit("At time scheduled");
                        setShowReminderOptions(false);
                      }}
                    >
                      At time scheduled
                    </button>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        setReminderUnit("Minutes before");
                        setShowReminderOptions(false);
                      }}
                    >
                      Minutes before
                    </button>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        setReminderUnit("Hours before");
                        setShowReminderOptions(false);
                      }}
                    >
                      Hours before
                    </button>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50"
                      onClick={() => {
                        setReminderUnit("Days before");
                        setShowReminderOptions(false);
                      }}
                    >
                      Days before
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Show on Scheduled Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Show on Scheduled Time</span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-800 text-xs">
              i
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showOnScheduledTime}
              onChange={(e) => setShowOnScheduledTime(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Add Tags */}
        <div>
          <span className="block mb-2">Add Tags</span>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {showTagInput ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Enter tag name"
                className="flex-1 p-2 bg-gray-50 rounded-lg text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowTagInput(true)}
              className="px-4 py-2 border-2 border-dashed border-yellow-200 rounded-full text-gray-400 hover:border-yellow-300 transition-colors"
            >
              + Add tag
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCreationWizard;
