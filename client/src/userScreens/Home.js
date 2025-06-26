import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return navigation.replace('Login');

      const userRes = await axios.get('http://192.168.36.234:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const coursesRes = await axios.get('http://192.168.36.234:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enrolledRes = await axios.get('http://192.168.36.234:5000/api/enrollment/enrolled-stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const statsMap = {};
      enrolledRes.data.forEach(stat => {
        statsMap[stat.course_id] = stat.enrolled_students;
      });

      const updatedCourses = coursesRes.data.map(course => ({
        ...course,
        enrolled_students: statsMap[course._id] || 0,
      }));

      setCourses(updatedCourses);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load data');
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const logout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Hi, {user?.name} 👋</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={26} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>📚 Explore Courses Below</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        {courses.map((course) => (
          <TouchableOpacity
            key={course._id}
            style={styles.card}
            onPress={() => navigation.navigate('CourseDetails', { course })}
          >
            <Text style={styles.courseTitle}>{course.course_name}</Text>
            <Text style={styles.courseDesc}>{course.course_description}</Text>
            <Text style={styles.courseStat}>🎓 Enrolled: {course.enrolled_students}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chatbot')}
          style={styles.fab}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2FF',
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: '#475569',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
  },
  courseDesc: {
    fontSize: 14,
    color: '#334155',
    marginTop: 6,
  },
  courseStat: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 10,
  },
    fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#2563EB',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
  },
});

export default Home;
