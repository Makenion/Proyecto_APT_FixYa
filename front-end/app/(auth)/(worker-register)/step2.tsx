// 🎯 ARCHIVO: app/(auth)/(worker-register)/step2.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const specialities = [
  'Pintura', 'Carpinteria', 'Electricidad', 'Soldadura', 
  'Reparaciones simples', 'Reparaciones complejas', 'Instalaciones', 'Construcción'
];

export default function WorkerRegisterStep2() {
  const router = useRouter();
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);

  const toggleSpeciality = (spec: string) => {
    setSelectedSpecialities(prev =>
      prev.includes(spec) ? prev.filter(item => item !== spec) : [...prev, spec]
    );
  };

  const handleCreateAccount = () => {
    console.log('Botón "Crea tu cuenta" de TRABAJADOR presionado!');
    console.log('Especialidades seleccionadas:', selectedSpecialities);
    // En el futuro, aquí se envían los datos al backend.

    // Navegamos a la pantalla de éxito de este mismo flujo.
    router.push('/(auth)/(worker-register)/success');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Registro</Text>
        <Text style={styles.subtitle}>Selecciona tus certificaciones y/o especialidades</Text>
        <View style={styles.specialityList}>
          {specialities.map(spec => (
            <TouchableOpacity 
              key={spec} 
              style={styles.checkboxContainer} 
              onPress={() => toggleSpeciality(spec)}
            >
              <Text style={styles.checkboxText}>{spec}</Text>
              <View style={[styles.checkbox, selectedSpecialities.includes(spec) && styles.checkboxSelected]}>
                {selectedSpecialities.includes(spec) && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachButtonText}>Adjunta acá tus certificados</Text>
            <Text style={styles.attachButtonIcon}>+</Text>
        </TouchableOpacity>
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
  subtitle: { fontSize: 16, color: '#2C3E50', textAlign: 'center', marginBottom: 30 },
  specialityList: { marginBottom: 30 },
  checkboxContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  checkboxText: { fontSize: 16, color: '#34495E' },
  checkbox: { width: 24, height: 24, borderRadius: 5, borderWidth: 2, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' },
  checkboxSelected: { backgroundColor: '#3498DB', borderColor: '#3498DB' },
  checkMark: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  attachButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, backgroundColor: 'white', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, marginBottom: 40 },
  attachButtonText: { fontSize: 16, color: '#34495E', fontWeight: '500' },
  attachButtonIcon: { fontSize: 24, color: '#3498DB', fontWeight: 'bold' },
  button: { backgroundColor: '#3498DB', paddingVertical: 18, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});