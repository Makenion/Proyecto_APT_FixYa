import React, { useState } from "react"
import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native"
import {
  Link
}                          from "expo-router"
import {
  SafeAreaView
}                          from "react-native-safe-area-context"
import {
  Controller,
  useForm
}                          from "react-hook-form"
import {
  zodResolver
}                          from "@hookform/resolvers/zod"
import {
  LoginUserPayload,
  loginUserSchema
}                                    from "@/models/user/payload"
import { errorColor } from "@/constants/theme"
import { toast } from 'sonner-native';

export default function LoginScreen() {
  const {
          control,
          handleSubmit,
          formState: { errors }
        }                       = useForm( {
    resolver: zodResolver( loginUserSchema )
  } )

  const onSubmit = (data : LoginUserPayload) => {
    console.log( "Intentando iniciar sesión con:", data )
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
                   secureTextEntry placeholderTextColor="#999"/>
          ) }
        />
        { errors.password && <Text style={{ color: errorColor } }>{ errors.password.message }</Text> }
        <Pressable style={ styles.button } onPress={ handleSubmit(onSubmit ) }>
          <Text style={ styles.buttonText }>Iniciar sesión</Text>
        </Pressable>
        {/*<Link href="/(unregister)/forgot-password"*/ }
        {/*      style={ styles.forgotPasswordLink }>*/ }
        {/*  <Text style={ styles.forgotPasswordText }>OLVIDE MI CONTRASEÑA</Text>*/ }
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
    marginTop      : 20
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