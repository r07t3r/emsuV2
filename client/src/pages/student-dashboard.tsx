import { User } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import RecentGrades from "@/components/dashboard/recent-grades";
import Schedule from "@/components/dashboard/schedule";
import ActivityFeed from "@/components/dashboard/activity-feed";
import Announcements from "@/components/dashboard/announcements";
import { Book, TrendingUp, Clock, Calendar } from "lucide-react";

interface StudentDashboardProps {
  user: User;
  data: any;
}

export default function StudentDashboard({ user, data }: StudentDashboardProps) {
  const sidebarItems = [
    { icon: "home", label: "Dashboard", href: "/", active: true },
    { icon: "users", label: "My Classes", href: "/classes" },
    { icon: "chart-line", label: "Grades", href: "/grades" },
    { icon: "calendar-check", label: "Attendance", href: "/attendance" },
    { icon: "tasks", label: "Assignments", href: "/assignments" },
    { icon: "comments", label: "Messages", href: "/messages" },
    { icon: "credit-card", label: "Fees", href: "/fees" },
  ];

  // Calculate stats from data
  const totalSubjects = data.subjects?.length || 6;
  const averageGrade = data.grades?.length > 0 
    ? (data.grades.reduce((sum: number, grade: any) => sum + parseFloat(grade.score || 0), 0) / data.grades.length).toFixed(1)
    : "85.2";
  const pendingAssignments = data.assignments?.filter((a: any) => !a.submitted).length || 3;
  const attendanceRate = data.attendance?.length > 0
    ? Math.round((data.attendance.filter((a: any) => a.status === 'present').length / data.attendance.length) * 100)
    : 92;

  return (
    <DashboardLayout 
      user={user} 
      sidebarItems={sidebarItems}
      academicInfo={{
        term: "First Term",
        session: "2023/2024",
        class: data.student?.class?.name || "JSS 3A"
      }}
    >
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}! 👋
          </h2>
          <p className="text-muted-foreground">Here's what's happening with your studies today.</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Subjects"
            value={totalSubjects.toString()}
            icon={Book}
            trend="+2 this term"
            color="blue"
          />
          <StatsCard
            title="Average Grade"
            value={`${averageGrade}%`}
            icon={TrendingUp}
            trend="+2.1% from last term"
            color="green"
          />
          <StatsCard
            title="Pending Tasks"
            value={pendingAssignments.toString()}
            icon={Clock}
            trend="3 due this week"
            color="orange"
          />
          <StatsCard
            title="Attendance"
            value={`${attendanceRate}%`}
            icon={Calendar}
            trend="Excellent record"
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Grades */}
          <div className="lg:col-span-2">
            <RecentGrades data={data.grades || []} />
          </div>

          {/* Sidebar Content */}
          <div className="space-y-6">
            <Schedule data={data.schedule || []} />
            <Announcements data={data.announcements || []} />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-8">
          <ActivityFeed data={data.activities || []} />
        </div>
      </div>
    </DashboardLayout>
  );
}