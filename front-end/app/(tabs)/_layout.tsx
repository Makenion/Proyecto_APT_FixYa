// 🎯 ARCHIVO: app/(tabs)/_layout.tsx (EDITADO)

import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- CÓDIGO DEL TABICON QUE FALTABA ---
// Este componente define cómo se ve cada botón de la barra de pestañas.
const TabIcon = ({ iconName, name, focused }: { iconName: any; name: string; focused: boolean }) => {
  // Cambia el color del ícono y del texto si la pestaña está activa (focused)
  const iconColor = focused ? 'white' : '#7F8C8D';
  const textColor = focused ? '#3498DB' : '#7F8C8D';

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

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { 
          height: 80, 
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
        },
      }}
    >
      {/* --- PESTAÑAS VISIBLES --- */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ focused }) => <TabIcon iconName="add-circle" name="Buscar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="solicitudes"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ focused }) => <TabIcon iconName="checkmark-circle-outline" name="Solicitudes" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="pagos"
        options={{
          title: 'Pagos',
          tabBarIcon: ({ focused }) => <TabIcon iconName="wallet-outline" name="Pagos" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => <TabIcon iconName="person-outline" name="Perfil" focused={focused} />,
        }}
      />

      {/* --- PANTALLAS OCULTAS DE LA BARRA --- */}
       <Tabs.Screen
        name="buscar-maestros"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="editar-solicitud"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
      
      {/* 👇 PANTALLAS AÑADIDAS PARA QUITAR LA FLECHA */}
      <Tabs.Screen
        name="indexmaestro"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="informacion-bancaria"
        options={{
          href: null,
        }}
      />
      
    </Tabs>
  );
}

// --- ESTILOS PARA EL TABICON QUE FALTABAN ---
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