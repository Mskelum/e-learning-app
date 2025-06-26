import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native'; 


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://192.168.36.234:5000/api/auth/login', {
        email,
        password,
      });

      const token = res.data.token;
      const role = res.data.user.role;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);

      if (role === 'student') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'UserTabs' }],
          })
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'AdminTabs' }],
          })
        );
      }

    } catch (err) {
      console.log('Login error:', err?.response?.data || err.message);
      Alert.alert('Login Failed', 'Invalid email or password');
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
          <Text style={styles.title}>👋 Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue learning</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.switchText}>
              Don’t have an account? <Text style={styles.link}>Register</Text>
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
    bottom: 0,
    right: 0,
    opacity: 0.8, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#111827', 
    borderRadius: 16,
    padding: 28,
    marginHorizontal: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E0F2FE',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    color: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#475569',
  },
  button: {
    backgroundColor: '#6366F1',
    padding: 15,
    borderRadius: 12,
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
