import GustSidebar from "../../components/Sidebar";

export default function ReceptionistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <GustSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
