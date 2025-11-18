import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

// --- Simulación de Datos (basado en tu foto) ---
const maestro = {
  nombre: 'Esteban',
  apellido: 'Carpintero',
  horasTrabajadas: 80,
  trabajosSiguientes: 4,
  trabajosCompletados: 20,
};

const ofertas = [
  { 
    id: 1, 
    titulo: 'Remodelación reja', 
    fecha: '20/09/25', 
    duracion: '3 días', 
    estado: 'Disponible', 
    ubicacion: 'Calle las rosas 37, Viña del Mar, 2km.', 
    precio: '$30.000' 
  },
  // ... aquí puedes agregar más ofertas de trabajo
];

// --- Componente Reutilizable para las Tarjetas de Oferta ---
const OfferCard = ({ oferta }: { oferta: (typeof ofertas)[0] }) => {
  return (
    <View style={styles.card}>
      {/* Header de la tarjeta */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{oferta.fecha}</Text>
        <Text style={styles.cardDuration}>{oferta.duracion}</Text>
        <View style={styles.disponibleBadge}>
          <Text style={styles.disponibleText}>{oferta.estado}</Text>
        </View>
      </View>
      
      {/* Título */}
      <Text style={styles.cardTitle}>{oferta.titulo}</Text>
      
      {/* Ubicación */}
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={16} color="#555" />
        <Text style={styles.locationText}>{oferta.ubicacion}</Text>
      </View>
      
      {/* Footer de la tarjeta */}
      <View style={styles.cardFooter}>
        <Text style={styles.price}>{oferta.precio}</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Detalles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function MaestroDashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Ocultamos el header por defecto porque tenemos uno personalizado */}
      <Stack.Screen options={{ headerShown: false }} /> 
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Header (adaptado de tu foto) --- */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://placehold.co/60x60/E2E8F0/333?text=E' }} // Reemplaza con la imagen real
              style={styles.avatar} 
            />
            <View>
              <Text style={styles.greeting}>Bienvenido, <Text style={{ color: '#3498DB' }}>{maestro.nombre}</Text></Text>
              <Text style={styles.maestroSubtitle}>{maestro.apellido}</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#555" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="#555" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Sección de Estadísticas (NUEVA) --- */}
        <Text style={styles.hoursText}>Horas trabajadas: <Text style={{fontWeight: 'bold'}}>{maestro.horasTrabajadas}</Text></Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{maestro.trabajosSiguientes}</Text>
            <Text style={styles.statLabel}>Trabajos siguientes:</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{maestro.trabajosCompletados}</Text>
            <Text style={styles.statLabel}>Trabajos completados:</Text>
          </View>
        </View>

        {/* --- Sección de Ofertas (Adaptada) --- */}
        <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Ofertas disponibles</Text>
            <TouchableOpacity onPress={() => console.log('Ver todas las ofertas')}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </TouchableOpacity>
        </View>
        
        {/* Lista de Ofertas */}
        {ofertas.map(oferta => (
          <OfferCard key={oferta.id} oferta={oferta} />
        ))}

        {/* --- Sección En Progreso (NUEVA) --- */}
        <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>En progreso</Text>
        </View>
        <View style={[styles.card, styles.inProgressCard]}>
          <Text style={styles.inProgressText}>Aún no tienes trabajos en progreso.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos adaptados de tu código y de la foto ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  greeting: { fontSize: 16, fontWeight: '500', color: '#2C3E50' },
  maestroSubtitle: { fontSize: 14, color: '#7F8C8D' },
  headerIcons: { flexDirection: 'row' },
  icon: { fontSize: 24, marginLeft: 15 },
  
  hoursText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#3498DB' },
  statLabel: { fontSize: 14, color: '#555' },
  
  searchSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50' },
  seeAll: { fontSize: 14, color: '#3498DB', fontWeight: 'bold' },
  
  card: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3 
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDate: { fontSize: 12, color: '#7F8C8D' },
  cardDuration: { fontSize: 12, color: '#7F8C8D', marginLeft: 10 },
  disponibleBadge: {
    backgroundColor: '#E0F7FA', // Color celeste claro
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 'auto',
  },
  disponibleText: { color: '#00838F', fontSize: 12, fontWeight: 'bold' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#34495E', marginBottom: 10 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 15 },
  locationText: { fontSize: 14, color: '#555', flexShrink: 1 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  price: { fontSize: 18, fontWeight: 'bold', color: '#27AE60' },
  detailsButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  detailsButtonText: { color: 'white', fontWeight: 'bold' },
  
  inProgressCard: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderWidth: 1,
    borderColor: '#EAECEE',
    backgroundColor: '#FDFEFE'
  },
  inProgressText: { fontSize: 14, color: '#7F8C8D' },
});

