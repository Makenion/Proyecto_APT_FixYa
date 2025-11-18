// 🎯 ARCHIVO: app/(auth)/(user-register)/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';

export default function UserRegisterLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="step1"
        options={{
          headerShown: true,
          title: 'Registro',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="step2"
        options={{
          headerShown: true,
          title: 'Registro',
          headerBackTitle: 'Atrás',
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}