import About from "./components/About";
import Amenities from "./components/Amenities";
import Footer from "./components/Footer";
import Gallery from "./components/Gallery";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Leisure from "./components/Leisure";
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
      <Leisure />
      <PoolBar />
      <Gallery />
      <LocationMap />
      <Footer />
    </>
  );
}
