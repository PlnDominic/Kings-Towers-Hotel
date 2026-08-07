import Footer from "../components/Footer";
import Header from "../components/Header";
import Reservation from "../components/Reservation";

export const metadata = {
  title: "Book & Pay | Kings Towers Hotel & Conference Centre",
  description: "Book and pay for your stay at Kings Towers Hotel & Conference Centre with ExpressPay.",
};

function paramString(value) {
  return typeof value === "string" ? value : "";
}

function paramInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export default async function ReservationPage({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <Header transparentAtTop />
      <main className="bg-white">
        <Reservation
          initialCheckIn={paramString(params.checkIn)}
          initialCheckOut={paramString(params.checkOut)}
          initialRoomType={paramString(params.roomType)}
          initialAdults={paramInt(params.adults, 2)}
          initialChildren={paramInt(params.children, 0)}
          initialPromo={paramString(params.promo)}
        />
      </main>
      <Footer />
    </>
  );
}
