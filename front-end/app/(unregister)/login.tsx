import { errorColor } from "@/constants/theme"
import { useAuth } from "@/hooks/auth_context"
import {
  LoginUserPayload,
  loginUserSchema
} from "@/models/user/payload"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import {
  Link,
  useRouter
} from "expo-router"
import React, { useState } from "react"; // 1. Agregado useState
import {
  Controller,
  useForm
} from "react-hook-form"
import {
  ActivityIndicator // 2. Agregado ActivityIndicator
  ,



  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native"
import {
  SafeAreaView
} from "react-native-safe-area-context"

export default function LoginScreen() {
  const {
          control,
          handleSubmit,
          formState: { errors }
        }                               = useForm( {
    resolver: zodResolver( loginUserSchema )
  } )
  const {login} = useAuth()
  const router           = useRouter()
  
  // 3. Estado de carga
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data : LoginUserPayload) => {
    setIsLoading(true) // Activar carga
    const ok = await login(data)
  }

  return (
    <SafeAreaView style={ styles.container }>
      <View style={ styles.mainContent }>
        <Text style={ styles.headerTitle }>Inicio de sesión</Text>
        <Image source={ require( "../../assets/images/logo.jpeg" ) }
               style={ styles.logo }/>
        <Controller
          control={ control }
          name="email"
          render={ ( { field: { onChange, onBlur, value } } ) => (
            <TextInput
              style={ styles.input } placeholder="Correo electronico"
              onBlur={ onBlur }
              onChangeText={ onChange }
              value={ value }
              keyboardType="email-address" autoCapitalize="none"
              placeholderTextColor="#999"
              editable={!isLoading} // Bloquear input si carga
            />
          ) }
        />
        { errors.email && <Text style={{ color: errorColor } }>{ errors.email.message }</Text> }
        <Controller
          control={ control }
          name="password"
          render={ ( { field: { onChange, onBlur, value } } ) => (
        <TextInput style={ styles.input } placeholder="Contraseña"
                   onBlur={ onBlur }
                   onChangeText={ onChange }
                   value={ value }
                   secureTextEntry placeholderTextColor="#999"
                   editable={!isLoading} // Bloquear input si carga
                   />
          ) }
        />
        { errors.password && <Text style={{ color: errorColor } }>{ errors.password.message }</Text> }
        
        {/* 4. Botón modificado con lógica de carga */}
        <Pressable 
          style={ styles.button } 
          onPress={ handleSubmit(onSubmit ) }
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <ActivityIndicator size="small" color="white" />
              <Text style={ styles.buttonText }>Iniciando sesión...</Text>
            </View>
          ) : (
            <Text style={ styles.buttonText }>Iniciar sesión</Text>
          )}
        </Pressable>

        {/*<Link href="/(unregister)/forgot-password"*/ }
        {/* style={ styles.forgotPasswordLink }>*/ }
        {/* <Text style={ styles.forgotPasswordText }>OLVIDE MI CONTRASEÑA</Text>*/ }
        {/*</Link>*/ }
      </View>

      <View style={ styles.footer }>
        <Text style={ styles.footerText }>
          ¿No tienes cuenta?{ " " }
          <Link href="/(unregister)" style={ styles.link } replace>
            Registrate acá
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  )
}

// Añadimos/modificamos los estilos necesarios
const styles = StyleSheet.create( {
  container  : { flex: 1, backgroundColor: "#F7F8FA" },
  mainContent: { flex: 1, justifyContent: "center", paddingHorizontal: 40 },
  headerTitle: {
    fontSize    : 24,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginBottom: 40
  },
  logo       : {
    width       : 100,
    height      : 100,
    resizeMode  : "contain",
    borderRadius: 20,
    alignSelf   : "center",
    marginBottom: 60
  },
  input      : {
    fontSize         : 16,
    paddingVertical  : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom     : 25
  },
  button     : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 20,
    flexDirection: 'row', // Asegura centrado si hay icono
    justifyContent: 'center'
  },
  buttonText : { color: "white", fontSize: 16, fontWeight: "bold" },
  // Estilos para el Link
  forgotPasswordLink: {
    marginTop: 20,
    alignSelf: "center"
  },
  forgotPasswordText: {
    color     : "#7F8C8D",
    textAlign : "center",
    fontWeight: "bold"
  },
  footer            : { paddingBottom: 40, alignItems: "center" },
  footerText        : { fontSize: 14, color: "#7F8C8D" },
  link              : { color: "#3498DB", fontWeight: "bold" }
} )