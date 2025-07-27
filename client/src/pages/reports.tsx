import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function Reports() {
  const { user } = useAuth();

  const getSidebarItems = () => [
    { icon: "home", label: "Dashboard", href: "/", active: false },
    { icon: "bar-chart", label: "Reports", href: "/reports", active: true },
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
        <h1 className="text-3xl font-bold">Reports</h1>
        <p>Reporting functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
}