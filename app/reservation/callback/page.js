"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ctaBase, CtaArrow } from "../../components/ui";
import { rooms } from "../../data";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [txDetails, setTxDetails] = useState(null);

  // Retrieve all parameters
  const token = searchParams.get("token");
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const roomType = searchParams.get("roomType") || "";
  const guests = searchParams.get("guests") || "";
  const nights = searchParams.get("nights") || "0";
  const estimatedTotal = searchParams.get("estimatedTotal") || "0";
  const message = searchParams.get("message") || "";
  const promo = searchParams.get("promo") || "";
  const orderId = searchParams.get("orderId") || "";

  const selectedRoom = rooms.find((r) => r.id === roomType) || null;

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Transaction token is missing from the callback parameters.");
      return;
    }

    let isMounted = true;

    async function verifyPayment() {
      try {
        const response = await fetch("/api/reservation/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            name,
            email,
            phone,
            checkIn,
            checkOut,
            roomType,
            guests,
            nights,
            estimatedTotal,
            message,
            promo,
            orderId,
          }),
        });

        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && data.ok) {
          setStatus("success");
          setTxDetails(data);
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Payment verification failed. Please contact support.");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Verification error:", err);
        setStatus("error");
        setErrorMsg("An unexpected error occurred while verifying your payment.");
      }
    }

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [token, name, email, phone, checkIn, checkOut, roomType, guests, nights, estimatedTotal, message, promo, orderId]);

  if (status === "verifying") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        <h2 className="mt-6 font-serif-display text-2xl font-semibold text-ink">Verifying Payment...</h2>
        <p className="mt-2 max-w-md text-sm text-body">
          Please do not close this window or navigate away. We are confirming your transaction status with ExpressPay.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-xl border border-hairline bg-cream p-8 md:p-12 text-center my-12 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="mt-6 font-serif-display text-2xl font-medium text-ink">Payment Verification Failed</h2>
        <p className="mt-4 text-sm text-body leading-relaxed">{errorMsg}</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => router.push("/reservation")}
            className={`${ctaBase} px-6 py-3 text-sm`}
          >
            Try Reservation Again
            <CtaArrow />
          </button>
          <a
            href="mailto:integration@expresspaygh.com"
            className="inline-flex items-center justify-center px-6 py-3 border border-hairline bg-white font-semibold text-ink hover:bg-gray-50 text-sm no-underline"
          >
            Contact ExpressPay Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl border border-hairline bg-cream my-12 shadow-md overflow-hidden">
      {/* Header Banner */}
      <div className="bg-near-black text-white p-6 md:p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/10 opacity-30 pointer-events-none"></div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-mono-label text-[0.65rem] uppercase tracking-[0.22em] text-accent-soft font-bold">
          Reservation Confirmed
        </span>
        <h2 className="mt-2 font-serif-display text-2xl md:text-3xl font-medium">Thank You for Your Payment!</h2>
        <p className="mt-2 text-xs md:text-sm text-white/70">
          Your room has been booked and a confirmation email has been sent to <span className="text-white font-semibold">{email}</span>.
        </p>
      </div>

      {/* Details Section */}
      <div className="p-6 md:p-10 space-y-8 bg-white">
        {/* Reservation Receipt Details */}
        <div>
          <h3 className="font-mono-label text-xs uppercase tracking-wider text-muted border-b border-hairline pb-2 mb-4">
            Payment details
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-body">Transaction Status:</span>
            <span className="font-semibold text-emerald-600 text-right">Paid</span>
            
            <span className="text-body">Transaction ID:</span>
            <span className="font-mono text-xs text-ink text-right">{txDetails?.transactionId || "N/A"}</span>
            
            <span className="text-body">Order ID:</span>
            <span className="font-mono text-xs text-ink text-right">{txDetails?.orderId || "N/A"}</span>
            
            <span className="text-body font-semibold">Total Charged:</span>
            <span className="font-serif-display text-lg font-bold text-accent text-right">
              {txDetails?.currency || "GHS"} {txDetails?.amount || estimatedTotal}
            </span>
          </div>
        </div>

        {/* Guest Details */}
        <div>
          <h3 className="font-mono-label text-xs uppercase tracking-wider text-muted border-b border-hairline pb-2 mb-4">
            Guest Information
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-body">Full Name:</span>
            <span className="text-ink font-medium text-right">{name}</span>
            
            <span className="text-body">Email Address:</span>
            <span className="text-ink text-right">{email}</span>
            
            <span className="text-body">Phone Number:</span>
            <span className="text-ink text-right">{phone}</span>
          </div>
        </div>

        {/* Room & Stay Details */}
        <div>
          <h3 className="font-mono-label text-xs uppercase tracking-wider text-muted border-b border-hairline pb-2 mb-4">
            Stay Details
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-body">Room Type:</span>
            <span className="text-ink font-semibold text-right">{selectedRoom?.title || roomType}</span>
            
            <span className="text-body">Check-in:</span>
            <span className="text-ink text-right">{checkIn}</span>
            
            <span className="text-body">Check-out:</span>
            <span className="text-ink text-right">{checkOut}</span>
            
            <span className="text-body">Number of Nights:</span>
            <span className="text-ink text-right">{nights} night{Number(nights) > 1 ? "s" : ""}</span>
            
            <span className="text-body">Guests:</span>
            <span className="text-ink text-right">{guests}</span>
            
            {promo && (
              <>
                <span className="text-body">Promo Code:</span>
                <span className="text-ink text-right font-mono">{promo}</span>
              </>
            )}

            {message && (
              <div className="col-span-2 mt-2 pt-2 border-t border-dashed border-hairline">
                <span className="text-body block mb-1">Special Message:</span>
                <span className="text-ink text-xs italic bg-cream p-3 block rounded-sm border border-hairline/50">
                  &ldquo;{message}&rdquo;
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-hairline flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-xs font-mono-label uppercase tracking-widest text-muted hover:text-accent transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
          
          <button
            onClick={() => router.push("/")}
            className={`${ctaBase} px-8 py-3 text-sm`}
          >
            Return to Homepage
            <CtaArrow />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReservationCallbackPage() {
  return (
    <>
      <Header />
      <main className="bg-cream min-h-[85vh] py-8 px-4 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
              <h2 className="mt-6 font-serif-display text-2xl font-semibold text-ink">Loading Details...</h2>
            </div>
          }
        >
          <CallbackContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
