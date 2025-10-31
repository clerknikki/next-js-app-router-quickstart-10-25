import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <OrganizationProfile />
    </div>
  );
}
