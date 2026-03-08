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
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Sparkles,
  BookOpen,
  Clock,
  TrendingUp,
  Loader2,
  Play,
  Layers3,
  ArrowRight,
  CloudOff,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCourse } from '@/contexts/CourseContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GenerationProgress } from '@/components';
import type { HomeStackParamList } from '@/navigation/types';
import type { Course } from '@/types';

type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const SUGGESTED_TOPICS = ['Machine Learning', 'React Development', 'Design Thinking', 'Startup Strategy'];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const { user } = useAuth();
  const { stats, fetchStats, generateCourse, pollGenerationStatus, generationStatus, syncState } = useCourse();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerateCourse = async () => {
    if (!topic.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      const courseId = await generateCourse(topic.trim());
      pollGenerationStatus(courseId);
      setTopic('');
    } catch (error) {
      console.error('Error generating course:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCoursePress = (course: Course) => {
    navigation.navigate('CourseDetail', { courseId: course._id });
  };

  const handleViewAll = () => {
    navigation.getParent()?.navigate('CoursesTab', {
      screen: 'CoursesList',
    } as never);
  };

  const currentGeneratingLesson = useMemo(() => {
    if (!generationStatus?.lessons?.length) {
      return null;
    }

    return (
      generationStatus.lessons.find((lesson) => lesson.status === 'generating') ||
      generationStatus.lessons.find((lesson) => lesson.status === 'failed') ||
      null
    );
  }, [generationStatus]);

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

        <View style={styles.generatorSection}>
          <Text style={styles.sectionTitle}>Generate New Course</Text>
          <View style={styles.generatorCard}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.generatorInput}
                placeholder="What do you want to learn?"
                placeholderTextColor={colors.textMuted}
                value={topic}
                onChangeText={setTopic}
              />
              <TouchableOpacity
                style={[styles.generateButton, (!topic.trim() || isGenerating) && styles.generateButtonDisabled]}
                onPress={handleGenerateCourse}
                disabled={!topic.trim() || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 size={20} color={colors.textInverse} />
                ) : (
                  <>
                    <Sparkles size={20} color={colors.textInverse} />
                    <Text style={styles.generateButtonText}>Generate</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {generationStatus && (
              <View style={styles.generationPanel}>
                <View style={styles.generationSummaryRow}>
                  <View>
                    <Text style={styles.generationTitle}>Generation activity</Text>
                    <Text style={styles.generationSubtitle}>
                      {generationStatus.generatedCount || 0} of {generationStatus.totalCount || 0} lessons ready
                    </Text>
                  </View>
                  {!generationStatus.isComplete && (
                    <Text style={styles.generationPercent}>{generationStatus.percentage || 0}%</Text>
                  )}
                </View>

                {currentGeneratingLesson && (
                  <View style={styles.currentLessonCard}>
                    <Text style={styles.currentLessonLabel}>
                      {currentGeneratingLesson.status === 'failed' ? 'Needs attention' : 'Now generating'}
                    </Text>
                    <Text style={styles.currentLessonTitle}>{currentGeneratingLesson.lessonTitle}</Text>
                    <Text style={styles.currentLessonMeta}>{currentGeneratingLesson.moduleName}</Text>
                  </View>
                )}

                <GenerationProgress showLessonDetails={false} />
              </View>
            )}

            <Text style={styles.suggestedLabel}>Suggested topics:</Text>
            <View style={styles.suggestedRow}>
              {SUGGESTED_TOPICS.map((suggestedTopic) => (
                <TouchableOpacity
                  key={suggestedTopic}
                  style={styles.suggestedChip}
                  onPress={() => setTopic(suggestedTopic)}
                >
                  <Text style={styles.suggestedChipText}>{suggestedTopic}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

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
    generatorCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputRow: {
      flexDirection: 'row',
      gap: 12,
    },
    generatorInput: {
      flex: 1,
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
    },
    generateButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    generateButtonDisabled: {
      opacity: 0.5,
    },
    generateButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: '600',
    },
    generationPanel: {
      marginTop: 16,
    },
    generationSummaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    generationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    generationSubtitle: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
    generationPercent: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    currentLessonCard: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      marginBottom: 12,
    },
    currentLessonLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    currentLessonTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginTop: 4,
    },
    currentLessonMeta: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
    suggestedLabel: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 16,
      marginBottom: 8,
    },
    suggestedRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    suggestedChip: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    suggestedChipText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '500',
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
