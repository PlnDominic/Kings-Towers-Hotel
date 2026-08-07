import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import ReservationComplete from "@/app/components/ReservationComplete";

export const metadata = {
  title: "Reservation Payment | Kings Towers Hotel & Conference Centre",
  description: "Confirm your ExpressPay reservation payment for Kings Towers Hotel & Conference Centre.",
};

function paramString(value) {
  return typeof value === "string" ? value : "";
}

export default async function ReservationCompletePage({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <Header transparentAtTop />
      <main className="bg-white">
        <ReservationComplete orderId={paramString(params.orderId)} />
      </main>
      <Footer />
    </>
  );
}
