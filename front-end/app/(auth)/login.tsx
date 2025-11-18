// 🎯 ARCHIVO: app/login.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => { console.log('Intentando iniciar sesión con:', email, password); };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.headerTitle}>Inicio de sesión</Text>
        <Image source={require('../../assets/images/logo.jpeg')} style={styles.logo} />
        <TextInput style={styles.input} placeholder="Correo electronico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#999" />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* --- ¡ESTE ES EL CAMBIO! --- */}
        {/* Reemplazamos TouchableOpacity por un Link funcional */}
        <Link href="/(auth)/forgot-password" style={styles.forgotPasswordLink}>
          <Text style={styles.forgotPasswordText}>OLVIDE MI CONTRASEÑA</Text>
        </Link>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ¿No tienes cuenta?{' '}
          <Link href="/(auth)" style={styles.link}>
            Registrate acá
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Añadimos/modificamos los estilos necesarios
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  mainContent: { flex: 1, justifyContent: 'center', paddingHorizontal: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 40 },
  logo: { width: 100, height: 100, resizeMode: 'contain', borderRadius: 20, alignSelf: 'center', marginBottom: 60 },
  input: { fontSize: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#DDD', marginBottom: 25 },
  button: { backgroundColor: '#3498DB', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  // Estilos para el Link
  forgotPasswordLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: { paddingBottom: 40, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#7F8C8D' },
  link: { color: '#3498DB', fontWeight: 'bold' },
});