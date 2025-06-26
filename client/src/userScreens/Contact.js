import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const email = 'milansandakelum19@gmail.com';
const whatsappNumber = '+94758125068';

const Contact = () => {
  const bounceAnimEmail = useRef(new Animated.Value(1)).current;
  const bounceAnimWhatsapp = useRef(new Animated.Value(1)).current;

  const bounce = (anim) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 1.2,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const openEmail = () => {
    bounce(bounceAnimEmail);
    Linking.openURL(`mailto:${email}`);
  };

  const openWhatsApp = () => {
    const url = `whatsapp://send?phone=${whatsappNumber}`;

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        const webUrl = `https://wa.me/${whatsappNumber}`;
        Linking.openURL(webUrl).catch(() => {
          Alert.alert('Error', 'Cannot open WhatsApp or WhatsApp Web.');
        });
      }
    });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Our Ideas & Mission</Text>
      <View style={styles.underline} />
      <Text style={styles.paragraph}>
        We believe in creating accessible, engaging, and interactive educational platforms that empower learners worldwide. Our goal is to build tools that simplify learning and foster community among students and teachers.
        We strive to innovate constantly, ensuring education is inclusive, fun, and effective for all ages and backgrounds.
      </Text>

      <Text style={styles.heading}>Contact Me</Text>
      <View style={styles.underline} />

      <TouchableOpacity style={styles.contactRow} onPress={openEmail} activeOpacity={0.7}>
        <Animated.View style={{ transform: [{ scale: bounceAnimEmail }] }}>
          <Ionicons name="mail-outline" size={28} color="#4F46E5" />
        </Animated.View>
        <Text style={styles.contactText}>{email}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactRow} onPress={openWhatsApp} activeOpacity={0.7}>
        <Animated.View style={{ transform: [{ scale: bounceAnimWhatsapp }] }}>
          <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
        </Animated.View>
        <Text style={styles.contactText}>{whatsappNumber}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 6,
  },
  underline: {
    width: 60,
    height: 4,
    backgroundColor: '#4F46E5',
    marginBottom: 20,
    borderRadius: 2,
  },
  paragraph: {
    fontSize: 18,
    color: '#334155',
    lineHeight: 28,
    textAlign: 'justify',
    marginBottom: 40,
    fontWeight: '500',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  contactText: {
    fontSize: 18,
    color: '#2563EB',
    marginLeft: 16,
    fontWeight: '600',
  },
});

export default Contact;
