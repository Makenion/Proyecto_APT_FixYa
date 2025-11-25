import { useRouter } from "expo-router"
import React from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import {
  SafeAreaView
} from "react-native-safe-area-context"

export default function WorkerRegisterSuccess() {
  const router = useRouter()

  const handleGoToHome = () => {
    console.log("router a protected worker-tabs")
    router.replace( "/(protected)/(worker-tabs)" )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <View style={ styles.mainContent }>
        <Text style={ styles.title }>¡Felicidades! ya eres parte de nuestro
          equipo de trabajo.</Text>

        {/* Ajuste en la ruta de la imagen para que coincida con la estructura */ }
        <Image source={ require( "../../../assets/images/logo.jpeg" ) }
               style={ styles.logo }/>

        <Text style={ styles.subtitle }>Recuerda completar tu perfil profesional
          y leer nuestra políticas de servicio.</Text>

        <Pressable style={ styles.button } onPress={ handleGoToHome }>
          <Text style={ styles.buttonText }>Ir a inicio</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container  : {
    flex           : 1,
    backgroundColor: "#F7F8FA",
    justifyContent : "center",
    alignItems     : "center"
  },
  mainContent: { alignItems: "center", paddingHorizontal: 40 },
  title      : {
    fontSize    : 22,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginBottom: 40
  },
  logo       : {
    width       : 120,
    height      : 120,
    resizeMode  : "contain",
    marginBottom: 40
  },
  subtitle   : {
    fontSize    : 16,
    color       : "#7F8C8D",
    textAlign   : "center",
    marginBottom: 60
  },
  button     : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    width          : "100%",
    maxWidth       : 250
  },
  buttonText : { color: "white", fontSize: 16, fontWeight: "bold" }
} )
