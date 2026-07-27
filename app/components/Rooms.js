import Image from "next/image";
import { rooms } from "../data";

function RoomCard({ room }) {
  return (
    <div className="border border-hairline bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        {room.img ? (
          <Image src={room.img} alt={room.alt} fill sizes="(max-width: 560px) 100vw, (max-width: 1180px) 50vw, 25vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-cream text-center text-muted">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span className="text-[0.78rem]">Photo coming soon</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="m-0 font-display text-[1.05rem] font-bold tracking-[0.01em]">{room.title}</h3>
          <span className="whitespace-nowrap font-display text-[0.95rem] font-bold text-accent">
            GHS {room.price}
            <span className="text-[0.7rem] font-normal text-muted">/night</span>
          </span>
        </div>
        <p className="mt-[0.6rem] text-[0.9rem] leading-[1.6] text-body">{room.desc}</p>
        <p className="mt-[0.9rem] text-[0.76rem] leading-[1.6] tracking-[0.03em] text-muted">{room.features}</p>
        <a
          href="#reservation"
          className="mt-[1.1rem] inline-block text-[0.82rem] font-semibold text-accent underline transition-colors duration-200 hover:text-accent-hover"
        >
          Reserve this room
        </a>
      </div>
    </div>
  );
}

export default function Rooms() {
  return (
    <section
      id="room-types"
      className="scroll-mt-20 bg-white px-[clamp(1.25rem,5vw,5.5rem)] pt-[clamp(4.5rem,12vh,9rem)] pb-[clamp(3.5rem,9vh,7rem)]"
    >
      <div className="mb-[clamp(2.5rem,5vh,4rem)] flex flex-wrap items-end justify-between gap-8">
        <div>
          <span className="mb-[0.9rem] block font-mono-label text-[0.72rem] uppercase tracking-[0.22em] text-muted">
            Accommodation
          </span>
          <h2 className="m-0 font-display text-[clamp(1.5rem,3vw,2.1rem)] uppercase tracking-[0.04em]">
            Guest Rooms
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-[clamp(1.5rem,2.2vw,2.25rem)] min-[561px]:grid-cols-2 min-[1181px]:grid-cols-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}
