// 🎯 ARCHIVO: app/(auth)/(user-register)/step2.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const services = ['Reparaciones simples en casa', 'Reparaciones complejas en casa', 'Construcción', 'Remodelaciones en casa'];
const homeTypes = ['Parcela', 'Casa', 'Departamento', 'Otro'];

export default function UserRegisterStep2() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedHomeType, setSelectedHomeType] = useState<string | null>(null);

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(item => item !== service) : [...prev, service]
    );
  };

  const handleCreateAccount = () => {
    console.log('Botón "Crea tu cuenta" presionado!'); 
    console.log('Servicios:', selectedServices, 'Tipo de hogar:', selectedHomeType);
    // Lógica para enviar datos al backend...
    router.push('/(auth)/(user-register)/success');
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Registro</Text>
        
        <Text style={styles.subtitle}>Selecciona por qué quieres usar este servicio</Text>
        <View style={styles.listContainer}>
          {services.map(service => (
            <TouchableOpacity key={service} style={styles.checkboxContainer} onPress={() => toggleService(service)}>
              <Text style={styles.optionText}>{service}</Text>
              <View style={[styles.checkbox, selectedServices.includes(service) && styles.checkboxSelected]}>
                {selectedServices.includes(service) && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.subtitle}>Selecciona tipo de hogar</Text>
        <View style={styles.listContainer}>
          {homeTypes.map(type => (
            <TouchableOpacity key={type} style={styles.checkboxContainer} onPress={() => setSelectedHomeType(type)}>
              <Text style={styles.optionText}>{type}</Text>
              <View style={[styles.radio, selectedHomeType === type && styles.radioSelected]}>
                {selectedHomeType === type && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>Crea tu cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 40, paddingTop: 20, paddingBottom: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50', textAlign: 'center', marginBottom: 20 },
  subtitle: { fontSize: 16, color: '#2C3E50', textAlign: 'center', marginBottom: 20, fontWeight: '500' },
  listContainer: { marginBottom: 30 },
  checkboxContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  optionText: { fontSize: 16, color: '#34495E' },
  checkbox: { width: 24, height: 24, borderRadius: 5, borderWidth: 2, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#3498DB', borderColor: '#3498DB' },
  checkMark: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: '#3498DB' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#3498DB' },
  button: { backgroundColor: '#3498DB', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});