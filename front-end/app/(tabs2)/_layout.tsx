// 🎯 ARCHIVO: app/(tabs2)/_layout.tsx (CORREGIDO Y CON ESTILOS)

import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- 1. COPIAMOS EL MISMO TabIcon DE TU OTRO _layout.tsx ---
// Este componente define el círculo azul para la pestaña activa.
const TabIcon = ({ iconName, name, focused }: { iconName: any; name: string; focused: boolean }) => {
  // Cambia el color del ícono y del texto si la pestaña está activa (focused)
  const iconColor = focused ? 'white' : '#7F8C8D';
  const textColor = focused ? '#3498DB' : '#7F8C8D'; // Texto azul si está activo

  return (
    <View style={styles.tabContainer}>
      {/* El círculo que envuelve al ícono */}
      <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      {/* El texto debajo del ícono */}
      <Text style={[styles.tabLabel, { color: textColor }]}>
        {name}
      </Text>
    </View>
  );
};

export default function TabLayoutMaestro() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Ocultamos la etiqueta por defecto (TabIcon ya la tiene)
        tabBarStyle: { 
          height: 80, 
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
      }}
    >
      {/* 👇 CAMBIO AQUÍ: Ahora la pestaña "Trabajos" apunta a 'indexmaestro.tsx' */}
      <Tabs.Screen
        name="indexmaestro" 
        options={{
          title: 'Trabajos',
          tabBarIcon: ({ focused }) => <TabIcon iconName="add-circle" name="Trabajos" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="historial-maestro" // app/(tabs2)/historial-maestro.tsx
        options={{
          title: 'Historial',
          tabBarIcon: ({ focused }) => <TabIcon iconName="checkmark-circle-outline" name="Historial" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pagos-maestro" // app/(tabs2)/pagos-maestro.tsx
        options={{
          title: 'Pagos',
          tabBarIcon: ({ focused }) => <TabIcon iconName="wallet-outline" name="Pagos" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perfil-maestro" // app/(tabs2)/perfil-maestro.tsx
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon iconName="person-outline" name="Perfil" focused={focused} />,
        }}
      />

       {/* --- 2. AQUÍ OCULTAMOS LAS RUTAS EXTRA --- */}
       <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      
      {/* 👇 CAMBIO AQUÍ: Ahora el archivo 'trabajos.tsx' está oculto */}
      <Tabs.Screen
        name="trabajos" 
        options={{
          href: null,
        }}
      />
      
    </Tabs>
  );
}

// --- 3. COPIAMOS LOS MISMOS ESTILOS DE TU OTRO _layout.tsx ---
const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#3498DB', // El fondo azul cuando la pestaña está activa
  },
  tabLabel: {
    fontSize: 12,
  },
});