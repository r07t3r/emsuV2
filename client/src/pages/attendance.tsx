import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Check, X, Clock, CalendarCheck } from "lucide-react";

export default function Attendance() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getSidebarItems = () => [
    { icon: "home", label: "Dashboard", href: "/", active: false },
    { icon: "calendar-check", label: "Attendance", href: "/attendance", active: true },
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">
            {user?.role === "student" ? "Track your attendance record" : "Manage student attendance"}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="daily">Daily Record</TabsTrigger>
            {user?.role === "teacher" && <TabsTrigger value="take">Take Attendance</TabsTrigger>}
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Attendance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">92.3%</div>
                  <Progress value={92.3} className="mt-2 h-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Present Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-2xl font-bold">156</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Absent Days</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-600" />
                    <span className="text-2xl font-bold">13</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Late Arrivals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-2xl font-bold">7</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar View */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Attendance Calendar</CardTitle>
                  <CardDescription>Visual representation of attendance record</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      present: [new Date(2024, 0, 15), new Date(2024, 0, 16), new Date(2024, 0, 17)],
                      absent: [new Date(2024, 0, 18)],
                      late: [new Date(2024, 0, 19)],
                    }}
                    modifiersStyles={{
                      present: { backgroundColor: '#10b981', color: 'white' },
                      absent: { backgroundColor: '#ef4444', color: 'white' },
                      late: { backgroundColor: '#f59e0b', color: 'white' },
                    }}
                  />
                  <div className="flex gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Absent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>Late</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest attendance records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { date: "Today", status: "present", time: "8:45 AM" },
                    { date: "Yesterday", status: "present", time: "8:30 AM" },
                    { date: "Jan 25", status: "late", time: "9:15 AM" },
                    { date: "Jan 24", status: "present", time: "8:50 AM" },
                    { date: "Jan 23", status: "absent", time: "-" },
                  ].map((record, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {record.status === "present" && <Check className="h-4 w-4 text-green-600" />}
                        {record.status === "absent" && <X className="h-4 w-4 text-red-600" />}
                        {record.status === "late" && <Clock className="h-4 w-4 text-yellow-600" />}
                        <span className="text-sm">{record.date}</span>
                      </div>
                      <Badge variant={
                        record.status === "present" ? "default" : 
                        record.status === "late" ? "secondary" : "destructive"
                      }>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance Record</CardTitle>
                <CardDescription>Detailed daily attendance logs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Time Out</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: "2024-01-27", day: "Saturday", status: "present", timeIn: "8:45 AM", timeOut: "2:30 PM", remarks: "" },
                      { date: "2024-01-26", day: "Friday", status: "present", timeIn: "8:30 AM", timeOut: "2:30 PM", remarks: "" },
                      { date: "2024-01-25", day: "Thursday", status: "late", timeIn: "9:15 AM", timeOut: "2:30 PM", remarks: "Traffic delay" },
                      { date: "2024-01-24", day: "Wednesday", status: "present", timeIn: "8:50 AM", timeOut: "2:30 PM", remarks: "" },
                      { date: "2024-01-23", day: "Tuesday", status: "absent", timeIn: "-", timeOut: "-", remarks: "Sick leave" },
                    ].map((record, i) => (
                      <TableRow key={i}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.day}</TableCell>
                        <TableCell>
                          <Badge variant={
                            record.status === "present" ? "default" : 
                            record.status === "late" ? "secondary" : "destructive"
                          }>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.timeIn}</TableCell>
                        <TableCell>{record.timeOut}</TableCell>
                        <TableCell className="text-muted-foreground">{record.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {user?.role === "teacher" && (
            <TabsContent value="take">
              <Card>
                <CardHeader>
                  <CardTitle>Take Attendance</CardTitle>
                  <CardDescription>Mark student attendance for today's class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Button>
                      <CalendarCheck className="h-4 w-4 mr-2" />
                      Mark All Present
                    </Button>
                    <Button variant="outline">Save & Continue</Button>
                  </div>
                  <p className="text-muted-foreground">Attendance taking interface would be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>Generate and download attendance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">Weekly Report</Button>
                  <Button variant="outline">Monthly Report</Button>
                  <Button variant="outline">Term Report</Button>
                  <Button variant="outline">Custom Range</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}