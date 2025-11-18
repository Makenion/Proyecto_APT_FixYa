// 🎯 ARCHIVO: app/(tabs)/pagos.tsx (NUEVO o EDITADO)

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

// --- Datos de ejemplo para los pagos del CLIENTE ---
const MOCK_PAGOS_CLIENTE = [
  {
    id: '1',
    jobTitle: 'Mueble cocina',
    jobDate: '20/09/2025',
    montoPagado: 50000, // Costo del servicio
    propina: 5000,      // Propina adicional
    metodoPago: 'Tarjeta de Crédito',
  },
  {
    id: '2',
    jobTitle: 'Instalar lámpara',
    jobDate: '15/09/2025',
    montoPagado: 15000,
    propina: 0,
    metodoPago: 'Tarjeta de Débito',
  },
  {
    id: '3',
    jobTitle: 'Reparación enchufe',
    jobDate: '01/09/2025',
    montoPagado: 20000,
    propina: 2000,
    metodoPago: 'Tarjeta de Crédito',
  },
];

// --- Función para formatear moneda ---
const formatCurrency = (value: number) => {
  return `$${value.toLocaleString('es-CL')}`; // Formato de moneda chilena
};

// --- Componente de Tarjeta de Pago del Cliente ---
const PaymentCardCliente = ({ pago }: { pago: (typeof MOCK_PAGOS_CLIENTE)[0] }) => {
  const router = useRouter();
  
  // El total es el monto + la propina
  const totalPagado = pago.montoPagado + pago.propina;

  return (
    <View style={styles.card}>
      {/* Encabezado de la tarjeta */}
      <View style={styles.cardHeader}>
        <Text style={styles.jobTitle}>{pago.jobTitle}</Text>
        <Text style={styles.jobDate}>{pago.jobDate}</Text>
      </View>

      {/* Detalles del pago */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Monto pagado</Text>
          <Text style={styles.detailValue}>{formatCurrency(pago.montoPagado)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Propina entregada</Text>
          <Text style={styles.detailValue}>{formatCurrency(pago.propina)}</Text>
        </View>
      </View>

      {/* Total y Método */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.totalLabel}>Total pagado</Text>
          {/* El total es un gasto, así que lo ponemos en color oscuro o rojo */}
          <Text style={styles.totalValue}>{formatCurrency(totalPagado)}</Text>
        </View>
        <Text style={styles.paymentMethod}>Vía {pago.metodoPago}</Text>
      </View>
    </View>
  );
};

// --- Pantalla Principal de Pagos del Cliente ---
export default function PagosClienteScreen() {

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado de la pantalla */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Historial de Pagos', // Título más descriptivo
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'white' }, // Fondo blanco
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* No hay tarjeta de balance */}

        {/* Lista de Pagos */}
        {MOCK_PAGOS_CLIENTE.map(pago => (
          <PaymentCardCliente key={pago.id} pago={pago} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS (similares al historial de maestro) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' }, // Fondo gris claro
  scrollContent: { 
    padding: 20,
    paddingBottom: 40,
  },
  
  // Estilos Tarjeta de Pago
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flexShrink: 1,
  },
  jobDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E74C3C', // Rojo para el gasto total del cliente
  },
  paymentMethod: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});