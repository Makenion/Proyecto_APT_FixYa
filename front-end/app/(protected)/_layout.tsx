import { Stack, useRouter }        from "expo-router"
import React, { useEffect }        from "react"
import { useAuth }                 from "@/hooks/auth_context"
import { ActivityIndicator, View } from "react-native"
import { UserTypeEnum }            from "@/models/user/response"

export default function RootLayout() {
  const { user, worker, isLoading } = useAuth()
  const router              = useRouter()

  useEffect( () => {
    if ( isLoading ) {
      return
    }
    if ( !user ) {
      console.log( "Acceso no autorizado, redirigiendo" )
      router.replace( "/(unregister)/login" )
    }
    // if(user?.user_type === UserTypeEnum.Worker && (!worker || worker.certificates.length === 0)){
    //   router.replace( "/(unregister)/(worker-register)/step2" )
    // }
  }, [isLoading, user, worker, router] )


  if ( isLoading ) {
    return (
      <View
        style={ { flex: 1, justifyContent: "center", alignItems: "center" } }>
        <ActivityIndicator size="large"/>
      </View>
    )
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={ { headerShown: false } }/>
      <Stack.Screen name="(worker-tabs)" options={ { headerShown: false } }/>
      <Stack.Screen name="(client-tabs)" options={ { headerShown: false } }/>
    </Stack>
  )
}