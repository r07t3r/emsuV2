import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  TrendingDown, 
  BookOpen, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  Target,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Bell,
  MessageSquare,
  FileText,
  BarChart3
} from "lucide-react";

interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    class: string;
    rollNumber: string;
    profileImage: string;
  };
  academics: {
    overallGrade: number;
    rank: number;
    totalStudents: number;
    gpa: number;
    subjects: Array<{
      name: string;
      grade: number;
      teacher: string;
      lastTest: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  };
  attendance: {
    rate: number;
    presentDays: number;
    totalDays: number;
    lateArrivals: number;
  };
  assignments: {
    pending: number;
    completed: number;
    overdue: number;
    upcomingDeadlines: Array<{
      title: string;
      subject: string;
      dueDate: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  schedule: Array<{
    time: string;
    subject: string;
    teacher: string;
    room: string;
    type: 'class' | 'lab' | 'exam';
  }>;
  announcements: Array<{
    title: string;
    content: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
    from: string;
  }>;
  recentActivity: Array<{
    type: 'grade' | 'assignment' | 'attendance' | 'announcement';
    title: string;
    time: string;
    details: string;
  }>;
}

interface ComprehensiveStudentDashboardProps {
  data: StudentDashboardData;
}

export default function ComprehensiveStudentDashboard({ data }: ComprehensiveStudentDashboardProps) {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section with Student Info */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={data.student.profileImage} />
            <AvatarFallback className="text-lg font-semibold">
              {data.student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {data.student.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              {data.student.class} • Roll No: {data.student.rollNumber}
            </p>  
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">Rank #{data.academics.rank}/{data.academics.totalStudents}</Badge>
              <Badge variant="outline">GPA: {data.academics.gpa}</Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Calendar className="h-4 w-4 mr-2" />
            View Full Schedule
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overall Grade</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.academics.overallGrade}%</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>+2.5% from last term</span>
            </div>
            <Progress value={data.academics.overallGrade} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.attendance.rate}%</div>
            <div className="text-sm text-muted-foreground">
              {data.attendance.presentDays}/{data.attendance.totalDays} days
            </div>
            <Progress value={data.attendance.rate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.assignments.pending}</div>
            <div className="text-sm text-muted-foreground">
              {data.assignments.overdue > 0 && (
                <span className="text-red-600">{data.assignments.overdue} overdue</span>
              )}
            </div>
            <div className="mt-2">
              <Button variant="outline" size="sm" className="text-xs">
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Class Rank</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">#{data.academics.rank}</div>
            <div className="text-sm text-muted-foreground">
              Top {Math.round((data.academics.rank / data.academics.totalStudents) * 100)}% of class
            </div>
            <Progress 
              value={100 - ((data.academics.rank / data.academics.totalStudents) * 100)} 
              className="mt-2 h-2" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Academic Performance</CardTitle>
                <CardDescription>Subject-wise performance overview</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.academics.subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {subject.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {subject.teacher}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">{subject.grade}%</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        {subject.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                        {subject.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                        Last: {subject.lastTest}%
                      </div>
                    </div>
                    <div className="w-16">
                      <Progress value={subject.grade} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.schedule.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.subject}</div>
                    <div className="text-xs text-muted-foreground">{item.teacher}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <span>{item.time}</span>
                      <span>•</span>
                      <span>{item.room}</span>
                    </div>
                  </div>
                  <Badge variant={item.type === 'exam' ? 'destructive' : 'secondary'} className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-center">
                View Full Schedule <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.assignments.upcomingDeadlines.slice(0, 3).map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{deadline.title}</div>
                    <div className="text-xs text-muted-foreground">{deadline.subject}</div>
                    <div className="text-xs text-muted-foreground">{deadline.dueDate}</div>
                  </div>
                  <Badge variant={
                    deadline.priority === 'high' ? 'destructive' : 
                    deadline.priority === 'medium' ? 'secondary' : 'outline'
                  } className="text-xs">
                    {deadline.priority}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Announcements & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.announcements.slice(0, 3).map((announcement, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-sm">{announcement.title}</div>
                  <Badge variant={
                    announcement.priority === 'high' ? 'destructive' : 'secondary'
                  } className="text-xs">
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                <div className="text-xs text-muted-foreground">
                  From: {announcement.from} • {announcement.date}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  {activity.type === 'grade' && <Award className="h-4 w-4 text-white" />}
                  {activity.type === 'assignment' && <FileText className="h-4 w-4 text-white" />}
                  {activity.type === 'attendance' && <CheckCircle className="h-4 w-4 text-white" />}
                  {activity.type === 'announcement' && <Bell className="h-4 w-4 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.title}</div>
                  <div className="text-xs text-muted-foreground">{activity.details}</div>
                  <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              View Assignments
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Check Schedule
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}