"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { rooms } from "../data";
import { ctaBase, CtaArrow, SerifHeading } from "./ui";

const inputClass =
  "w-full border border-[#d8d5cf] bg-white px-4 py-[0.85rem] text-[0.92rem] text-body placeholder:text-body/70";

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  return diff > 0 ? diff : 0;
}

const todayStr = new Date().toISOString().slice(0, 10);

export default function Reservation({ initialCheckIn = "", initialCheckOut = "", initialRoomType = "" }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState(initialRoomType);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(2);

  const selectedRoom = rooms.find((r) => r.id === roomId) || null;
  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const subtotal = selectedRoom && nights > 0 ? nights * Number(selectedRoom.price) : null;
  const datesInvalid = checkIn && checkOut && nights === 0;

  async function onSubmit(e) {
    e.preventDefault();
    if (!roomId) {
      setStatus("error");
      setError("Please choose a room.");
      return;
    }
    if (datesInvalid) {
      setStatus("error");
      setError("Check-out must be after check-in.");
      return;
    }

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    data.nights = String(nights);
    if (subtotal != null) data.estimatedTotal = String(subtotal);

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }
      setStatus("sent");
      form.reset();
      setRoomId("");
      setCheckIn("");
      setCheckOut("");
      setGuests(2);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section className="bg-cream px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4.5rem,12vh,9rem)]">
      <div className="mx-auto max-w-[640px] text-center">
        <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">Reservation</span>
        <h1 className="mt-[0.6rem] mb-0 font-serif-display text-[clamp(2rem,3.8vw,2.75rem)] font-medium leading-[1.15] text-ink">
          Reserve Your Stay
        </h1>
        <p className="mt-[0.9rem] text-[0.98rem] leading-[1.7] text-body">
          Choose a room and your dates. Our team confirms availability and final pricing by phone or email — nothing
          is charged here.
        </p>
      </div>

      {status === "sent" ? (
        <div className="mx-auto mt-10 max-w-[640px] border border-hairline bg-white p-10 text-center">
          <p className="m-0 text-[1.05rem] font-semibold">Thank you — we&#39;ve received your request.</p>
          <p className="mt-[0.6rem] text-[0.9rem] text-body">We&#39;ll be in touch shortly to confirm your stay.</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-[1100px]">
          {/* Room picker */}
          <h2 className="m-0 mb-4 font-display text-[0.95rem] font-bold uppercase tracking-[0.06em] text-ink">
            1. Choose a room
          </h2>
          <input type="hidden" name="roomType" value={roomId} />
          <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2 min-[1024px]:grid-cols-4">
            {rooms.map((room) => {
              const selected = room.id === roomId;
              return (
                <button
                  type="button"
                  key={room.id}
                  onClick={() => setRoomId(room.id)}
                  aria-pressed={selected}
                  className="group relative border bg-white p-0 text-left transition-colors duration-200"
                  style={{ borderColor: selected ? "var(--color-accent)" : "var(--color-hairline)", borderWidth: selected ? "2px" : "1px" }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {room.img ? (
                      <Image
                        src={room.img}
                        alt={room.alt}
                        fill
                        sizes="(max-width: 561px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#ded9d0] text-[0.78rem] text-body">
                        Photo coming soon
                      </div>
                    )}
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-accent text-[0.75rem] font-bold text-white">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-display text-[0.92rem] font-bold text-ink">{room.title}</span>
                      <span className="whitespace-nowrap text-[0.82rem] font-semibold text-accent">GHS {room.price}</span>
                    </div>
                    <span className="text-[0.72rem] text-muted">per night</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details + summary */}
          <div className="mt-12 grid grid-cols-1 gap-10 min-[900px]:grid-cols-[1fr_20rem]">
            <div>
              <h2 className="m-0 mb-4 font-display text-[0.95rem] font-bold uppercase tracking-[0.06em] text-ink">
                2. Your details
              </h2>
              <div className="grid grid-cols-1 gap-4 min-[561px]:grid-cols-2">
                <label className="flex flex-col gap-1 text-[0.78rem] font-semibold text-muted">
                  Check-in
                  <input
                    required
                    type="date"
                    name="checkIn"
                    min={todayStr}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1 text-[0.78rem] font-semibold text-muted">
                  Check-out
                  <input
                    required
                    type="date"
                    name="checkOut"
                    min={checkIn || todayStr}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1 text-[0.78rem] font-semibold text-muted min-[561px]:col-span-2">
                  Guests
                  <select
                    name="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className={inputClass}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} guest{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </label>
                {datesInvalid && (
                  <p className="text-[0.82rem] text-red-600 min-[561px]:col-span-2">
                    Check-out must be after check-in.
                  </p>
                )}
                <input required name="name" placeholder="Full name" className={`${inputClass} min-[561px]:col-span-2`} />
                <input required type="email" name="email" placeholder="Email" className={inputClass} />
                <input required type="tel" name="phone" placeholder="Phone" className={inputClass} />
                <textarea
                  name="message"
                  placeholder="Anything else we should know?"
                  rows={3}
                  className={`${inputClass} resize-y min-[561px]:col-span-2`}
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className={`${ctaBase} mt-6 w-full px-4 py-4 text-[0.92rem] tracking-[0.02em]`}
              >
                {status === "sending" ? "Sending…" : "Request Booking"}
                {status !== "sending" && <CtaArrow />}
              </button>
              {status === "error" && <p className="mt-3 text-[0.85rem] text-red-600">{error}</p>}
            </div>

            {/* Summary */}
            <div className="h-fit border border-hairline bg-white p-6">
              <h3 className="m-0 mb-4 font-display text-[0.95rem] font-bold uppercase tracking-[0.06em] text-ink">
                Summary
              </h3>
              {selectedRoom ? (
                <>
                  <div className="flex items-baseline justify-between gap-2 text-[0.92rem] text-ink">
                    <span>{selectedRoom.title}</span>
                    <span className="whitespace-nowrap text-body">GHS {selectedRoom.price}/night</span>
                  </div>
                  <div className="mt-2 flex justify-between text-[0.85rem] text-body">
                    <span>{nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select dates"}</span>
                    <span>
                      {guests} guest{guests > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between border-t border-hairline pt-4">
                    <span className="text-[0.92rem] font-semibold text-ink">Estimated total</span>
                    <span className="font-display text-[1.15rem] font-bold text-accent">
                      {subtotal != null ? `GHS ${subtotal}` : "—"}
                    </span>
                  </div>
                  <p className="mt-2 text-[0.72rem] leading-[1.5] text-muted">
                    Estimate only — final pricing and availability confirmed by our team.
                  </p>
                </>
              ) : (
                <p className="text-[0.88rem] text-body">Choose a room to see pricing.</p>
              )}
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
