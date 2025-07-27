import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Calendar, Clock, Plus, Download } from "lucide-react";

export default function Assignments() {
  const { user } = useAuth();

  const getSidebarItems = () => [
    { icon: "home", label: "Dashboard", href: "/", active: false },
    { icon: "tasks", label: "Assignments", href: "/assignments", active: true },
    { icon: "book", label: "Classes", href: "/classes", active: false },
    { icon: "chart-line", label: "Grades", href: "/grades", active: false },
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground">
              {user?.role === "student" ? "Track your assignments and submissions" : "Manage class assignments"}
            </p>
          </div>
          {user?.role === "teacher" && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          )}
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Assignment Cards */}
              <div className="lg:col-span-2 space-y-4">
                {[
                  {
                    title: "Mathematics Problem Set 3",
                    subject: "Mathematics",
                    dueDate: "Jan 30, 2024",
                    timeLeft: "3 days",
                    status: "pending",
                    description: "Solve quadratic equations and graphing problems",
                    points: 100,
                  },
                  {
                    title: "English Essay: Climate Change",
                    subject: "English",
                    dueDate: "Feb 2, 2024",
                    timeLeft: "6 days",
                    status: "pending",
                    description: "Write a 1000-word essay on climate change impacts",
                    points: 150,
                  },
                  {
                    title: "Physics Lab Report",
                    subject: "Physics",
                    dueDate: "Jan 28, 2024",
                    timeLeft: "1 day",
                    status: "urgent",
                    description: "Complete lab report on pendulum experiment",
                    points: 75,
                  },
                ].map((assignment, i) => (
                  <Card key={i} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.subject}</CardDescription>
                        </div>
                        <Badge variant={assignment.status === "urgent" ? "destructive" : "secondary"}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Due: {assignment.dueDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{assignment.timeLeft} left</span>
                          </div>
                          <div className="font-medium">{assignment.points} points</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm">Submit</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Assignment Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active</span>
                      <Badge>3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completed</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overdue</span>
                      <Badge variant="destructive">1</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Grade Average</span>
                      <Badge variant="outline">85%</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Templates
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Assignment Guidelines
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Calendar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Assignments</CardTitle>
                <CardDescription>Your submitted assignments and grades</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { assignment: "Math Problem Set 2", subject: "Mathematics", submitted: "Jan 20, 2024", grade: "92%", feedback: "Excellent work" },
                      { assignment: "History Essay", subject: "History", submitted: "Jan 18, 2024", grade: "88%", feedback: "Good analysis" },
                      { assignment: "Chemistry Lab", subject: "Chemistry", submitted: "Jan 15, 2024", grade: "95%", feedback: "Outstanding" },
                    ].map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{row.assignment}</TableCell>
                        <TableCell>{row.subject}</TableCell>
                        <TableCell>{row.submitted}</TableCell>
                        <TableCell>
                          <Badge variant="default">{row.grade}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{row.feedback}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overdue">
            <Card>
              <CardHeader>
                <CardTitle>Overdue Assignments</CardTitle>
                <CardDescription>Assignments past their due date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No overdue assignments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}