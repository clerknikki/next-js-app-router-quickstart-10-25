"use client";

import { useAuth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { userId, orgId } = useAuth();

  return (
    <div>
      <h2 className="text-xl mb-2">Welcome to your Dashboard</h2>
      <pre className="bg-gray-800 p-4 rounded">
        {JSON.stringify({ userId, orgId }, null, 2)}
      </pre>
    </div>
  );
}
