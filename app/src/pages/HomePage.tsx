/**
 * Home Page
 * 
 * Landing page with course generator and recent courses.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, BookOpen, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import CourseGenerator from '@/components/CourseGenerator';
import Header from '@/components/Layout/Header';
import * as courseApi from '@/api/courseApi';
import type { Course, StatsResponse } from '@/types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [_isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [recentResponse, statsResponse] = await Promise.all([
        courseApi.getRecentCourses(3),
        courseApi.getCourseStats(),
      ]);

      if (recentResponse.success) {
        setRecentCourses(recentResponse.data.courses);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Advanced AI generates comprehensive courses tailored to your topic',
    },
    {
      icon: BookOpen,
      title: 'Structured Learning',
      description: 'Logical progression from basics to advanced concepts',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                AI-Powered Learning
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Master Any Subject with{' '}
                <span className="text-primary">
                  AI-Generated Courses
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Enter any topic and our AI creates personalized courses with structured lessons, 
                practical examples, and curated video content.
              </p>
            </div>

            {/* Course Generator */}
            {isAuthenticated ? (
              <CourseGenerator />
            ) : (
              <div className="text-center">
                <Button size="lg" onClick={() => navigate('/login')} className="px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">
                  No credit card required · Start learning in seconds
                </p>
              </div>
            )}
          </div>
        </section>

        {isAuthenticated && <Separator />}

        {/* Stats Section */}
        {isAuthenticated && stats && (
          <section className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 rounded-xl bg-card border shadow-sm">
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {stats.overview.totalCourses}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Courses Created</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-card border shadow-sm">
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {stats.overview.totalModules}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Modules</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-card border shadow-sm">
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {stats.overview.totalMicroTopics}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Lessons</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-card border shadow-sm">
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {Math.round(stats.overview.avgProgress)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Avg. Progress</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Courses */}
        {isAuthenticated && recentCourses.length > 0 && (
          <section className="py-12 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Recent Courses</h2>
                  <p className="text-muted-foreground mt-1">Continue where you left off</p>
                </div>
                <Button variant="ghost" onClick={() => navigate('/courses')} className="shrink-0">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentCourses.map((course) => (
                  <Card
                    key={course._id}
                    className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-200 group"
                    onClick={() => navigate(`/courses/${course._id}`)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Badge 
                          variant={course.progress.percentage === 100 ? 'default' : course.progress.percentage === 0 ? 'secondary' : 'outline'}
                          className={course.progress.percentage === 100 ? 'bg-green-600' : ''}
                        >
                          {course.progress.percentage === 0
                            ? 'Not Started'
                            : course.progress.percentage === 100
                              ? 'Completed'
                              : 'In Progress'}
                        </Badge>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <h3 className="font-semibold mb-3 line-clamp-2 text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                      <Progress value={course.progress.percentage} className="h-1.5 mb-3" />
                      <p className="text-xs text-muted-foreground">
                        {course.progress.completedMicroTopics} / {course.progress.totalMicroTopics} lessons completed
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section - Only show when not authenticated */}
        {!isAuthenticated && (
          <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">How It Works</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Get started in minutes with our AI-powered course generation
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center hover:shadow-lg hover:border-primary/20 transition-all duration-200">
                    <CardContent className="pt-8 pb-6 px-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AI Course Architect. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
