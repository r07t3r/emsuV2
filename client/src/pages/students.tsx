import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function Students() {
  const { user } = useAuth();

  const getSidebarItems = () => [
    { icon: "home", label: "Dashboard", href: "/", active: false },
    { icon: "users", label: "Students", href: "/students", active: true },
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
        <h1 className="text-3xl font-bold">Students</h1>
        <p>Student management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
}