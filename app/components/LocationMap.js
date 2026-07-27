export default function LocationMap() {
  return (
    <section className="relative h-[420px] w-full overflow-hidden border-t border-hairline min-[880px]:h-[480px]">
      <iframe
        title="Map to Kings Towers Hotel, Ahensan Estate, Kumasi"
        src="https://www.google.com/maps?q=Ahensan+Estate,+Kumasi,+Ghana&output=embed"
        width="100%"
        height="100%"
        className="block border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}
