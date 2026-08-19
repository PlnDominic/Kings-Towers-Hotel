import Link from "next/link";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { queryPayment, decodeRef } from "@/lib/expresspay";
import { sendPaymentConfirmation } from "@/lib/paymentMail";

export const metadata = {
  title: "Payment Result | Kings Towers Hotel & Conference Centre",
};

function paramString(value) {
  return typeof value === "string" ? value : "";
}

// expressPay redirects the guest's browser back here after checkout, but
// the redirect itself is never trusted — we always re-check with the
// Query API, which is the only authoritative source for whether money
// actually moved. `ref` (see lib/expresspay.js) carries the booking
// details back round-trip since this app keeps no database.
async function resolvePayment(token, refParam) {
  const bookingRef = decodeRef(refParam);
  if (!token || !bookingRef) {
    return { state: "error", message: "We couldn't find your payment details." };
  }

  let query;
  try {
    query = await queryPayment(token);
  } catch (err) {
    console.error("[payment] result page: query failed", err);
    return {
      state: "error",
      message: "We couldn't confirm your payment right now. Please contact us to check your booking.",
    };
  }

  if (query.result === 1) {
    try {
      await sendPaymentConfirmation(bookingRef, query);
    } catch (err) {
      console.error("[payment] result page: failed to send confirmation email", err);
    }
    return { state: "approved", bookingRef, query };
  }

  if (query.result === 4) {
    return { state: "pending", bookingRef, query };
  }

  return { state: "declined", bookingRef, query };
}

export default async function PaymentResultPage({ searchParams }) {
  const params = await searchParams;
  const result = await resolvePayment(paramString(params.token), paramString(params.ref));

  return (
    <>
      <Header />
      <main className="bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4rem,10vh,7rem)]">
        <div className="mx-auto max-w-[640px] border border-hairline bg-cream p-12 text-center">
          {result.state === "approved" && (
            <>
              <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">
                Confirmed
              </span>
              <p className="mt-3 font-serif-display text-[1.4rem] font-medium text-ink">
                Thank you — your deposit is confirmed.
              </p>
              <p className="mt-3 text-[0.92rem] text-body">
                We&#39;ve emailed a receipt to {result.bookingRef.email}. The balance is payable at check-in — we
                look forward to welcoming you.
              </p>
            </>
          )}
          {result.state === "pending" && (
            <>
              <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">
                Processing
              </span>
              <p className="mt-3 font-serif-display text-[1.4rem] font-medium text-ink">
                Your payment is still processing.
              </p>
              <p className="mt-3 text-[0.92rem] text-body">
                Mobile money payments can take a few minutes to confirm. We&#39;ll email you as soon as it clears —
                no need to pay again or refresh this page.
              </p>
            </>
          )}
          {result.state === "declined" && (
            <>
              <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">
                Not completed
              </span>
              <p className="mt-3 font-serif-display text-[1.4rem] font-medium text-ink">
                Your payment wasn&#39;t completed.
              </p>
              <p className="mt-3 text-[0.92rem] text-body">
                {result.query?.["result-text"] || "The transaction was declined or cancelled."} No deposit was
                taken — please try again, or call us to book by phone.
              </p>
            </>
          )}
          {result.state === "error" && (
            <>
              <span className="font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">
                Something went wrong
              </span>
              <p className="mt-3 font-serif-display text-[1.4rem] font-medium text-ink">
                We couldn&#39;t confirm your payment.
              </p>
              <p className="mt-3 text-[0.92rem] text-body">
                {result.message} If you were charged, please contact us and we&#39;ll sort it out.
              </p>
            </>
          )}
          <Link
            href="/"
            className="mt-8 inline-block font-mono-label text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent underline"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
