import About from "./components/About";
import Amenities from "./components/Amenities";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LocationMap from "./components/LocationMap";
import PoolBar from "./components/PoolBar";
import Rooms from "./components/Rooms";

export default function Home() {
  return (
    <>
      <Header transparentAtTop />
      <Hero />
      <About />
      <Amenities />
      <Rooms />
      <PoolBar />
      <Gallery />
      <LocationMap />
      <Footer />
    </>
  );
}
