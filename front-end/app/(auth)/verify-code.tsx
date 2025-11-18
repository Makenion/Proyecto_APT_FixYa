// 🎯 ARCHIVO: app/(auth)/verify-code.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');

  const handleVerify = () => {
    console.log('Verificando código:', code);
    // Aquí iría la lógica para llamar a tu backend de Go
    // Si el código es correcto, podrías navegar a una pantalla de "Crear nueva contraseña"
    // router.push('/(auth)/reset-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.headerTitle}>Revisa tu correo</Text>
        
        {/* Marcador de posición para el ícono del sobre. ¡Añade tu imagen aquí! */}
        <View style={styles.iconPlaceholder} />
        {/* <Image source={require('../assets/images/email-icon.png')} style={styles.iconImage} /> */}

        <Text style={styles.subtitle}>
          Para confirmar tu correo electronico busca el codigo que te enviamos
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Código"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  mainContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 40 },
  iconPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#3498DB',
    alignSelf: 'center',
    marginBottom: 30,
    borderRadius: 20,
    opacity: 0.8
  },
  // iconImage: { width: 100, height: 100, resizeMode: 'contain', alignSelf: 'center', marginBottom: 30 },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    fontSize: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginBottom: 40,
    textAlign: 'center'
  },
  button: { backgroundColor: '#3498DB', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});