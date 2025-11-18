import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

// --- ¡¡¡ATENCIÓN!!! DEBES CAMBIAR ESTA IP ---
// Busca tu IP local como se explica más abajo. No uses 'localhost'.
const API_URL = 'http://localhost:8080';

export default function RegistrationFormScreen({ route, navigation }) {
  const { role } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Algo salió mal');
      }
      Alert.alert('¡Registro Exitoso!', 'Tu cuenta ha sido creada.', [{ text: 'OK', onPress: () => navigation.navigate('RoleSelection') }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.mainContent}>
          <Text style={styles.headerTitle}>Crear Cuenta de {role.charAt(0).toUpperCase() + role.slice(1)}</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TextInput style={styles.input} placeholder="Nombre Completo" value={name} onChangeText={setName} placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Correo Electrónico" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#999" />
          <TextInput style={styles.input} placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#999" />
          <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Registrarse</Text>}
          </Pressable>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Volver a la selección</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#F7F8FA' }, mainContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 30 }, headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 40 }, input: { backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EAEAEA' }, button: { backgroundColor: '#3498DB', paddingVertical: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 }, buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }, backLink: { color: '#3498DB', textAlign: 'center', marginTop: 30, fontSize: 14 }, errorText: { color: '#E74C3C', textAlign: 'center', marginBottom: 20, fontSize: 14 } });