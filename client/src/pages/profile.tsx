import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { User, Camera, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    bio: "",
  });

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PUT", "/api/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      address: "",
      bio: "",
    });
    setIsEditing(false);
  };

  const getSidebarItems = () => {
    const baseItems = [
      { icon: "home", label: "Dashboard", href: "/", active: false },
      { icon: "user", label: "Profile", href: "/profile", active: true },
    ];

    switch (user?.role) {
      case "student":
        return [
          ...baseItems,
          { icon: "book", label: "My Classes", href: "/classes", active: false },
          { icon: "chart-line", label: "Grades", href: "/grades", active: false },
          { icon: "calendar-check", label: "Attendance", href: "/attendance", active: false },
          { icon: "tasks", label: "Assignments", href: "/assignments", active: false },
          { icon: "messages", label: "Messages", href: "/messages", active: false },
          { icon: "credit-card", label: "Fees", href: "/fees", active: false },
        ];
      case "teacher":
        return [
          ...baseItems,
          { icon: "users", label: "My Classes", href: "/classes", active: false },
          { icon: "book-open", label: "Subjects", href: "/subjects", active: false },
          { icon: "chart-line", label: "Grades", href: "/grades", active: false },
          { icon: "calendar-check", label: "Attendance", href: "/attendance", active: false },
          { icon: "tasks", label: "Assignments", href: "/assignments", active: false },
          { icon: "messages", label: "Messages", href: "/messages", active: false },
        ];
      case "principal":
      case "proprietor":
        return [
          ...baseItems,
          { icon: "users", label: "Students", href: "/students", active: false },
          { icon: "user-check", label: "Teachers", href: "/teachers", active: false },
          { icon: "building", label: "Classes", href: "/classes", active: false },
          { icon: "bar-chart", label: "Reports", href: "/reports", active: false },
          { icon: "settings", label: "Settings", href: "/settings", active: false },
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={updateProfileMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your avatar and basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.profileImageUrl} />
                      <AvatarFallback className="text-lg">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {new Date(user?.createdAt || "").toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>ID: {user?.id?.slice(-8)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={isEditing ? editData.firstName : user?.firstName || ""}
                      onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={isEditing ? editData.lastName : user?.lastName || ""}
                      onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isEditing ? editData.email : user?.email || ""}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={editData.address}
                    onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Two-Factor Authentication</Button>
                <Button variant="outline">Privacy Settings</Button>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}