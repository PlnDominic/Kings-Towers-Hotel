import Image from "next/image";
import Link from "next/link";
import { rooms } from "../data";
import { SerifHeading } from "./ui";

function RoomCard({ room }) {
  return (
    <Link
      href={`/reservation?roomType=${room.id}`}
      className="group relative block aspect-[4/3] overflow-hidden no-underline"
    >
      {room.img ? (
        <Image
          src={room.img}
          alt={room.alt}
          fill
          sizes="(max-width: 560px) 100vw, (max-width: 1180px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#ded9d0] text-center text-body">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-[0.78rem]">Photo coming soon</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-black/45 px-4 py-3">
        <span className="font-serif-display text-[1.05rem] font-medium text-white">{room.title}</span>
        <span className="whitespace-nowrap bg-accent px-3 py-1.5 text-[0.8rem] font-semibold text-white">
          From GHS {room.price}
        </span>
      </div>
    </Link>
  );
}

export default function Rooms() {
  return (
    <section id="room-types" className="scroll-mt-20 bg-white px-[clamp(1.25rem,5vw,5.5rem)] py-[clamp(4.5rem,12vh,9rem)]">
      <SerifHeading>Our Rooms</SerifHeading>
      <div className="mx-auto mt-12 grid max-w-[1240px] grid-cols-1 gap-6 min-[561px]:grid-cols-2 min-[1181px]:grid-cols-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}
