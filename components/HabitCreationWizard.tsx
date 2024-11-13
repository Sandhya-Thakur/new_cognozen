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
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    hour: "8",
    minute: "00",
    period: "AM",
  });
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const [reminderUnit, setReminderUnit] = useState("Minutes before");
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");

  const weekDays = [
    { short: "Mo", long: "Monday" },
    { short: "Tu", long: "Tuesday" },
    { short: "We", long: "Wednesday" },
    { short: "Th", long: "Thursday" },
    { short: "Fr", long: "Friday" },
    { short: "Sa", long: "Saturday" },
    { short: "Su", long: "Sunday" },
  ];

  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "Habits" },
    { id: "2", name: "Motivation" },
    { id: "3", name: "Meditation" },
    { id: "4", name: "Selfawareness" },
  ]);

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

  const handleDateSelect = (day: number) => {
    const date = `November ${day}, 2024`;
    const time = `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.period}`;
    setSchedule(`${date} @ ${time}`);
    setShowCalendar(false);
  };

  // Add this function to update schedule when time changes
  const handleTimeChange = (
    field: "hour" | "minute" | "period",
    value: string
  ) => {
    setSelectedTime((prev) => {
      const newTime = { ...prev, [field]: value };
      // Update schedule with new time
      if (schedule) {
        const [date] = schedule.split("@");
        setSchedule(
          `${date.trim()} @ ${newTime.hour}:${newTime.minute} ${newTime.period}`
        );
      }
      return newTime;
    });
  };

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
          tags: tags.map((tag) => tag.name), // Modified to send only tag names
        }),
      });

      if (!response.ok) throw new Error("Failed to create habit");
      onClose();
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-6">Add Habit</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
                  <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer" />
                  <span className="font-medium">November 2024</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
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
                  {[...Array(35)].map((_, i) => {
                    const day = i + 1;
                    const isCurrentDay = day === 26;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={`h-8 w-8 flex items-center justify-center rounded-full hover:bg-blue-50 
                  ${isCurrentDay ? "bg-blue-600 text-white" : "text-gray-700"}
                  ${day > 30 ? "text-gray-300" : ""}`}
                        disabled={day > 30}
                      >
                        {day <= 30 ? day : day - 30}
                      </button>
                    );
                  })}
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

              {/* Done Button Section */}
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
                        schedule.split("@")[0]?.trim() || `November 26, 2024`;
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

          {/* Week Day Selector */}
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
                <ChevronLeft className="w-5 h-5 text-gray-400 cursor-pointer" />
                <span className="font-medium">December 2024</span>
                <ChevronRight className="w-5 h-5 text-gray-400 cursor-pointer" />
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
                {[...Array(35)].map((_, i) => {
                  const day = i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`h-8 w-8 flex items-center justify-center rounded-full hover:bg-blue-50 
                ${day === 16 ? "bg-blue-600 text-white" : "text-gray-700"}`}
                      onClick={() => {
                        setEndRepeat(`December ${day}, 2024`);
                        setShowEndDateCalendar(false);
                      }}
                    >
                      {day <= 31 ? day : day - 31}
                      {day === 12 && (
                        <span className="absolute w-1 h-1 bg-yellow-400 rounded-full -bottom-1"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

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
                <span>Select</span>
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
          <button
            type="button"
            className="px-4 py-2 border-2 border-dashed border-yellow-200 rounded-full text-gray-400 hover:border-yellow-300 transition-colors"
          >
            + Add tag
          </button>
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
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitCreationWizard;
