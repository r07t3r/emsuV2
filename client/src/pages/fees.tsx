import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function Fees() {
  const { user } = useAuth();

  const getSidebarItems = () => [
    { icon: "home", label: "Dashboard", href: "/", active: false },
    { icon: "credit-card", label: "Fees", href: "/fees", active: true },
  ];

  return (
    <DashboardLayout
      user={user!}
      sidebarItems={getSidebarItems()}
      academicInfo={{
        term: "First Term",
        session: "2023/2024",
      }}
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold">Fees</h1>
        <p>Fee management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
}