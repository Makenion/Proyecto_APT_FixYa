// 🎯 ARCHIVO: app/_layout.tsx (CON LA RUTA DEL MAESTRO AÑADIDA)

import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack>
      {/* Estas son las secciones que tu app conoce a nivel raíz */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
  
      {/* Le decimos al navegador principal que la sección del maestro existe. */}
      <Stack.Screen name="(maestro)" options={{ headerShown: false }} />
    </Stack>
  );
}