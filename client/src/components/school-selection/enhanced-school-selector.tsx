import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Advanced3DLayout, Enhanced3DCard, Floating3DButton } from '@/components/3d/advanced-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  School, 
  MapPin, 
  Users, 
  GraduationCap, 
  Search,
  CheckCircle,
  ArrowRight,
  Building2,
  Star,
  Calendar
} from 'lucide-react';

interface SchoolSelectorProps {
  userRole: string;
  onSchoolSelected?: (school: any) => void;
}

export function EnhancedSchoolSelector({ userRole, onSchoolSelected }: SchoolSelectorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<any>(null);

  // Fetch available schools
  const { data: schools = [], isLoading } = useQuery({
    queryKey: ['/api/schools/available'],
    queryFn: () => apiRequest('/api/schools/available')
  });

  // School selection mutation
  const selectSchoolMutation = useMutation({
    mutationFn: (schoolId: string) => apiRequest('/api/users/select-school', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId })
    }),
    onSuccess: (data, schoolId) => {
      const school = schools.find((s: any) => s.id === schoolId);
      toast({
        title: "School Selected Successfully!",
        description: `You have been enrolled in ${school?.name}`,
      });
      onSchoolSelected?.(school);
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: () => {
      toast({
        title: "Error Selecting School",
        description: "There was an issue selecting the school. Please try again.",
        variant: "destructive"
      });
    }
  });

  const filteredSchools = schools.filter((school: any) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSchool = (school: any) => {
    setSelectedSchool(school);
    selectSchoolMutation.mutate(school.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
        <Advanced3DLayout variant="holographic">
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading available schools...</p>
          </div>
        </Advanced3DLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      {/* Header */}
      <Advanced3DLayout variant="holographic" className="mb-8">
        <div className="text-center p-8 bg-white/10 dark:bg-black/10 backdrop-blur-xl rounded-2xl border border-white/20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <School className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Select Your School
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose from our network of educational institutions to begin your learning journey.
              {userRole === 'student' && " You'll gain access to classes, assignments, and academic resources."}
              {userRole === 'teacher' && " You'll be able to manage classes, students, and curriculum."}
              {userRole === 'parent' && " You'll be able to monitor your child's academic progress."}
            </p>
          </motion.div>
        </div>
      </Advanced3DLayout>

      {/* Search Bar */}
      <Advanced3DLayout variant="floating" className="mb-8">
        <Card className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search schools by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/20 border-white/30 text-lg py-3"
              />
            </div>
          </CardContent>
        </Card>
      </Advanced3DLayout>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredSchools.map((school: any, index: number) => (
            <motion.div
              key={school.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Enhanced3DCard 
                glowColor="blue" 
                className="group cursor-pointer h-full relative overflow-hidden"
              >
                <div className="p-6 space-y-4 h-full flex flex-col">
                  {/* School Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                          {school.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span>4.{Math.floor(Math.random() * 5) + 5} Rating</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Open
                    </Badge>
                  </div>

                  {/* School Details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{school.address || 'Address not available'}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">
                          {Math.floor(Math.random() * 1000) + 200}+
                        </p>
                        <p className="text-xs text-gray-500">Students</p>
                      </div>
                      
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-sm font-semibold text-purple-800 dark:text-purple-400">
                          {Math.floor(Math.random() * 50) + 20}+
                        </p>
                        <p className="text-xs text-gray-500">Teachers</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>Academic Year 2024/2025</span>
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Floating3DButton
                      onClick={() => handleSelectSchool(school)}
                      disabled={selectSchoolMutation.isPending}
                      variant="primary"
                      className="w-full justify-center"
                    >
                      {selectSchoolMutation.isPending && selectedSchool?.id === school.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enrolling...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Select School
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Floating3DButton>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </Enhanced3DCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Schools Found */}
      {filteredSchools.length === 0 && !isLoading && (
        <Advanced3DLayout variant="holographic" className="mt-12">
          <div className="text-center p-12">
            <School className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No Schools Found
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? `No schools match your search for "${searchQuery}"`
                : "There are no schools available at the moment"
              }
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        </Advanced3DLayout>
      )}
    </div>
  );
}