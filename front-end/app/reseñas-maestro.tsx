// 🎯 ARCHIVO: app/(maestro)/reseñas.tsx (NUEVO)

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Datos de ejemplo para las Reseñas ---
const MOCK_REVIEWS = [
  {
    id: '1',
    jobTitle: 'Reparación fuga gas',
    rating: 5,
    comment: '¡Excelente servicio! Muy rápido y profesional. Resolvió el problema en minutos.',
    clientName: 'Ana Contreras',
    date: '22/10/2025',
  },
  {
    id: '2',
    jobTitle: 'Pintura Habitación',
    rating: 4,
    comment: 'Quedó muy bien el trabajo, aunque demoró un día más de lo presupuestado. El resultado final es bueno.',
    clientName: 'Roberto Muñoz',
    date: '15/10/2025',
  },
  {
    id: '3',
    jobTitle: 'Instalar Lámpara',
    rating: 5,
    comment: 'Súper amable y cuidadoso. Lo recomiendo.',
    clientName: 'Carla Silva',
    date: '01/10/2025',
  },
];

// --- Componente para mostrar Estrellas ---
const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={18}
        color="#FFC107" // Amarillo
      />
    );
  }
  return <View style={styles.starsContainer}>{stars}</View>;
};

// --- Componente de Tarjeta de Reseña ---
const ReviewCard = ({ review }: { review: (typeof MOCK_REVIEWS)[0] }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.jobTitle}>{review.jobTitle}</Text>
      <RatingStars rating={review.rating} />
      <Text style={styles.commentText}>{review.comment}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.clientName}>{review.clientName}</Text>
        <Text style={styles.dateText}>{review.date}</Text>
      </View>
    </View>
  );
};


export default function ReseñasScreen() {
  const router = useRouter();
  // Obtenemos el ID del maestro (si lo pasamos desde el perfil)
  const { maestroId, maestroNombre } = useLocalSearchParams();

  // Aquí harías la llamada a tu backend con 'maestroId' para obtener las reseñas reales

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado con flecha de atrás */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: `Reseñas de ${maestroNombre || 'Maestro'}`,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F7F8FA' }
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Aquí podrías poner un resumen de calificaciones si quisieras */}
        
        {/* Lista de Reseñas */}
        {MOCK_REVIEWS.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { 
    padding: 20,
    paddingBottom: 40,
  },
  
  // Estilos Tarjeta de Reseña
  card: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    elevation: 3 
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  commentText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  clientName: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});