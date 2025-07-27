import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

export default function Grades() {
  const { user } = useAuth();

  const getSidebarItems = () => [
    { icon: "home", label: "Dashboard", href: "/", active: false },
    { icon: "chart-line", label: "Grades", href: "/grades", active: true },
    { icon: "book", label: "Classes", href: "/classes", active: false },
    { icon: "calendar-check", label: "Attendance", href: "/attendance", active: false },
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
          <h1 className="text-3xl font-bold text-foreground">Grades & Performance</h1>
          <p className="text-muted-foreground">Track your academic progress across all subjects</p>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Current Term</TabsTrigger>
            <TabsTrigger value="previous">Previous Terms</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Average</CardTitle>
                  <CardDescription>Current term performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">85.2%</div>
                  <div className="text-sm text-muted-foreground">+2.1% from last term</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Class Rank</CardTitle>
                  <CardDescription>Out of 45 students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">#7</div>
                  <div className="text-sm text-muted-foreground">Top 16% of class</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subjects Passed</CardTitle>
                  <CardDescription>Above 50% threshold</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">8/9</div>
                  <div className="text-sm text-muted-foreground">89% pass rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Subject Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Detailed breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Test 1</TableHead>
                      <TableHead>Test 2</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { subject: "Mathematics", test1: 78, test2: 82, assignment: 85, exam: 89, total: 84, grade: "B+" },
                      { subject: "English Language", test1: 92, test2: 88, assignment: 94, exam: 91, total: 91, grade: "A-" },
                      { subject: "Physics", test1: 75, test2: 79, assignment: 82, exam: 86, total: 81, grade: "B+" },
                      { subject: "Chemistry", test1: 88, test2: 85, assignment: 90, exam: 92, total: 89, grade: "A-" },
                      { subject: "Biology", test1: 83, test2: 87, assignment: 88, exam: 85, total: 86, grade: "B+" },
                      { subject: "Geography", test1: 79, test2: 76, assignment: 84, exam: 81, total: 80, grade: "B" },
                    ].map((row) => (
                      <TableRow key={row.subject}>
                        <TableCell className="font-medium">{row.subject}</TableCell>
                        <TableCell>{row.test1}%</TableCell>
                        <TableCell>{row.test2}%</TableCell>
                        <TableCell>{row.assignment}%</TableCell>
                        <TableCell>{row.exam}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{row.total}%</span>
                            <Progress value={row.total} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.total >= 85 ? "default" : row.total >= 70 ? "secondary" : "destructive"}>
                            {row.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="previous">
            <Card>
              <CardHeader>
                <CardTitle>Previous Terms Performance</CardTitle>
                <CardDescription>Historical academic records</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Previous term grades will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Academic Summary</CardTitle>
                <CardDescription>Overall performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Comprehensive academic summary will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}