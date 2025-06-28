import Navbar from "./Navbar";
import { ReactNode } from "react";

export default function GuestLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
      <footer className="bg-white border-t text-center py-4 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} HotelSys. All rights reserved.
      </footer>
    </>
  );
}
