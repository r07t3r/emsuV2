import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth-page";
import Profile from "@/pages/profile";
import Classes from "@/pages/classes";
import Grades from "@/pages/grades";
import Attendance from "@/pages/attendance";
import Assignments from "@/pages/assignments";
import Messages from "@/pages/messages";
import Fees from "@/pages/fees";
import Students from "@/pages/students";
import Teachers from "@/pages/teachers";
import Subjects from "@/pages/subjects";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Calendar from "@/pages/calendar";
import Analytics from "@/pages/analytics";
import EnhancedProprietorDashboard from "@/pages/enhanced-proprietor-dashboard";

function Router() {
  const { user, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !user ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={AuthPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/classes" component={Classes} />
          <Route path="/grades" component={Grades} />
          <Route path="/attendance" component={Attendance} />
          <Route path="/assignments" component={Assignments} />
          <Route path="/messages" component={Messages} />
          <Route path="/fees" component={Fees} />
          <Route path="/students" component={Students} />
          <Route path="/teachers" component={Teachers} />
          <Route path="/subjects" component={Subjects} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={Settings} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/enhanced-proprietor" component={EnhancedProprietorDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
