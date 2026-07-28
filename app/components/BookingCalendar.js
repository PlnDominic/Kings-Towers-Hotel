"use client";

import { useState } from "react";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISO(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Monday-first grid, padded with nulls for the leading empty cells.
function buildMonthCells(year, month) {
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
}

export default function BookingCalendar({ checkIn, checkOut, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialView = checkIn ? new Date(checkIn) : today;
  const [viewYear, setViewYear] = useState(initialView.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialView.getMonth());

  function shiftMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  }

  function handlePick(iso) {
    if (!checkIn || (checkIn && checkOut) || iso <= checkIn) {
      onChange({ checkIn: iso, checkOut: "" });
    } else {
      onChange({ checkIn, checkOut: iso });
    }
  }

  function renderMonth(year, month) {
    return (
      <div className="flex-1">
        <p className="mb-4 text-center font-display text-[1rem] font-bold text-white">
          {MONTH_NAMES[month]} {year}
        </p>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-white/40">
              {w}
            </span>
          ))}
          {buildMonthCells(year, month).map((d, i) => {
            if (d == null) return <span key={i} />;
            const iso = toISO(year, month, d);
            const isPast = new Date(year, month, d) < today;
            const isEdge = iso === checkIn || iso === checkOut;
            const inRange = checkIn && checkOut && iso > checkIn && iso < checkOut;
            return (
              <button
                key={i}
                type="button"
                disabled={isPast}
                onClick={() => handlePick(iso)}
                className="mx-auto flex h-9 w-9 items-center justify-center text-[0.85rem] transition-colors duration-150 disabled:cursor-not-allowed"
                style={{
                  color: isPast ? "rgba(255,255,255,0.25)" : isEdge ? "#fff" : "rgba(255,255,255,0.85)",
                  background: isEdge
                    ? "var(--color-accent)"
                    : inRange
                      ? "rgba(209,96,31,0.28)"
                      : isPast
                        ? "transparent"
                        : "rgba(255,255,255,0.06)",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  let nextMonth = viewMonth + 1;
  let nextYear = viewYear;
  if (nextMonth > 11) {
    nextMonth = 0;
    nextYear += 1;
  }

  return (
    <div className="bg-near-black p-6 min-[700px]:p-8">
      <div className="flex items-start gap-4 min-[700px]:gap-8">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="flex h-8 w-8 shrink-0 items-center justify-center border-0 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
        >
          ‹
        </button>
        <div className="flex flex-1 flex-col gap-10 min-[700px]:flex-row">
          {renderMonth(viewYear, viewMonth)}
          {renderMonth(nextYear, nextMonth)}
        </div>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="flex h-8 w-8 shrink-0 items-center justify-center border-0 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
        >
          ›
        </button>
      </div>
      <p className="mt-6 border-t border-white/10 pt-4 text-center text-[0.82rem] text-white/50">
        {checkIn && checkOut
          ? `${checkIn}  →  ${checkOut}`
          : checkIn
            ? "Select your check-out date"
            : "Select your dates by clicking on the calendar above"}
      </p>
    </div>
  );
}
