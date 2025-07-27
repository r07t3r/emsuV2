import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Advanced3DLayout, Enhanced3DCard, Floating3DButton } from '@/components/3d/advanced-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  DollarSign, 
  Plus, 
  Settings, 
  BarChart3,
  MessageSquare,
  Bell,
  School,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

export default function EnhancedProprietorDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateSchoolOpen, setIsCreateSchoolOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  // Fetch proprietor's schools
  const { data: schools = [], isLoading: schoolsLoading } = useQuery({
    queryKey: ['/api/proprietor/schools'],
    queryFn: () => apiRequest('/api/proprietor/schools')
  });

  // Fetch dashboard analytics
  const { data: analytics = {} } = useQuery({
    queryKey: ['/api/proprietor/analytics'],
    queryFn: () => apiRequest('/api/proprietor/analytics')
  });

  // School creation mutation
  const createSchoolMutation = useMutation({
    mutationFn: (schoolData: any) => apiRequest('/api/proprietor/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schoolData)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/proprietor/schools'] });
      setIsCreateSchoolOpen(false);
      toast({
        title: "School Created Successfully!",
        description: "Your new school has been added to your network.",
      });
    },
    onError: () => {
      toast({
        title: "Error Creating School",
        description: "There was an issue creating the school. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const schoolData = {
      name: formData.get('name'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      type: formData.get('type'),
      description: formData.get('description'),
    };
    createSchoolMutation.mutate(schoolData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      {/* Enhanced Header with 3D Effects */}
      <Advanced3DLayout variant="holographic" className="mb-8">
        <div className="flex items-center justify-between p-6 bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-2xl border border-white/20">
          <div>
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Proprietor Command Center
            </motion.h1>
            <motion.p 
              className="text-gray-600 dark:text-gray-300 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Manage your educational empire with advanced 3D analytics
            </motion.p>
          </div>
          
          <div className="flex items-center gap-4">
            <Floating3DButton
              onClick={() => setIsCreateSchoolOpen(true)}
              variant="primary"
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New School
            </Floating3DButton>
            
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="icon" className="bg-white/20 border-white/30">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.div>
          </div>
        </div>
      </Advanced3DLayout>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Enhanced3DCard glowColor="blue">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Schools</p>
              <p className="text-3xl font-bold text-blue-600">{schools.length}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +2 this month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Enhanced3DCard>

        <Enhanced3DCard glowColor="green">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-3xl font-bold text-green-600">{analytics.totalStudents || 0}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +12% growth
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Enhanced3DCard>

        <Enhanced3DCard glowColor="purple">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Teachers</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.totalTeachers || 0}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +8% this quarter
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Enhanced3DCard>

        <Enhanced3DCard glowColor="orange">
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-3xl font-bold text-orange-600">₦{analytics.totalRevenue || '0'}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +15% increase
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Enhanced3DCard>
      </div>

      {/* Schools Grid with Advanced 3D Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {schools.map((school: any, index: number) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Enhanced3DCard glowColor="blue" className="group cursor-pointer">
                <div className="p-6 space-y-4">
                  {/* School Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <School className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {school.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span>4.8 Rating</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* School Details */}
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{school.address || 'Address not set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{school.phone || 'Phone not set'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{school.email || 'Email not set'}</span>
                    </div>
                  </div>

                  {/* School Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600">{school.studentCount || 0}</p>
                      <p className="text-xs text-gray-500">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-600">{school.teacherCount || 0}</p>
                      <p className="text-xs text-gray-500">Teachers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">{school.classCount || 0}</p>
                      <p className="text-xs text-gray-500">Classes</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedSchool(school)}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Enhanced3DCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create School Dialog */}
      <Dialog open={isCreateSchoolOpen} onOpenChange={setIsCreateSchoolOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Create New School
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateSchool} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">School Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Sunshine Academy"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">School Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="secondary">Secondary School</SelectItem>
                    <SelectItem value="combined">Combined (Primary & Secondary)</SelectItem>
                    <SelectItem value="nursery">Nursery School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">School Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Full address of the school"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+234 xxx xxx xxxx"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">School Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="info@school.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">School Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the school, its mission, and vision"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateSchoolOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createSchoolMutation.isPending}
                className="flex-1"
              >
                {createSchoolMutation.isPending ? 'Creating...' : 'Create School'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Recent Activity Section */}
      <Advanced3DLayout variant="depth" className="mt-8">
        <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity Across Schools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-lg"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New student enrollment at Sunshine Academy</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Advanced3DLayout>
    </div>
  );
}