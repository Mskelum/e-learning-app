import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const MyCourses = ({ route }) => {
  const { courseId, courseName, courseDescription } = route.params;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const fetchEnrolledStudents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`http://192.168.36.234:5000/api/enrollment/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(res.data || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch enrolled students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{courseName}</Text>
      <Text style={styles.desc}>{courseDescription}</Text>
      <Text style={styles.sectionTitle}>👨‍🎓 Enrolled Students</Text>

      {students.length === 0 ? (
        <Text style={styles.info}>No students enrolled yet.</Text>
      ) : (
        students.map((student, index) => (
          <View key={index} style={styles.studentCard}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentEmail}>{student.email}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 6,
  },
  desc: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  info: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
  studentCard: {
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  studentEmail: {
    fontSize: 14,
    color: '#4B5563',
  },
});

export default MyCourses;
