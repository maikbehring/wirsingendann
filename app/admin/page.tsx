import type { Metadata } from "next";
import { AdminPanel } from "@/components/AdminPanel";

export const metadata: Metadata = {
  title: "Admin — wirsingendann.de",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="gradient-maschinenraum min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <p className="mb-6 text-center text-xs uppercase tracking-widest text-[#8b949e]">
          Admin · wirsingendann.de
        </p>
        <AdminPanel />
      </div>
    </div>
  );
}
