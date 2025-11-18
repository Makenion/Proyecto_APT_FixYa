// 🎯 ARCHIVO: app/(tabs)/editar-solicitud.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

export default function EditarSolicitudScreen() {
  const router = useRouter();
  const { requestId } = useLocalSearchParams(); 
  
  // Datos de ejemplo para pre-llenar el formulario.
  // En un futuro, estos datos vendrían del backend usando el 'requestId'.
  const [title, setTitle] = useState('Mueble de cocina');
  const [description, setDescription] = useState('Necesito un mueble de cocina para mi casa, que sea de 2 puertas y no tan grande.');
  const [deliveryDate, setDeliveryDate] = useState('20/09/2025');
  const [comuna, setComuna] = useState('Viña del mar');
  const [address, setAddress] = useState('Calle las rosas 37');

  // Esta función se ejecuta al presionar el botón de guardar.
  const handleSaveChanges = () => {
    const updatedData = { title, description, deliveryDate, comuna, address };
    console.log(`Guardando cambios para la solicitud ID: ${requestId}`, updatedData);
    // Aquí iría la lógica para enviar los datos actualizados a tu backend de Go...

    // Después de guardar, esta línea te lleva de vuelta a la pantalla anterior.
    router.back(); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Esta línea configura el título en la barra superior y la flecha de "volver" */}
      <Stack.Screen options={{ headerShown: true, title: 'Editar solicitud' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.field}>
          <Text style={styles.label}>Título</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor="#C7C7CD" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tipo de trabajo</Text>
          <TouchableOpacity style={styles.picker}>
            <Text>Carpintero</Text>
            <Ionicons name="chevron-down" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Descripción del trabajo</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholderTextColor="#C7C7CD" multiline />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Fecha entrega</Text>
          <TextInput style={styles.input} value={deliveryDate} onChangeText={setDeliveryDate} placeholderTextColor="#C7C7CD" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Comuna</Text>
          <TextInput style={styles.input} value={comuna} onChangeText={setComuna} placeholderTextColor="#C7C7CD" />
        </View>
        
        <View style={styles.field}>
          <View style={styles.addressHeader}>
            <Text style={styles.label}>Dirección</Text>
            <TouchableOpacity><Text style={styles.mapLink}>Ver en mapa</Text></TouchableOpacity>
          </View>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholderTextColor="#C7C7CD" />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { padding: 20 },
  field: { marginBottom: 25 },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 8 },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapLink: {
    color: '#3498DB',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3498DB',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});