import Footer from "../components/Footer";
import Header from "../components/Header";
import Reservation from "../components/Reservation";

export const metadata = {
  title: "Request a Booking | Kings Towers Hotel & Conference Centre",
  description: "Request a room reservation at Kings Towers Hotel & Conference Centre, Ahensan Estate, Kumasi.",
};

function paramString(value) {
  return typeof value === "string" ? value : "";
}

export default async function ReservationPage({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        <Reservation
          initialCheckIn={paramString(params.checkIn)}
          initialCheckOut={paramString(params.checkOut)}
          initialRoomType={paramString(params.roomType)}
        />
      </main>
      <Footer />
    </>
  );
}
