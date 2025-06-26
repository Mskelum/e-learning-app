import React, { useCallback, useEffect, useState } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found, please login again');
        return navigation.replace('Login');
      }

      const res = await axios.get('http://192.168.36.234:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load user data');
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const [coursesRes, enrollRes] = await Promise.all([
        axios.get('http://192.168.36.234:5000/api/courses/my', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://192.168.36.234:5000/api/enrollment/enrolled-stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const enrolledMap = {};
      enrollRes.data.forEach(item => {
        enrolledMap[item.course_id] = item.enrolled_students;
      });

      const updatedCourses = (coursesRes.data || []).map(course => ({
        ...course,
        enrolled_students: enrolledMap[course._id] || 0,
      }));

      setCourses(updatedCourses);
    } catch (err) {
      console.error('Fetch error:', err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [])
  );

  const handleDelete = async (courseId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://192.168.36.234:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Course deleted successfully');
      fetchCourses();
    } catch (err) {
      console.error('Delete error:', err?.response?.data || err.message);
      Alert.alert('Error', 'Failed to delete course');
    }
  };

  const handleEdit = (course) => {
    navigation.navigate('EditCourse', { course });
  };

  const logout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('Login');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };


  const getTotalEnrollments = () => {
    return courses.reduce((sum, course) => sum + (course.enrolled_students || 0), 0);
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
        <Text style={styles.title}>Welcome, {user?.name || 'Admin'}!</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <Text style={styles.summary}>📊 Total Enrollments: {getTotalEnrollments()}</Text>
      <Text style={styles.courseListTitle}>Admin: Course List</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        {courses.length === 0 ? (
          <Text style={styles.info}>No courses available.</Text>
        ) : (
          courses.map((course) => (
            <TouchableOpacity
              key={course._id}
              style={styles.card}
              onPress={() => navigation.navigate('MyCourses', { courseId: course._id, courseName: course.course_name, courseDescription: course.course_description })}
            >
              <Text style={styles.courseTitle}>{course.course_name}</Text>
              <Text style={styles.desc}>{course.course_description}</Text>
              <Text style={styles.stat}>🎓 Enrolled: {course.enrolled_students || 0}</Text>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(course)}>
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    Alert.alert('Confirm', 'Are you sure?', [
                      { text: 'Cancel' },
                      { text: 'Delete', onPress: () => handleDelete(course._id) },
                    ])
                  }
                >
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddCourse')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2FF',
    flex: 1,
    padding: 16,
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
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  courseListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#1E40AF',
  },
  summary: {
    fontSize: 16,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    color: '#475569',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 5,
  },
  desc: {
    fontSize: 14,
    color: 'black',
    marginBottom: 8,
  },
  stat: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4F46E5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});

export default Dashboard;
