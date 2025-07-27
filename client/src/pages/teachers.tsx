import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function Teachers() {
  const { user } = useAuth();

  const getSidebarItems = () => [
    { icon: "home", label: "Dashboard", href: "/", active: false },
    { icon: "user-check", label: "Teachers", href: "/teachers", active: true },
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
        <h1 className="text-3xl font-bold">Teachers</h1>
        <p>Teacher management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
}