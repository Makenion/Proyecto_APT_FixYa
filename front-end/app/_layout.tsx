import { Stack }            from "expo-router"
import React, { useEffect } from "react"
import "../global.css"
import { PortalHost }       from "@rn-primitives/portal"
import { ThemeProvider }    from "@react-navigation/native"
import { NAV_THEME }        from "@/lib/theme"
import { StatusBar }        from "expo-status-bar"

import { useColorScheme }                   from "nativewind"
import { AuthProvider, useAuth }            from "@/hooks/auth_context"
import { setupAuthInterceptor }             from "@/lib/api"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Toaster }                          from "sonner-native"
import { GestureHandlerRootView }           from "react-native-gesture-handler"

const AuthInterceptorSetup = () => {
  const { logout } = useAuth()
  useEffect( () => {
    setupAuthInterceptor( logout )
  }, [logout] )
  return null
}
const queryClient          = new QueryClient()

export default function RootLayout() {
  const { colorScheme } = useColorScheme()
  const activeTheme     = NAV_THEME[colorScheme === "dark" ? "dark" : "light"]
  return (
    <QueryClientProvider client={ queryClient }>
      <GestureHandlerRootView>
        <ThemeProvider value={ activeTheme }>
          <AuthProvider>
            <AuthInterceptorSetup/>
            <StatusBar style={ colorScheme === "dark" ? "light" : "dark" }/>
            <Stack>
              <Stack.Screen name="index" options={ { headerShown: false } }/>
              <Stack.Screen name="(protected)"
                            options={ { headerShown: false } }/>
              <Stack.Screen name="(unregister)"
                            options={ { headerShown: false } }/>
              <Stack.Screen name="(auth)" options={ { headerShown: false } }/>
              <Stack.Screen name="(tabs)" options={ { headerShown: false } }/>
              <Stack.Screen name="(maestro)"
                            options={ { headerShown: false } }/>
              <Stack.Screen
                name="remodelaciones-form"
                options={ {
                  headerShown : true,
                  title       : "Formulario de remodelaciones",
                  presentation: "modal"
                } }
              />
              <Stack.Screen
                name="remodelaciones-form-step2"
                options={ {
                  headerShown: true,
                  title      : "Formulario de remodelaciones"
                } }
              />
              <Stack.Screen
                name="solicitud-enviada"
                options={ {
                  headerShown : false,
                  presentation: "transparentModal",
                  animation   : "fade"
                } }
              />
              <Stack.Screen
                name="buscar-maestros"
                options={ {
                  headerShown: true,
                  title      : "Buscar maestros"
                } }
              />

              <Stack.Screen
                name="maestro-profile"
                options={ {
                  headerShown: true,
                  title      : "Perfil de maestro"
                } }
              />

              <Stack.Screen
                name="cancelar-solicitud-modal"
                options={ {
                  headerShown : false,
                  presentation: "transparentModal",
                  animation   : "fade"
                } }
              />
            </Stack>
            <PortalHost/>
            <Toaster/>
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}