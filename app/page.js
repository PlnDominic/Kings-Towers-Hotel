import About from "./components/About";
import { BookingProvider } from "./components/BookingContext";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Leisure from "./components/Leisure";
import LocationMap from "./components/LocationMap";
import PoolBar from "./components/PoolBar";
import Reservation from "./components/Reservation";
import Rooms from "./components/Rooms";

export default function Home() {
  return (
    <BookingProvider>
      <Header />
      <Hero />
      <About />
      <Rooms />
      <Leisure />
      <PoolBar />
      <Gallery />
      <Contact />
      <Reservation />
      <LocationMap />
      <Footer />
    </BookingProvider>
  );
}
