// AddCourse.js
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function AddCourse({ navigation }) {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseVideo, setCourseVideo] = useState('');

  const handleAddCourse = async () => {
    if (!courseName || !courseDescription || !courseVideo) {
      return Alert.alert('Error', 'Please fill in all fields');
    }

    try {
      const token = await AsyncStorage.getItem('token');

      await axios.post(
        'http://192.168.36.234:5000/api/courses',
        {
          course_name: courseName,
          course_description: courseDescription,
          course_video: courseVideo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Course added!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add course');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Course Name"
        placeholderTextColor='gray'
        value={courseName}
        onChangeText={setCourseName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Course Description"
        placeholderTextColor='gray'
        value={courseDescription}
        onChangeText={setCourseDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Course Video URL"
        placeholderTextColor='gray'
        value={courseVideo}
        onChangeText={setCourseVideo}
      />
      <Button title="Add Course" onPress={handleAddCourse} color="#4F46E5" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#EEF2FF',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E3A8A',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    color: 'black',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
