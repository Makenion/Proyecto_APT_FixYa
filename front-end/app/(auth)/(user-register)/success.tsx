// 🎯 ARCHIVO: app/(auth)/(user-register)/success.tsx (CON NAVEGACIÓN CORREGIDA)

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function UserRegisterSuccess() {
  const router = useRouter();

  const handleGoToHome = () => {

    router.replace('/(tabs)'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>¡Felicidades! ya eres parte de nuestra aplicación!</Text>
        
        <Image source={require('../../../assets/images/logo.jpeg')} style={styles.logo} />

        <Text style={styles.subtitle}>
          Recuerda completar tu perfil de usuario y leer nuestra políticas de servicio.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoToHome}>
          <Text style={styles.buttonText}>Ir a inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA', justifyContent: 'center', alignItems: 'center' },
  mainContent: { alignItems: 'center', paddingHorizontal: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 40 },
  logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 40 },
  subtitle: { fontSize: 16, color: '#7F8C8D', textAlign: 'center', marginBottom: 60 },
  button: { backgroundColor: '#3498DB', paddingVertical: 18, borderRadius: 30, alignItems: 'center', width: '100%', maxWidth: 250 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});