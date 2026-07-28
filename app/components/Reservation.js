"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { rooms } from "../data";
import { ctaBase, CtaArrow } from "./ui";

const inputClass =
  "w-full border border-hairline bg-white px-4 py-[0.85rem] text-[0.92rem] text-ink placeholder:text-muted transition-colors duration-200 focus:border-accent focus:outline-none";

const labelClass = "mb-2 block font-mono-label text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted";

function StepLabel({ n, children }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="font-mono-label text-[0.72rem] font-bold tracking-[0.22em] text-accent">STEP {n}</span>
      <span className="font-display text-[1rem] font-bold uppercase tracking-[0.03em] text-ink">{children}</span>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}

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
    <>
      {/* Arrival banner — same photographic language as the hero, so booking
          feels like a continuation of the site rather than a bolted-on form. */}
      <section className="relative isolate flex min-h-[52svh] items-center justify-center overflow-hidden text-center min-[880px]:min-h-[58svh]">
        <Image
          src="/images/pool-waterfall.jpg"
          alt="Kings Towers Hotel"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,17,22,0.58) 0%, rgba(15,17,22,0.38) 50%, rgba(15,17,22,0.62) 100%)",
          }}
        />
        <div className="px-[clamp(1.25rem,5vw,5.5rem)] pt-16">
          <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.3em] text-white/75">
            Reservation
          </span>
          <h1 className="mt-4 font-serif-display text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.1] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.4)]">
            Reserve Your Stay
          </h1>
          <p className="mx-auto mt-4 max-w-[46ch] text-[1rem] leading-[1.7] text-white/85">
            Choose a room and your dates — our team confirms availability and final pricing by phone or email.
            Nothing is charged here.
          </p>
        </div>
      </section>

      <section className="bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4rem,10vh,7rem)]">
        {status === "sent" ? (
          <div className="mx-auto max-w-[640px] border border-hairline bg-cream p-12 text-center">
            <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">Confirmed</span>
            <p className="mt-3 font-serif-display text-[1.4rem] font-medium text-ink">
              Thank you — we&#39;ve received your request.
            </p>
            <p className="mt-3 text-[0.92rem] text-body">We&#39;ll be in touch shortly to confirm your stay.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mx-auto max-w-[1180px]">
            <StepLabel n="01">Choose a Room</StepLabel>
            <input type="hidden" name="roomType" value={roomId} />
            <div className="grid grid-cols-1 gap-6 min-[561px]:grid-cols-2 min-[1024px]:grid-cols-4">
              {rooms.map((room) => {
                const selected = room.id === roomId;
                return (
                  <button
                    type="button"
                    key={room.id}
                    onClick={() => setRoomId(room.id)}
                    aria-pressed={selected}
                    className="group flex flex-col border-0 bg-transparent p-0 text-left transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {room.img ? (
                        <Image
                          src={room.img}
                          alt={room.alt}
                          fill
                          sizes="(max-width: 561px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#ded9d0] text-[0.78rem] text-body">
                          Photo coming soon
                        </div>
                      )}
                    </div>
                    <div
                      className="h-[3px] w-full transition-colors duration-300"
                      style={{ background: selected ? "var(--color-accent)" : "var(--color-hairline)" }}
                    />
                    <div className="pt-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-[0.95rem] font-bold text-ink">{room.title}</span>
                        <span
                          className="whitespace-nowrap font-display text-[0.9rem] font-bold transition-colors duration-300"
                          style={{ color: selected ? "var(--color-accent)" : "var(--color-ink)" }}
                        >
                          GHS {room.price}
                        </span>
                      </div>
                      <span className="font-mono-label text-[0.64rem] uppercase tracking-[0.14em] text-muted">
                        Per Night
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-16 grid grid-cols-1 gap-14 min-[900px]:grid-cols-[1fr_22rem]">
              <div>
                <StepLabel n="02">Your Stay</StepLabel>
                <div className="grid grid-cols-1 gap-5 min-[561px]:grid-cols-3">
                  <label>
                    <span className={labelClass}>Check-in</span>
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
                  <label>
                    <span className={labelClass}>Check-out</span>
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
                  <label>
                    <span className={labelClass}>Guests</span>
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
                </div>
                {datesInvalid && (
                  <p className="mt-3 text-[0.82rem] text-red-600">Check-out must be after check-in.</p>
                )}

                <div className="mt-14">
                  <StepLabel n="03">Your Details</StepLabel>
                  <div className="grid grid-cols-1 gap-5 min-[561px]:grid-cols-2">
                    <label className="min-[561px]:col-span-2">
                      <span className={labelClass}>Full name</span>
                      <input required name="name" placeholder="Full name" className={inputClass} />
                    </label>
                    <label>
                      <span className={labelClass}>Email</span>
                      <input required type="email" name="email" placeholder="Email" className={inputClass} />
                    </label>
                    <label>
                      <span className={labelClass}>Phone</span>
                      <input required type="tel" name="phone" placeholder="Phone" className={inputClass} />
                    </label>
                    <label className="min-[561px]:col-span-2">
                      <span className={labelClass}>Message (optional)</span>
                      <textarea
                        name="message"
                        placeholder="Anything else we should know?"
                        rows={3}
                        className={`${inputClass} resize-y`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Sticky checkout summary — price and CTA live together, the
                  pattern every real booking engine uses. Dark, echoing the
                  footer, so it reads as a distinct "receipt" against the
                  white form. */}
              <div className="h-fit bg-near-black p-8 text-white min-[900px]:sticky min-[900px]:top-28">
                <span className="font-mono-label text-[0.68rem] uppercase tracking-[0.22em] text-white/50">
                  Summary
                </span>

                {selectedRoom ? (
                  <>
                    <div className="relative mt-5 aspect-[4/3] overflow-hidden">
                      {selectedRoom.img ? (
                        <Image
                          src={selectedRoom.img}
                          alt={selectedRoom.alt}
                          fill
                          sizes="22rem"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/10 text-[0.78rem] text-white/60">
                          Photo coming soon
                        </div>
                      )}
                    </div>
                    <h3 className="mt-5 font-display text-[1.05rem] font-bold text-white">{selectedRoom.title}</h3>

                    <div className="mt-5 flex justify-between border-t border-white/15 pt-5 text-[0.85rem] text-white/70">
                      <span>{nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Select dates"}</span>
                      <span>
                        {guests} guest{guests > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="mt-5 flex items-baseline justify-between border-t border-white/15 pt-5">
                      <span className="text-[0.9rem] font-semibold text-white">Estimated total</span>
                      <span className="font-serif-display text-[1.7rem] font-medium text-accent-soft">
                        {subtotal != null ? `GHS ${subtotal}` : "—"}
                      </span>
                    </div>
                    <p className="mt-2 text-[0.72rem] leading-[1.5] text-white/45">
                      Estimate only — final pricing and availability confirmed by our team.
                    </p>
                  </>
                ) : (
                  <p className="mt-5 text-[0.88rem] text-white/70">Choose a room to see pricing.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`${ctaBase} mt-8 w-full px-4 py-4 text-[0.9rem] tracking-[0.02em]`}
                >
                  {status === "sending" ? "Sending…" : "Request Booking"}
                  {status !== "sending" && <CtaArrow />}
                </button>
                {status === "error" && <p className="mt-3 text-[0.82rem] text-red-400">{error}</p>}
              </div>
            </div>
          </form>
        )}
      </section>
    </>
  );
}
