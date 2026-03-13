/**
 * Home Screen
 *
 * Main dashboard with stats, course generator, and recent courses.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Play,
  Layers3,
  ArrowRight,
  CloudOff,
  Plus,
  Sparkles,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCourse } from '@/contexts/CourseContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { HomeStackParamList } from '@/navigation/types';
import type { Course } from '@/types';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { user } = useAuth();
  const { stats, fetchStats, syncState } = useCourse();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const handleGenerateCourse = () => {
    navigation.navigate('GenerateCourse');
  };

  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', { courseId: course._id });
  };

  const handleViewAll = () => {
    navigation.getParent()?.navigate('CoursesTab', {
      screen: 'CoursesList',
    } as never);
  };

  const homeStats = stats
    ? [
        { label: 'Courses', value: stats.overview.totalCourses, icon: BookOpen, color: colors.primary },
        { label: 'Modules', value: stats.overview.totalModules, icon: Layers3, color: '#8b5cf6' },
        { label: 'Lessons', value: stats.overview.totalMicroTopics, icon: Clock, color: '#f59e0b' },
        { label: 'Avg. Progress', value: `${Math.round(stats.overview.avgProgress)}%`, icon: TrendingUp, color: colors.success },
      ]
    : [];

  const recentCourses = stats?.recentCourses?.slice(0, 3) ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'Learner'}!</Text>
        </View>

        {syncState.isOffline && (
          <View style={styles.offlineBanner}>
            <CloudOff size={16} color="#b45309" />
            <Text style={styles.offlineBannerText}>
              Showing saved data while offline. Recent changes will sync when you reconnect.
            </Text>
          </View>
        )}

        {stats && (
          <View style={styles.statsSection}>
            {homeStats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <stat.icon size={22} color={stat.color} />
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}
        
        {recentCourses.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Courses</Text>
              <TouchableOpacity style={styles.seeAllButton} onPress={handleViewAll}>
                <Text style={styles.seeAllText}>See All</Text>
                <ArrowRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {recentCourses.map((course) => {
              const moduleCount = Array.isArray(course.modules) ? course.modules.length : 0;
              const progress = course.progress?.percentage ?? 0;
              const statusLabel = progress === 0 ? 'Not Started' : progress === 100 ? 'Completed' : 'In Progress';

              return (
                <TouchableOpacity
                  key={course._id}
                  style={styles.courseCard}
                  onPress={() => handleCoursePress(course)}
                >
                  <View style={styles.courseContent}>
                    <View style={styles.recentCourseHeader}>
                      <View
                        style={[
                          styles.courseStatusBadge,
                          progress === 100
                            ? styles.courseStatusBadgeCompleted
                            : progress > 0
                              ? styles.courseStatusBadgeActive
                              : styles.courseStatusBadgeNew,
                        ]}
                      >
                        <Text
                          style={[
                            styles.courseStatusText,
                            progress === 100
                              ? styles.courseStatusTextCompleted
                              : progress > 0
                                ? styles.courseStatusTextActive
                                : styles.courseStatusTextNew,
                          ]}
                        >
                          {statusLabel}
                        </Text>
                      </View>
                      <Clock size={16} color={colors.textMuted} />
                    </View>
                    <Text style={styles.courseTitle} numberOfLines={2}>
                      {course.title}
                    </Text>
                    <Text style={styles.courseMeta}>
                      {moduleCount} modules | {course.difficulty}
                    </Text>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{progress}% complete</Text>
                  </View>
                  <Play size={24} color={colors.primary} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.generatorSection}>
          <TouchableOpacity style={styles.generateCardButton} onPress={handleGenerateCourse}>
            <View style={styles.generateCardContent}>
              <View style={styles.generateCardIcon}>
                <Sparkles size={28} color={colors.primary} />
              </View>
              <View style={styles.generateCardText}>
                <Text style={styles.generateCardTitle}>Generate New Course</Text>
                <Text style={styles.generateCardSubtitle}>Create AI-powered courses tailored to your learning goals</Text>
              </View>
            </View>
            <ArrowRight size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 28,
    },
    welcomeSection: {
      marginBottom: 24,
    },
    greeting: {
      fontSize: 16,
      color: colors.textMuted,
    },
    userName: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    statsSection: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      width: '48%',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    offlineBanner: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
      backgroundColor: '#fffbeb',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#fcd34d',
      padding: 12,
      marginBottom: 16,
    },
    offlineBannerText: {
      flex: 1,
      color: '#92400e',
      fontSize: 13,
      lineHeight: 18,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 4,
    },
    generatorSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    generateCardButton: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    generateCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 16,
    },
    generateCardIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    generateCardText: {
      flex: 1,
    },
    generateCardTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    generateCardSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      lineHeight: 18,
    },
    recentSection: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    seeAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    seeAllText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    courseCard: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    courseContent: {
      flex: 1,
    },
    recentCourseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    courseStatusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
    },
    courseStatusBadgeNew: {
      backgroundColor: colors.surfaceMuted,
    },
    courseStatusBadgeActive: {
      backgroundColor: colors.primarySoft,
    },
    courseStatusBadgeCompleted: {
      backgroundColor: colors.successSoft,
    },
    courseStatusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    courseStatusTextNew: {
      color: colors.textMuted,
    },
    courseStatusTextActive: {
      color: colors.primary,
    },
    courseStatusTextCompleted: {
      color: colors.success,
    },
    courseTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    courseMeta: {
      fontSize: 14,
      color: colors.textMuted,
      marginBottom: 8,
      textTransform: 'capitalize',
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginBottom: 4,
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    progressText: {
      fontSize: 14,
      color: colors.textMuted,
    },
  });

export default HomeScreen;
