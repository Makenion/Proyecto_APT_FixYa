// 🎯 ARCHIVO: app/(auth)/(worker-register)/success.tsx (NUEVO)

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function RegisterSuccessScreen() {
  const router = useRouter();

  const handleGoToHome = () => {
    // Redirige a la pantalla principal del maestro (tabs2)
    // Usamos replace para que el usuario no pueda "volver" a esta pantalla
    router.replace('/(tabs2)/indexmaestro'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ocultamos el header de esta pantalla */}
      <Stack.Screen options={{ headerShown: false }} /> 

      <View style={styles.content}>
        <Text style={styles.title}>¡Felicidades!</Text>
        <Text style={styles.subtitle}>ya eres parte de nuestro equipo de trabajo.</Text>

        <Image 
          // Ajusta la ruta de la imagen. Está subiendo 3 niveles
          // (worker-register) -> (auth) -> app -> assets
          source={require('../../../assets/images/logo.jpeg')} 
          style={styles.logo}
        />

        <Text style={styles.infoText}>
          Recuerda completar tu perfil profesional y leer nuestra políticas de servicio.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoToHome}>
          <Text style={styles.buttonText}>Ir a inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA', // Fondo gris claro
    justifyContent: 'center', // Centra el contenido verticalmente
  },
  content: {
    padding: 40,
    alignItems: 'center', // Centra el contenido horizontalmente
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#34495E',
    marginBottom: 40,
    textAlign: 'center',
  },
  logo: {
    width: 120, // Tamaño mediano para el logo
    height: 120,
    borderRadius: 20, // Bordes redondeados
    marginBottom: 30,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%', // Ancho completo del contenedor (padding 40)
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});