/**
 * Lesson Screen
 *
 * Displays lesson content with explanation, examples, videos, and practice questions.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useCourse } from '@/contexts/CourseContext';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  Lightbulb,
  BookOpen,
  Video,
  X,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList, CoursesStackParamList } from '@/navigation/types';
import type { MicroTopic, LessonContent, Video as VideoType } from '@/types';

type LessonRouteProp = RouteProp<HomeStackParamList | CoursesStackParamList, 'Lesson'>;

type LessonNavigationProp = NativeStackNavigationProp<HomeStackParamList | CoursesStackParamList, 'Lesson'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LessonScreen: React.FC = () => {
  const route = useRoute<LessonRouteProp>();
  const navigation = useNavigation<LessonNavigationProp>();
  const { courseId, moduleId, microTopicId } = route.params;

  const { currentCourse, fetchCourse, updateProgress } = useCourse();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      await fetchCourse(courseId);
      setIsLoading(false);
    };

    loadCourse();
  }, [courseId, fetchCourse]);

  const getMicroTopic = (): MicroTopic | null => {
    if (!currentCourse?.course) return null;

    for (const module of currentCourse.course.modules) {
      for (const topic of module.microTopics) {
        if (topic._id === microTopicId) {
          return topic;
        }
      }
    }
    return null;
  };

  const microTopic = getMicroTopic();
  const content = microTopic?.content as LessonContent | null;
  const videos = microTopic?.videos as VideoType[] | null;

  // Don't auto-select video - only show player when user clicks
  const selectedVideo = videos?.find((video) => video.videoId === selectedVideoId) ?? null;

  const handleMarkComplete = async () => {
    if (!microTopic) return;
    await updateProgress(courseId, moduleId, microTopicId, !microTopic.isCompleted);
  };

  // Find next lesson
  const getNextLesson = () => {
    if (!currentCourse?.course?.modules) return null;
    
    let foundCurrent = false;
    for (const mod of currentCourse.course.modules) {
      for (const topic of mod.microTopics) {
        if (foundCurrent) {
          return { moduleId: mod._id, microTopicId: topic._id, title: topic.title };
        }
        if (topic._id === microTopicId) {
          foundCurrent = true;
        }
      }
    }
    return null;
  };

  // Find previous lesson
  const getPreviousLesson = () => {
    if (!currentCourse?.course?.modules) return null;
    
    let prevLesson: { moduleId: string; microTopicId: string; title: string } | null = null;
    for (const mod of currentCourse.course.modules) {
      for (const topic of mod.microTopics) {
        if (topic._id === microTopicId) {
          return prevLesson;
        }
        prevLesson = { moduleId: mod._id, microTopicId: topic._id, title: topic.title };
      }
    }
    return null;
  };

  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  const handleNextLesson = () => {
    if (nextLesson) {
      navigation.push('Lesson', {
        courseId,
        moduleId: nextLesson.moduleId,
        microTopicId: nextLesson.microTopicId,
      });
    }
  };

  const handlePreviousLesson = () => {
    if (previousLesson) {
      navigation.push('Lesson', {
        courseId,
        moduleId: previousLesson.moduleId,
        microTopicId: previousLesson.microTopicId,
      });
    }
  };

  if (isLoading || !microTopic || !content) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </View>
    );
  }

  const isCompleted = microTopic.isCompleted;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.lessonEyebrow}>Lesson</Text>
          <Text style={styles.lessonTitle}>{microTopic.title}</Text>
        </View>

        {videos && videos.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Video size={20} color="#ec4899" />
              <Text style={styles.sectionTitle}>Related Videos</Text>
            </View>

            {selectedVideo && (
              <View style={styles.playerCard}>
                <View style={styles.playerContainer}>
                  <YoutubePlayer height={220} play={true} videoId={selectedVideo.videoId} />
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setSelectedVideoId(null)}
                  >
                    <X size={20} color={colors.textInverse} />
                  </TouchableOpacity>
                </View>
                <View style={styles.playerMeta}>
                  <Text style={styles.playerTitle}>{selectedVideo.title}</Text>
                  <Text style={styles.playerChannel}>{selectedVideo.channelTitle}</Text>
                </View>
              </View>
            )}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {videos.map((video) => {
                const hasImageError = imageErrors[video.videoId];
                const isSelected = video.videoId === selectedVideo?.videoId;

                return (
                  <TouchableOpacity
                    key={video.videoId}
                    style={[styles.videoCard, isSelected && styles.videoCardSelected]}
                    onPress={() => setSelectedVideoId(video.videoId)}
                  >
                    <View style={styles.videoThumbnail}>
                      {!hasImageError && video.thumbnailUrl ? (
                        <Image
                          source={{ uri: video.thumbnailUrl }}
                          style={styles.thumbnailImage}
                          resizeMode="cover"
                          onError={() =>
                            setImageErrors((prev) => ({
                              ...prev,
                              [video.videoId]: true,
                            }))
                          }
                        />
                      ) : (
                        <View style={styles.thumbnailFallback}>
                          <PlayCircle size={42} color={colors.textInverse} />
                        </View>
                      )}
                      <View style={styles.playOverlay}>
                        <PlayCircle size={34} color={colors.textInverse} />
                      </View>
                    </View>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.videoChannel}>{video.channelTitle}</Text>
                    <Text style={styles.videoDuration}>{video.duration}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Explanation</Text>
          </View>
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{content.explanation}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={20} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Example</Text>
          </View>
          <View style={[styles.contentCard, styles.exampleCard]}>
            <Text style={styles.contentText}>{content.example}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lightbulb size={20} color="#8b5cf6" />
            <Text style={styles.sectionTitle}>Analogy</Text>
          </View>
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{content.analogy}</Text>
          </View>
        </View>

        {content.keyTakeaways && content.keyTakeaways.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle2 size={20} color={colors.success} />
              <Text style={styles.sectionTitle}>Key Takeaways</Text>
            </View>
            <View style={styles.takeawaysCard}>
              {content.keyTakeaways.map((takeaway, index) => (
                <View key={index} style={styles.takeawayItem}>
                  <View style={styles.takeawayBullet} />
                  <Text style={styles.takeawayText}>{takeaway}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {content.practiceQuestions && content.practiceQuestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={20} color="#06b6d4" />
              <Text style={styles.sectionTitle}>Practice Questions</Text>
            </View>
            {content.practiceQuestions.map((pq, index) => (
              <View key={index} style={styles.questionCard}>
                <Text style={styles.questionNumber}>Q{index + 1}</Text>
                <Text style={styles.questionText}>{pq.question}</Text>
                <View style={styles.answerContainer}>
                  <Text style={styles.answerLabel}>Answer:</Text>
                  <Text style={styles.answerText}>{pq.answer}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Action Buttons */}
        <View style={styles.bottomActions}>
          <View style={styles.navigationRow}>
            {previousLesson && (
              <TouchableOpacity
                style={styles.prevButton}
                onPress={handlePreviousLesson}
              >
                <ArrowLeft size={20} color={colors.primary} />
                <Text style={styles.prevButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            {nextLesson && (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextLesson}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <ArrowRight size={20} color={colors.textInverse} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.completeButton, isCompleted && styles.completedButton]}
            onPress={handleMarkComplete}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={20} color={colors.success} />
                <Text style={styles.completedButtonText}>Completed</Text>
              </>
            ) : (
              <>
                <Circle size={20} color={colors.primary} />
                <Text style={styles.completeButtonText}>Mark as Complete</Text>
              </>
            )}
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
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: colors.textMuted,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      gap: 4,
    },
    lessonEyebrow: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    lessonTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    completeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
     
      marginVertical: 16,
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 2,
      width: '100%',
      borderColor: colors.primary,
    },
    completedButton: {
      backgroundColor: colors.successSoft,
      borderColor: colors.success,
    },
    completeButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    completedButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.success,
    },
    bottomActions: {
      padding: 16,
      gap: 12,
    },
    nextButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    nextButtonText: {
      color: colors.textInverse,
      fontSize: 17,
      fontWeight: '600',
    },
    navigationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    prevButton: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    prevButtonText: {
      color: colors.text,
      fontSize: 17,
      fontWeight: '600',
    },
    section: {
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    playerCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    playerContainer: {
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playerMeta: {
      padding: 14,
      gap: 4,
    },
    playerTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    playerChannel: {
      fontSize: 13,
      color: colors.textMuted,
    },
    contentCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exampleCard: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
    },
    contentText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
    },
    videoCard: {
      width: SCREEN_WIDTH * 0.7,
      marginRight: 12,
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    videoCardSelected: {
      borderColor: colors.primary,
    },
    videoThumbnail: {
      width: '100%',
      height: 140,
      backgroundColor: colors.surfaceMuted,
      position: 'relative',
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
    },
    thumbnailFallback: {
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(17, 24, 39, 0.28)',
    },
    videoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      padding: 12,
      paddingBottom: 4,
    },
    videoChannel: {
      fontSize: 12,
      color: colors.textMuted,
      paddingHorizontal: 12,
    },
    videoDuration: {
      fontSize: 12,
      color: colors.textMuted,
      paddingHorizontal: 12,
      paddingBottom: 12,
    },
    takeawaysCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    takeawayItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    takeawayBullet: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.success,
      marginTop: 6,
      marginRight: 12,
    },
    takeawayText: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
    },
    questionCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    questionNumber: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: 8,
    },
    questionText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 12,
    },
    answerContainer: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 8,
      padding: 12,
    },
    answerLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 4,
    },
    answerText: {
      fontSize: 15,
      color: colors.text,
    },
  });

export default LessonScreen;
