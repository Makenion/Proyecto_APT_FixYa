// 🎯 ARCHIVO: app/(tabs)/solicitudes.tsx (EDITADO)

import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router'; 

// --- Datos de ejemplo (Separados por pestaña) ---
const MOCK_DATA = {
  'En curso': [
    {
      id: '213', // Usamos el ID como string para que coincida
      date: '20/09/2025',
      jobNumber: '#213',
      title: 'Mueble cocina',
      location: 'Calle las rosas 37, Viña del Mar',
      distance: '2km',
    }
  ],
  'Pendientes': [
    {
      id: '214',
      date: '21/09/2025',
      jobNumber: '#214',
      title: 'Instalar lámpara',
      location: 'Calle Falsa 123, Valparaíso',
      distance: '1.5km',
    }
  ],
  'Historial': [], // El historial está vacío por ahora
};
// --- Fin de datos de ejemplo ---


export default function SolicitudesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('En curso'); 
  const tabs = ['Pendientes', 'En curso', 'Historial'];

  // --- 1. FUNCIÓN PARA RENDERIZAR EL CONTENIDO DE LA PESTAÑA ACTIVA ---
  const renderTabContent = () => {
    // @ts-ignore
    const requests = MOCK_DATA[activeTab] || []; 

    if (requests.length === 0) {
      return <Text style={styles.emptyText}>No hay solicitudes en esta sección.</Text>;
    }

    // --- LÓGICA PARA "EN CURSO" (Botón "Resumen") ---
    if (activeTab === 'En curso') {
      return requests.map(request => (
        <View key={request.id} style={styles.requestCard}>
          <TouchableOpacity onPress={() => router.push(`/resumen-solicitud/${request.id}`)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>{request.date}</Text>
              <Text style={styles.cardJobNumber}>{request.jobNumber}</Text>
            </View>
            <Text style={styles.cardTitle}>{request.title}</Text>
            <Text style={styles.cardLocation}>
              <Ionicons name="location-pin" size={14} color="#7F8C8D" />
              {' '}{request.location}, <Text style={{color: '#3498DB'}}>{request.distance}</Text>
            </Text>
          </TouchableOpacity>
          
          {/* 👇 SECCIÓN DE BOTONES EDITADA (SÓLO QUEDA UN BOTÓN) */}
          <View style={styles.cardButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => router.push(`/resumen-solicitud/${request.id}`)}
            >
              <Text style={[styles.buttonText, styles.buttonTextOutline]}>Resumen solicitud</Text>
            </TouchableOpacity>
            
            {/* El botón "Cancelar solicitud" ha sido eliminado */}

          </View>
        </View>
      ));
    }

    // --- LÓGICA PARA "PENDIENTES" (Botón "Editar") ---
    if (activeTab === 'Pendientes') {
      return requests.map(request => (
        <View key={request.id} style={styles.requestCard}>
          <TouchableOpacity onPress={() => router.push(`/resumen-solicitud/${request.id}`)}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardDate}>{request.date}</Text>
              <Text style={styles.cardJobNumber}>{request.jobNumber}</Text>
            </View>
            <Text style={styles.cardTitle}>{request.title}</Text>
            <Text style={styles.cardLocation}>
              <Ionicons name="location-pin" size={14} color="#7F8C8D" />
              {' '}{request.location}, <Text style={{color: '#3498DB'}}>{request.distance}</Text>
            </Text>
          </TouchableOpacity>
          <View style={styles.cardButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonOutline]}
              onPress={() => router.push({
                pathname: '/(tabs)/editar-solicitud',
                params: { requestId: request.id }
              })}
            >
              <Text style={[styles.buttonText, styles.buttonTextOutline]}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSolid]}
              onPress={() => router.push({
                pathname: '/cancelar-solicitud-modal',
                params: { requestId: request.id }
              })}
            >
              <Text style={styles.buttonText}>Cancelar solicitud</Text>
            </TouchableOpacity>
          </View>
        </View>
      ));
    }

    // --- LÓGICA PARA "HISTORIAL" (Sin botones) ---
    return requests.map(request => (
      <TouchableOpacity 
        key={request.id} 
        style={styles.requestCard}
        onPress={() => router.push(`/resumen-solicitud/${request.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{request.date}</Text>
          <Text style={styles.cardJobNumber}>{request.jobNumber}</Text>
        </View>
        <Text style={styles.cardTitle}>{request.title}</Text>
        <Text style={styles.cardLocation}>
          <Ionicons name="location-pin" size={14} color="#7F8C8D" />
          {' '}{request.location}, <Text style={{color: '#3498DB'}}>{request.distance}</Text>
        </Text>
      </TouchableOpacity>
    ));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: 'Solicitudes' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pestañas de filtro */}
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Barra de Búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar solicitud"
            placeholderTextColor="#999"
          />
        </View>
        {/* Título de la lista */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {/* @ts-ignore */}
            {MOCK_DATA[activeTab]?.length || 0} Solicitud(es)
          </Text>
          <Text style={styles.listStatus}>{activeTab} ▼</Text>
        </View>
        {/* --- 3. Llamamos a la función de renderizado --- */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- TUS ESTILOS (PERMANECEN IGUALES) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { padding: 20 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAECEE',
    borderRadius: 20,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  tabText: {
    color: '#7F8C8D',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3498DB',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAECEE',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listStatus: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 15, 
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  cardJobNumber: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginVertical: 5,
  },
  cardLocation: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 20,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498DB',
  },
  buttonSolid: {
    backgroundColor: '#3498DB',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  buttonTextOutline: {
    color: '#3498DB',
  },
  emptyText: { 
    textAlign: 'center',
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 40,
  }
});