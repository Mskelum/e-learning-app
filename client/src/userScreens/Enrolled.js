import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Video from "react-native-video";
import YoutubePlayer from "react-native-youtube-iframe";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const EnrolledCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const extractYouTubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchEnrolledCourses = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found, please login again");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://192.168.36.234:5000/api/enrollment/my-courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const validEnrollments = (res.data || []).filter(
        (enroll) => enroll.courseId !== null
      );

      setEnrollments(validEnrollments);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      Alert.alert("Error", "Failed to fetch enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoComplete = async (enrollId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.put(
        `http://192.168.36.234:5000/api/enrollment/${enrollId}/status`,
        { progress: 100 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnrollments((prev) =>
        prev.map((e) =>
          e._id === enrollId ? { ...e, progress: 100 } : e
        )
      );
    } catch (error) {
      console.error("Error updating progress:", error);
      Alert.alert("Error", "Failed to update course progress.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEnrolledCourses();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (enrollments.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noEnrollmentsText}>
          You haven't enrolled in any courses yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <Text style={styles.title}>My Enrolled Courses</Text>

      {enrollments.map((enroll) => {
        const course = enroll.courseId;
        if (!course) return null;

        const videoUrl = course.course_video;
        const youtubeId = videoUrl ? extractYouTubeVideoId(videoUrl) : null;
        const isCompleted = enroll.progress === 100;

        return (
          <View key={enroll._id} style={styles.card}>
            <Text style={styles.courseTitle}>{course.course_name || "No Course Name"}</Text>
            <Text style={styles.progress}>
              Status: {isCompleted ? 'Finished' : 'To watch'}
            </Text>

            {youtubeId ? (
              <YoutubePlayer
                height={200}
                width={width - 70}
                videoId={youtubeId}
                play={false}
                onChangeState={(state) => {
                  if (state === "ended" && !isCompleted) {
                    handleVideoComplete(enroll._id);
                  }
                }}
              />
            ) : videoUrl ? (
              <Video
                source={{ uri: videoUrl }}
                style={styles.video}
                controls
                resizeMode="contain"
                onEnd={() => {
                  if (!isCompleted) handleVideoComplete(enroll._id);
                }}
                onError={(err) => console.log("Video error:", err)}
              />
            ) : (
              <Text style={styles.noVideo}>No video available</Text>
            )}
            {isCompleted && (
              <Text style={styles.completedText}>🎉 Course Completed!</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 20,
    textAlign: "center",
  },
  noEnrollmentsText: {
    fontSize: 18,
    color: "#64748B",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 6,
  },
  courseDesc: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 10,
  },
  progress: {
    fontSize: 16,
    color: "#10B981",
    marginBottom: 10,
    fontWeight: "600",
  },
  completedText: {
    fontSize: 18,
    color: "#059669",
    fontWeight: "bold",
    marginBottom: 10,
  },
  video: {
    width: width - 40,
    height: 200,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  noVideo: {
    color: "#EF4444",
    fontStyle: "italic",
  },
});

export default EnrolledCourses;
