import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';

const Splash = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          setTimeout(() => navigation.replace('Login'), 2000);
          return;
        }

        const role = await AsyncStorage.getItem('role'); 
        setTimeout(() => {
          if (role === 'student') {
            navigation.replace('UserTabs');
          } else {
            navigation.replace('AdminTabs');
          }
        }, 2000);

      } catch (error) {
        console.error('Error checking auth:', error);
        navigation.replace('Login');
      }
    };

    checkAuthAndNavigate();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-Learning</Text>
      <Text style={styles.subtitle}>Your personalized learning assistant</Text>
      <FastImage
        style={styles.image}
        source={require('../assets/loadd.gif')}
        resizeMode={FastImage.resizeMode.contain}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default Splash;
