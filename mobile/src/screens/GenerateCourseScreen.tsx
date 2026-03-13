/**
 * Generate Course Screen
 *
 * Dedicated page for generating new AI courses.
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
  Play,
  CheckCircle,
  ArrowRight,
} from 'lucide-react-native';
import { useCourse } from '@/contexts/CourseContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GenerationProgress } from '@/components';
import type { HomeStackParamList } from '@/navigation/types';

type GenerateCourseNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'GenerateCourse'>;

const SUGGESTED_TOPICS = ['Machine Learning', 'React Development', 'Design Thinking', 'Startup Strategy'];

const GenerateCourseScreen: React.FC = () => {
  const navigation = useNavigation<GenerateCourseNavigationProp>();
  const { generateCourse, pollGenerationStatus, generationStatus, stopPolling } = useCourse();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Cleanup polling when component unmounts
  React.useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const onRefresh = async () => {
    setRefreshing(true);
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
      // Don't navigate away - let user see the progress
    } catch (error) {
      console.error('Error generating course:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestedTopic = (suggestedTopic: string) => {
    setTopic(suggestedTopic);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const isGeneratingActive = generationStatus && !generationStatus.isComplete && !generationStatus.failed;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Create New Course</Text>
          <Text style={styles.sectionSubtitle}>
            Describe what you want to learn and our AI will generate a personalized course for you.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="What do you want to learn?"
              placeholderTextColor={colors.textMuted}
              value={topic}
              onChangeText={setTopic}
              autoCapitalize="sentences"
              autoCorrect={true}
              multiline={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.generateButton, (!topic.trim() || isGenerating) && styles.generateButtonDisabled]}
            onPress={handleGenerateCourse}
            disabled={!topic.trim() || isGenerating}
          >
            <Sparkles size={20} color={colors.textInverse} />
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Creating...' : 'Generate Course'}
            </Text>
          </TouchableOpacity>

          {isGeneratingActive && (
            <View style={styles.progressContainer}>
              <GenerationProgress showLessonDetails={false} />
            </View>
          )}
        </View>

        <View style={styles.suggestedSection}>
          <Text style={styles.suggestedTitle}>Suggested topics:</Text>
          <View style={styles.suggestedRow}>
            {SUGGESTED_TOPICS.map((suggestedTopic) => (
              <TouchableOpacity
                key={suggestedTopic}
                style={[
                  styles.suggestedChip,
                  topic === suggestedTopic && styles.suggestedChipActive,
                ]}
                onPress={() => handleSuggestedTopic(suggestedTopic)}
              >
                <Text
                  style={[
                    styles.suggestedChipText,
                    topic === suggestedTopic && styles.suggestedChipTextActive,
                  ]}
                >
                  {suggestedTopic}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What you get:</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <BookOpen size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Comprehensive Outline</Text>
              <Text style={styles.featureDescription}>
                Well-structured modules and lessons tailored to your topic
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Clock size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Bite-sized Content</Text>
              <Text style={styles.featureDescription}>
                Micro-lessons designed for effective learning
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Play size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI-Powered Videos</Text>
              <Text style={styles.featureDescription}>
                Relevant YouTube videos to enhance your learning
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <CheckCircle size={20} color={colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Progress Tracking</Text>
              <Text style={styles.featureDescription}>
                Track your learning progress across all courses
              </Text>
            </View>
          </View>
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
      paddingBottom: 32,
    },
    inputSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 15,
      color: colors.textMuted,
      lineHeight: 22,
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 16,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    generateButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    generateButtonDisabled: {
      opacity: 0.5,
    },
    generateButtonText: {
      color: colors.textInverse,
      fontSize: 17,
      fontWeight: '600',
    },
    progressContainer: {
      marginTop: 20,
    },
    suggestedSection: {
      marginBottom: 24,
    },
    suggestedTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 12,
    },
    suggestedRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    suggestedChip: {
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    suggestedChipActive: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
    },
    suggestedChipText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '500',
    },
    suggestedChipTextActive: {
      color: colors.primary,
    },
    featuresSection: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    featuresTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 20,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
      marginBottom: 18,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 13,
      color: colors.textMuted,
      lineHeight: 18,
    },
  });

export default GenerateCourseScreen;
