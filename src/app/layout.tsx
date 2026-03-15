import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/chatbot/Chatbot";
import NotificationManager from "@/components/NotificationManager";

export const metadata: Metadata = {
  title: "Caritas Catholic Chaplaincy | Caritas University",
  description: "The digital spiritual home of Caritas Catholic Chaplaincy, Caritas University Amorji-Nike, Enugu. Book Mass, join societies, submit petitions, and explore Catholic doctrine.",
  keywords: "Caritas University, Catholic Chaplaincy, Enugu, Fr Edeh, Mass Intentions, Jesus the Saviour",
  openGraph: {
    title: "Caritas Catholic Chaplaincy",
    description: "A Home of Prayer, Worship and Service",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#8B0000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="font-garamond">
        <NotificationManager />
        <Toaster position="top-center" toastOptions={{
          style: { fontFamily: "'EB Garamond', serif", fontSize: "1rem" },
          success: { iconTheme: { primary: "#D4AF37", secondary: "#fff" } },
        }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
