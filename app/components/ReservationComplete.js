"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "kings-towers-expresspay";
const POLL_DELAY_MS = 5000;

function roomSummary(session) {
  if (!session?.reservation) return "";
  const { checkIn, checkOut, roomLabel, estimatedTotal } = session.reservation;
  return [roomLabel, checkIn && checkOut ? `${checkIn} to ${checkOut}` : "", estimatedTotal ? `GHS ${estimatedTotal}` : ""]
    .filter(Boolean)
    .join(" • ");
}

export default function ReservationComplete({ orderId = "" }) {
  const [phase, setPhase] = useState("loading"); // loading | missing | checking | pending | success | failed
  const [message, setMessage] = useState("Checking your ExpressPay payment status…");
  const [session, setSession] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const hasConfirmedRef = useRef(false);
  const pollTimeoutRef = useRef(null);

  const summary = useMemo(() => roomSummary(session), [session]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setPhase("missing");
        setMessage("We couldn't find the booking details for this payment session.");
        return undefined;
      }

      const parsed = JSON.parse(raw);
      setSession(parsed);

      if (parsed?.status === "confirmed" && parsed?.receipt) {
        hasConfirmedRef.current = true;
        setReceipt(parsed.receipt);
        setPhase("success");
        setMessage("Your payment has already been confirmed.");
      } else {
        setPhase("checking");
      }
    } catch {
      setPhase("missing");
      setMessage("We couldn't restore the payment session. Please contact the hotel if you were charged.");
    }

    return () => {
      if (pollTimeoutRef.current) {
        window.clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!session?.token || hasConfirmedRef.current) return undefined;

    let cancelled = false;

    async function confirmPayment() {
      setPhase((currentPhase) => (currentPhase === "success" ? currentPhase : "checking"));
      setMessage("Checking your ExpressPay payment status…");

      try {
        const paymentRes = await fetch("/api/expresspay/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: session.token }),
        });

        const paymentBody = await paymentRes.json().catch(() => ({}));
        if (!paymentRes.ok) {
          throw new Error(paymentBody.error || "We couldn't verify the payment status.");
        }

        const payment = paymentBody.payment;
        const result = Number(payment?.result);

        if (result === 1) {
          const confirmRes = await fetch("/api/reservation/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: session.token,
              reservation: session.reservation,
            }),
          });

          const confirmBody = await confirmRes.json().catch(() => ({}));
          if (!confirmRes.ok) {
            throw new Error(confirmBody.error || "Your payment was received, but confirmation failed.");
          }

          if (cancelled) return;

          hasConfirmedRef.current = true;
          setReceipt(confirmBody);
          setPhase("success");
          setMessage("Payment confirmed. The hotel has received your reservation.");

          if (typeof window !== "undefined") {
            window.sessionStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                ...session,
                status: "confirmed",
                receipt: confirmBody,
              })
            );
          }
          return;
        }

        if (result === 3) {
          if (cancelled) return;
          setPhase("pending");
          setMessage(
            payment?.["result-text"] || "Payment is still pending. We'll keep checking automatically."
          );
          pollTimeoutRef.current = window.setTimeout(confirmPayment, POLL_DELAY_MS);
          return;
        }

        if (cancelled) return;
        setPhase("failed");
        setMessage(payment?.["result-text"] || "Payment was not completed.");
      } catch (error) {
        if (cancelled) return;
        setPhase("failed");
        setMessage(error.message || "We couldn't confirm your payment.");
      }
    }

    confirmPayment();

    return () => {
      cancelled = true;
      if (pollTimeoutRef.current) {
        window.clearTimeout(pollTimeoutRef.current);
      }
    };
  }, [session]);

  return (
    <section className="bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4rem,10vh,7rem)]">
      <div className="mx-auto max-w-[720px] border border-hairline bg-cream p-12 text-center">
        <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">ExpressPay</span>
        <h1 className="mt-3 font-serif-display text-[1.6rem] font-medium text-ink">
          {phase === "success" ? "Payment Confirmed" : "Reservation Payment"}
        </h1>
        <p className="mt-3 text-[0.95rem] leading-[1.7] text-body">{message}</p>

        {(orderId || summary) && (
          <div className="mt-8 border border-hairline bg-white p-6 text-left">
            {orderId && (
              <p className="text-[0.82rem] text-body">
                <span className="font-semibold text-ink">Order ID:</span> {orderId}
              </p>
            )}
            {summary && (
              <p className="mt-2 text-[0.82rem] text-body">
                <span className="font-semibold text-ink">Stay:</span> {summary}
              </p>
            )}
            {receipt?.payment?.["transaction-id"] && (
              <p className="mt-2 text-[0.82rem] text-body">
                <span className="font-semibold text-ink">Transaction ID:</span> {receipt.payment["transaction-id"]}
              </p>
            )}
            {receipt?.payment?.payment_reference && (
              <p className="mt-2 text-[0.82rem] text-body">
                <span className="font-semibold text-ink">Reference:</span> {receipt.payment.payment_reference}
              </p>
            )}
          </div>
        )}

        {phase === "pending" && (
          <p className="mt-6 text-[0.82rem] text-body">
            Mobile money payments can take a little longer. Keep this page open while we keep checking.
          </p>
        )}

        {phase === "missing" && (
          <p className="mt-6 text-[0.82rem] text-body">
            Return to the booking page and start the payment again if you have not been charged.
          </p>
        )}

        {phase === "failed" && (
          <p className="mt-6 text-[0.82rem] text-body">
            If funds were deducted, please contact <a className="text-accent" href="mailto:integration@expresspaygh.com">integration@expresspaygh.com</a> and the hotel.
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/reservation"
            className="border border-ink px-5 py-3 font-mono-label text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Book Again
          </Link>
          <Link
            href="/"
            className="border border-ink bg-ink px-5 py-3 font-mono-label text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:border-accent hover:bg-accent"
          >
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}
