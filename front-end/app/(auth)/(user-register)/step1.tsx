// 🎯 ARCHIVO: app/(auth)/(user-register)/step1.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function UserRegisterStep1() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [rut, setRut] = useState('');
  // ... (otros estados para los campos)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleNext = () => {
    // Navegamos al siguiente paso DENTRO DEL FLUJO DE USUARIO
    router.push('/(auth)/(user-register)/step2');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Registro</Text>
        
        <TextInput style={styles.input} placeholder="Correo electronico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Rut" value={rut} onChangeText={setRut} placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Celular" keyboardType="phone-pad" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Fecha nacimiento" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Ciudad" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Dirección" placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#999" />
        <TextInput style={styles.input} placeholder="Confirma contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholderTextColor="#999" />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 40, paddingTop: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 40 },
  input: { fontSize: 16, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#DDD', marginBottom: 20 },
  button: { backgroundColor: '#3498DB', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 30 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});