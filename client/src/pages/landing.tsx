import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  
  const handleLogin = () => {
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 text-white items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <GraduationCap className="text-4xl text-primary" size={48} />
            </div>
            <h1 className="text-4xl font-bold mb-2">E.M.S.U</h1>
            <p className="text-primary-foreground/80 text-lg">Educational Management System United</p>
          </div>
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>Comprehensive School Management</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>Real-time Analytics & Reports</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>Multi-Role Access Control</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={20} />
              <span>Mobile-First Design</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="text-2xl text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">E.M.S.U</h1>
            <p className="text-muted-foreground">Educational Management System</p>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Welcome Back</h2>
              
              <div className="space-y-6">
                <p className="text-muted-foreground text-center">
                  Click below to sign in with your school credentials
                </p>

                <Button 
                  onClick={handleLogin}
                  className="w-full py-3 text-white font-medium"
                  size="lg"
                >
                  Sign In
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-center text-sm text-muted-foreground">
                  Need an account? <span className="text-primary font-medium">Contact your school administrator</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
