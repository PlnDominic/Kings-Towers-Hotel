"use client";

import { useState } from "react";
import { useBooking } from "./BookingContext";
import { ctaBase, CtaArrow } from "./ui";

const inputClass =
  "border border-[#d8d5cf] bg-white px-4 py-[0.85rem] text-[0.92rem] text-body placeholder:text-body/70";

export default function Reservation() {
  const { booking } = useBooking();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

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
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section id="reservation" className="scroll-mt-20 bg-cream px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4.5rem,12vh,9rem)]">
      <div className="mx-auto max-w-[640px] text-center">
        <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">Reservation</span>
        <h2 className="mt-[0.6rem] mb-0 font-display text-[clamp(1.9rem,3.6vw,2.5rem)] leading-[1.1]">
          Request a booking
        </h2>
        <p className="mt-[0.9rem] text-[0.98rem] leading-[1.7] text-body">
          Tell us your dates and room type; our team will confirm availability by phone or email.
        </p>
      </div>

      {status === "sent" ? (
        <div className="mx-auto mt-10 max-w-[640px] border border-hairline bg-white p-10 text-center">
          <p className="m-0 text-[1.05rem] font-semibold">Thank you — we&#39;ve received your request.</p>
          <p className="mt-[0.6rem] text-[0.9rem] text-body">We&#39;ll be in touch shortly to confirm your stay.</p>
        </div>
      ) : (
        <form
          key={`${booking.checkIn}-${booking.checkOut}-${booking.roomType}`}
          onSubmit={onSubmit}
          className="mx-auto mt-10 grid max-w-[640px] grid-cols-1 gap-4 min-[701px]:grid-cols-2"
        >
          <input required name="name" placeholder="Full name" className={`${inputClass} min-[701px]:col-span-2`} />
          <input required type="email" name="email" placeholder="Email" className={inputClass} />
          <input required type="tel" name="phone" placeholder="Phone" className={inputClass} />
          <input
            required
            type="date"
            name="checkIn"
            aria-label="Check-in"
            defaultValue={booking.checkIn}
            className={inputClass}
          />
          <input
            required
            type="date"
            name="checkOut"
            aria-label="Check-out"
            defaultValue={booking.checkOut}
            className={inputClass}
          />
          <select
            required
            name="roomType"
            defaultValue={booking.roomType}
            className={`${inputClass} min-[701px]:col-span-2`}
          >
            <option value="">Room type</option>
            <option value="standard">Standard Room — GHS 425/night</option>
            <option value="queen">Queen Room — GHS 525/night</option>
            <option value="twin">Twin Room — GHS 745/night</option>
            <option value="mini-suite">Mini Suite — GHS 695/night</option>
          </select>
          <textarea
            name="message"
            placeholder="Anything else we should know?"
            rows={3}
            className={`${inputClass} resize-y min-[701px]:col-span-2`}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className={`${ctaBase} px-4 py-4 text-[0.92rem] tracking-[0.02em] min-[701px]:col-span-2`}
          >
            {status === "sending" ? "Sending…" : "Request Booking"}
            {status !== "sending" && <CtaArrow />}
          </button>
          {status === "error" && (
            <p className="text-[0.85rem] text-red-600 min-[701px]:col-span-2">{error}</p>
          )}
        </form>
      )}
    </section>
  );
}
