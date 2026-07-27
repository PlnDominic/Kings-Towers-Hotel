import { Assistant, Merriweather_Sans, Anonymous_Pro } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const merriweatherSans = Merriweather_Sans({
  variable: "--font-merriweather-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const anonymousPro = Anonymous_Pro({
  variable: "--font-anonymous-pro",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Kings Towers Hotel & Conference Centre | Ahensan Estate, Kumasi",
  description:
    "A serene, scenic retreat in Ahensan Estate, Kumasi. Guest rooms, poolside leisure, and dining at Kings Towers Hotel & Conference Centre.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${assistant.variable} ${merriweatherSans.variable} ${anonymousPro.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
