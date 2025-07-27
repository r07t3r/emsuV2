import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, Calendar } from "lucide-react";

export default function Classes() {
  const { user } = useAuth();
  
  const { data: classesData, isLoading } = useQuery({
    queryKey: ["/api/classes"],
    enabled: !!user,
  });

  const getSidebarItems = () => {
    const baseItems = [
      { icon: "home", label: "Dashboard", href: "/", active: false },
      { icon: "book", label: "Classes", href: "/classes", active: true },
    ];

    switch (user?.role) {
      case "student":
        return [
          ...baseItems,
          { icon: "chart-line", label: "Grades", href: "/grades", active: false },
          { icon: "calendar-check", label: "Attendance", href: "/attendance", active: false },
          { icon: "tasks", label: "Assignments", href: "/assignments", active: false },
        ];
      case "teacher":
        return [
          ...baseItems,
          { icon: "users", label: "Students", href: "/students", active: false },
          { icon: "chart-line", label: "Grades", href: "/grades", active: false },
          { icon: "calendar-check", label: "Attendance", href: "/attendance", active: false },
        ];
      default:
        return baseItems;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
            <p className="text-muted-foreground">
              {user?.role === "student" ? "Your enrolled classes" : "Classes you're teaching"}
            </p>
          </div>
          {user?.role === "teacher" && (
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample class cards */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Mathematics {i}</CardTitle>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <CardDescription>Advanced Mathematics for Senior Students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>32 students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Mon, Wed, Fri - 9:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Room 301</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}