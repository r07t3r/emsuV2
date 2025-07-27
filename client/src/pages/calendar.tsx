import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function Calendar() {
  const { user } = useAuth();

  const getSidebarItems = () => [
    { icon: "home", label: "Dashboard", href: "/", active: false },
    { icon: "calendar", label: "Calendar", href: "/calendar", active: true },
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
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p>Calendar functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
}