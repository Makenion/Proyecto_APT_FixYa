import { Stack } from "expo-router"
import React     from "react"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={ { headerShown: false } }/>
      <Stack.Screen name="login" options={ { headerShown: false } }/>
      {/*<Stack.Screen name="forgot-password" options={ { headerShown: false } }/>*/}
      {/*<Stack.Screen name="verify-code" options={ { headerShown: false } }/>*/}
      <Stack.Screen name="(user-register)" options={ { headerShown: false } }/>
      <Stack.Screen name="(worker-register)" options={ { headerShown: false } }/>
    </Stack>
  )
}