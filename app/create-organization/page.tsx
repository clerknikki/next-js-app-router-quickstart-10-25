import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="flex justify-center p-6">
      <CreateOrganization />
    </div>
  );
}
