import { Stack } from "expo-router"
import React     from "react"

export default function WorkerRegisterLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="step1"
        options={ {
          headerShown    : true, // Queremos mostrar la cabecera
          title          : "Registro", // Título para el Step 1
          headerBackTitle: "Atrás" // Texto del botón de atrás en iOS
        } }
      />
      <Stack.Screen
        name="step2"
        options={ {
          headerShown    : true,
          title          : "Registro", // Título para el Step 2
          headerBackTitle: "Atrás"
        } }
      />
      <Stack.Screen
        name="success"
        options={ {
          headerShown : false, // La pantalla final no necesita cabecera ni botón de atrás
          presentation: "modal" // Puede aparecer como un modal si lo deseas, o 'card'
        } }
      />
    </Stack>
  )
}