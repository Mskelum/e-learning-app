import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const EditCourse = ({ route, navigation }) => {
  const { course } = route.params;

  const [courseName, setCourseName] = useState(course.course_name || '');
  const [courseDescription, setCourseDescription] = useState(course.course_description || '');
  const [courseVideo, setCourseVideo] = useState(course.course_video || '');

  const handleUpdate = async () => {
    if (!courseName || !courseDescription || !courseVideo) {
      return Alert.alert('Error', 'Please fill all fields');
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://192.168.36.234:5000/api/courses/${course._id}`,
        {
          course_name: courseName,
          course_description: courseDescription,
          course_video: courseVideo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert('Success', 'Course updated successfully');
      navigation.goBack();
    } catch (err) {
      console.error('Update error:', err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to update course');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Course</Text>

      <Text style={styles.label}>Course Name</Text>
      <TextInput
        style={styles.input}
        value={courseName}
        onChangeText={setCourseName}
        placeholder="Enter course name"
        placeholderTextColor="gray"
      />

      <Text style={styles.label}>Course Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={courseDescription}
        onChangeText={setCourseDescription}
        placeholder="Enter course description"
        placeholderTextColor="gray"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Course Video URL</Text>
      <TextInput
        style={styles.input}
        value={courseVideo}
        onChangeText={setCourseVideo}
        placeholder="Enter video URL"
        placeholderTextColor="gray"
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Course</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#EEF2FF',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    color: 'black',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditCourse;
