// 🎯 ARCHIVO: app/(tabs2)/pagos-maestro.tsx (NUEVO)

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

// --- Datos de ejemplo para los pagos ---
// (En una app real, esto vendría de tu backend de Go)
const MOCK_PAGOS = [
  {
    id: '1',
    jobTitle: 'Reparación fuga gas',
    jobDate: '20/09/2025',
    montoCliente: 50000,
    comisionPorcentaje: 15, // 15%
    comisionMonto: 7500,
    propina: 5000,
    metodoPago: 'Transferencia',
  },
  {
    id: '2',
    jobTitle: 'Remodelación techo',
    jobDate: '15/09/2025',
    montoCliente: 30000,
    comisionPorcentaje: 15,
    comisionMonto: 4500,
    propina: 0,
    metodoPago: 'Transferencia',
  },
  {
    id: '3',
    jobTitle: 'Instalar lámpara',
    jobDate: '01/09/2025',
    montoCliente: 15000,
    comisionPorcentaje: 15,
    comisionMonto: 2250,
    propina: 2000,
    metodoPago: 'Transferencia',
  },
];

// --- Componente de Tarjeta de Pago ---
const PaymentCard = ({ pago }: { pago: (typeof MOCK_PAGOS)[0] }) => {
  const router = useRouter();

  // Calculamos el total recibido por el maestro
  const totalRecibido = (pago.montoCliente - pago.comisionMonto + pago.propina);
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('es-CL')}`; // Formato de moneda chilena
  };

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
          <Text style={styles.detailLabel}>Monto del cliente</Text>
          <Text style={styles.detailValue}>{formatCurrency(pago.montoCliente)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Comisión FixYa ({pago.comisionPorcentaje}%)</Text>
          <Text style={[styles.detailValue, styles.negativeValue]}>-{formatCurrency(pago.comisionMonto)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Propina del cliente</Text>
          <Text style={[styles.detailValue, styles.positiveValue]}>+{formatCurrency(pago.propina)}</Text>
        </View>
      </View>

      {/* Total y Método */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.totalLabel}>Total Recibido</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalRecibido)}</Text>
        </View>
        <Text style={styles.paymentMethod}>Pagado vía {pago.metodoPago}</Text>
      </View>
    </View>
  );
};

// --- Pantalla Principal de Pagos ---
export default function PagosMaestroScreen() {

  // Calcula el balance total (solo para el resumen)
  const balanceTotal = MOCK_PAGOS.reduce((acc, pago) => {
    return acc + (pago.montoCliente - pago.comisionMonto + pago.propina);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado de la pantalla */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Pagos',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'white' },
          headerTitleStyle: { fontSize: 18, fontWeight: 'bold' },
        }}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tarjeta de Balance General */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance disponible</Text>
          <Text style={styles.balanceValue}>${balanceTotal.toLocaleString('es-CL')}</Text>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>Retirar fondos</Text>
          </TouchableOpacity>
        </View>

        {/* Título de la lista */}
        <Text style={styles.listTitle}>Historial de pagos</Text>

        {/* Lista de Pagos */}
        {MOCK_PAGOS.map(pago => (
          <PaymentCard key={pago.id} pago={pago} />
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
  
  // Estilos Tarjeta de Balance
  balanceCard: {
    backgroundColor: '#34495E', // Color oscuro (puedes cambiarlo a #3498DB si prefieres azul)
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#EAECEE',
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Botón semi-transparente
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Título de la lista
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
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
    flexShrink: 1, // Permite que el texto se acorte
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
  positiveValue: {
    color: '#27AE60', // Verde
  },
  negativeValue: {
    color: '#E74C3C', // Rojo
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
    color: '#27AE60', // Verde
  },
  paymentMethod: {
    fontSize: 12,
    color: '#7F8C8D',
  },
});