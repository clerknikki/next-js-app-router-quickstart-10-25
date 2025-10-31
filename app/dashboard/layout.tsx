import { OrganizationSwitcher } from "@clerk/nextjs";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <OrganizationSwitcher
          appearance={{
            elements: {
              rootBox: "text-white",
            },
          }}
        />
      </header>

      <main className="p-6">{children}</main>
    </div>
  );
}
