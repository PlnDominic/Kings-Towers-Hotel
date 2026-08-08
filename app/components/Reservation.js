"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { rooms } from "../data";
import { ctaBase, CtaArrow } from "./ui";
import BookingCalendar from "./BookingCalendar";

const inputClass =
  "w-full border border-hairline bg-white px-4 py-[0.85rem] text-[0.92rem] text-ink placeholder:text-muted transition-colors duration-200 focus:border-accent focus:outline-none";

const labelClass = "mb-2 block font-mono-label text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted";

const STEPS = [
  { n: 1, label: "Select Date" },
  { n: 2, label: "Select Room" },
  { n: 3, label: "Your Details" },
  { n: 4, label: "Complete" },
];

function StepBar({ step }) {
  return (
    <div className="flex w-full">
      {STEPS.map((s, i) => {
        const active = step === s.n;
        const done = step > s.n;
        const isFirst = i === 0;
        const isLast = i === STEPS.length - 1;
        return (
          <div
            key={s.n}
            className="relative flex flex-1 items-center justify-center px-4 py-4 text-center min-[640px]:px-6"
            style={{
              clipPath: isFirst
                ? "polygon(0 0, calc(100% - 1rem) 0, 100% 50%, calc(100% - 1rem) 100%, 0 100%)"
                : isLast
                  ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 1rem 50%)"
                  : "polygon(0 0, calc(100% - 1rem) 0, 100% 50%, calc(100% - 1rem) 100%, 0 100%, 1rem 50%)",
              marginLeft: isFirst ? 0 : "-1rem",
              zIndex: STEPS.length - i,
              background: active ? "var(--color-accent)" : done ? "#33363c" : "#1c1e22",
            }}
          >
            <span className="font-mono-label text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-white min-[640px]:text-[0.72rem]">
              <span className="hidden min-[560px]:inline">{s.n}. </span>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CounterField({ label, value, onChange, min = 0 }) {
  return (
    <div className="flex items-center justify-between border border-white/15 px-4 py-3">
      <span className="font-mono-label text-[0.7rem] uppercase tracking-[0.1em] text-white/70">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="flex h-7 w-7 items-center justify-center border border-white/25 bg-transparent text-white transition-colors duration-200 hover:bg-white/10"
        >
          −
        </button>
        <span className="w-4 text-center text-[0.9rem] text-white">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
          className="flex h-7 w-7 items-center justify-center border border-white/25 bg-transparent text-white transition-colors duration-200 hover:bg-white/10"
        >
          +
        </button>
      </div>
    </div>
  );
}

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  return diff > 0 ? diff : 0;
}

export default function Reservation({
  initialCheckIn = "",
  initialCheckOut = "",
  initialRoomType = "",
  initialAdults = 2,
  initialChildren = 0,
  initialPromo = "",
}) {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState(initialRoomType);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);

  const selectedRoom = rooms.find((r) => r.id === roomId) || null;
  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const subtotal = selectedRoom && nights > 0 ? nights * Number(selectedRoom.price) : null;
  const guestsLabel = `${adults} adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} child${children > 1 ? "ren" : ""}` : ""}`;

  const canLeaveStep1 = checkIn && checkOut && nights > 0;
  const canLeaveStep2 = Boolean(roomId);

  async function onSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    data.roomType = roomId;
    data.checkIn = checkIn;
    data.checkOut = checkOut;
    data.guests = guestsLabel;
    data.nights = String(nights);
    if (subtotal != null) data.estimatedTotal = String(subtotal);
    if (initialPromo) data.promo = initialPromo;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const resBody = await res.json().catch(() => ({}));
        throw new Error(resBody.error || "Something went wrong. Please try again.");
      }
      const resBody = await res.json();
      if (resBody.checkoutUrl) {
        setStatus("redirecting");
        window.location.href = resBody.checkoutUrl;
      } else {
        setStatus("idle");
        setStep(4);
      }
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <>
      {/* Arrival banner — same photographic language as the hero, so booking
          feels like a continuation of the site rather than a bolted-on form. */}
      <section className="relative isolate flex min-h-[26svh] items-center justify-center overflow-hidden text-center min-[880px]:min-h-[30svh]">
        <Image
          src="/images/room-queen.jpg"
          alt="Queen Room with wood ceiling and orange curtains"
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
            Choose your dates and room — complete your reservation securely with ExpressPay Ghana.
          </p>
        </div>
      </section>

      <StepBar step={step} />

      <form onSubmit={onSubmit}>
        {step === 1 && (
          <section className="bg-near-black px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(3rem,8vh,5rem)]">
            <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-8 min-[900px]:grid-cols-[1fr_18rem]">
              <BookingCalendar
                checkIn={checkIn}
                checkOut={checkOut}
                onChange={({ checkIn: ci, checkOut: co }) => {
                  setCheckIn(ci);
                  setCheckOut(co);
                }}
              />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 bg-[#1c1e22] p-5">
                  <span className="font-mono-label text-[0.68rem] uppercase tracking-[0.22em] text-white/50">
                    Guests
                  </span>
                  <CounterField label="Adults" value={adults} onChange={setAdults} min={1} />
                  <CounterField label="Children" value={children} onChange={setChildren} min={0} />
                </div>
                <button
                  type="button"
                  disabled={!canLeaveStep1}
                  onClick={() => setStep(2)}
                  className={`${ctaBase} w-full px-4 py-4 text-[0.9rem] tracking-[0.02em] disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Continue
                  <CtaArrow />
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(3rem,8vh,5rem)]">
            <div className="mx-auto max-w-[1180px]">
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

              <div className="mt-12 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-mono-label text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-200 hover:text-accent"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!canLeaveStep2}
                  onClick={() => setStep(3)}
                  className={`${ctaBase} px-8 py-4 text-[0.9rem] tracking-[0.02em] disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Continue
                  <CtaArrow />
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(3rem,8vh,5rem)]">
            <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-14 min-[900px]:grid-cols-[1fr_22rem]">
              <div>
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

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-8 font-mono-label text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-200 hover:text-accent"
                >
                  ← Back
                </button>
              </div>

              {/* Sticky checkout summary — price and CTA live together, the
                  pattern every real booking engine uses. Dark, echoing the
                  footer, so it reads as a distinct "receipt" against the
                  white form. */}
              <div className="h-fit bg-near-black p-8 text-white min-[900px]:sticky min-[900px]:top-28">
                <span className="font-mono-label text-[0.68rem] uppercase tracking-[0.22em] text-white/50">
                  Summary
                </span>

                {selectedRoom && (
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
                      <span>{checkIn} → {checkOut}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-[0.85rem] text-white/70">
                      <span>{nights} night{nights > 1 ? "s" : ""}</span>
                      <span>{guestsLabel}</span>
                    </div>

                    <div className="mt-5 flex items-baseline justify-between border-t border-white/15 pt-5">
                      <span className="text-[0.9rem] font-semibold text-white">Estimated total</span>
                      <span className="font-serif-display text-[1.7rem] font-medium text-accent-soft">
                        {subtotal != null ? `GHS ${subtotal}` : "—"}
                      </span>
                    </div>
                    <p className="mt-2 text-[0.72rem] leading-[1.5] text-white/45">
                      Secure payment processed via ExpressPay Ghana. Your booking is confirmed upon successful payment.
                    </p>
                    {initialPromo && (
                      <p className="mt-3 border-t border-white/15 pt-3 text-[0.78rem] text-white/70">
                        Promo code: <span className="text-white">{initialPromo}</span>
                      </p>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={status === "sending" || status === "redirecting"}
                  className={`${ctaBase} mt-8 w-full px-4 py-4 text-[0.9rem] tracking-[0.02em]`}
                >
                  {status === "sending"
                    ? "Processing..."
                    : status === "redirecting"
                      ? "Redirecting to Payment..."
                      : "Proceed to Payment"}
                  {(status !== "sending" && status !== "redirecting") && <CtaArrow />}
                </button>
                {status === "error" && <p className="mt-3 text-[0.82rem] text-red-400">{error}</p>}
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4rem,10vh,7rem)]">
            <div className="mx-auto max-w-[640px] border border-hairline bg-cream p-12 text-center">
              <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">Confirmed</span>
              <p className="mt-3 font-serif-display text-[1.4rem] font-medium text-ink">
                Thank you — we&#39;ve received your request.
              </p>
              <p className="mt-3 text-[0.92rem] text-body">We&#39;ll be in touch shortly to confirm your stay.</p>
            </div>
          </section>
        )}
      </form>
    </>
  );
}
