import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const CourseDetails = ({ route, navigation }) => {
  const { course } = route.params;
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(
          `http://192.168.36.234:5000/api/enrollment/check/${course._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.enrolled) {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error('Error checking enrollment:', err);
      }
    };

    checkEnrollment();
  }, [course._id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        navigation.replace('Login');
        return;
      }

      await axios.post(
        `http://192.168.36.234:5000/api/enrollment/${course._id}`,
        { courseId: course._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsEnrolled(true);
      Alert.alert('Success', 'You have enrolled in this course!');
    } catch (err) {
      if (err.response?.data?.msg === 'Already enrolled') {
        setIsEnrolled(true);
        Alert.alert('Info', 'You are already enrolled in this course');
      } else {
        console.error('Enrollment error:', err);
        Alert.alert('Error', 'Enrollment failed');
      }
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{course.course_name}</Text>
      <Text style={styles.info}>{course.course_description}</Text>
      <Text style={styles.stat}>📌 Enrolled Students: {course.enrolled_students || 0}</Text>

      {course.course_video ? (
        <Video
          source={{ uri: course.course_video }}
          style={styles.video}
          controls={true}
          resizeMode="contain"
          paused={false}
        />
      ) : (
        <Text style={styles.info}>No video available</Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title={isEnrolled ? 'Enrolled' : 'Enroll in this Course'}
          onPress={handleEnroll}
          disabled={enrolling || isEnrolled}
          color={isEnrolled ? '#6B7280' : '#10B981'}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 15,
  },
  stat: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 10,
  },
  video: {
    width: width - 40,
    height: 200,
    backgroundColor: 'black',
    marginBottom: 20,
  },
});

export default CourseDetails;
