import ReceptionistSidebar from "./sidbar";

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ReceptionistSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
