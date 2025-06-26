import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import axios from 'axios';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!role) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    try {
      const res = await axios.post('http://192.168.36.234:5000/api/auth/register', {
        name,
        role,
        email,
        password,
      });

      Alert.alert('Success', res.data.msg);
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Register Failed', 'Something went wrong');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/back.jpg')}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.image}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>🚀 Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.roleLabel}>Select Role</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'student' && styles.roleButtonSelected]}
              onPress={() => setRole('student')}
            >
              <Text style={[styles.roleText, role === 'student' && styles.roleTextSelected]}>
                Student
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleButton, role === 'teacher' && styles.roleButtonSelected]}
              onPress={() => setRole('teacher')}
            >
              <Text style={[styles.roleText, role === 'teacher' && styles.roleTextSelected]}>
                Teacher
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={register}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.link}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 28,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0F2FE',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#475569',
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#CBD5E1',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  roleButtonSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  roleText: {
    color: '#CBD5E1',
    fontWeight: '600',
    fontSize: 16,
  },
  roleTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#F8FAFC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 10,
  },
  link: {
    color: '#60A5FA',
    fontWeight: 'bold',
  },
});
