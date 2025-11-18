// 🎯 ARCHIVO: app/solicitud-enviada.tsx

import React                                 from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useRouter }                         from "expo-router"
import { Ionicons }                          from "@expo/vector-icons"
import {
  SafeAreaView
}                                            from "react-native-safe-area-context"

export default function SolicitudEnviadaModal() {
  const router = useRouter()

  const handleAccept = () => {
    // Este comando te llevará a la pantalla principal del usuario, reemplazando todo el flujo del formulario.
    router.replace( "/(tabs)" )
  }

  return (
    // SafeAreaView para asegurar que el contenido esté visible
    <SafeAreaView style={ styles.container }>
      {/* El contenido real del modal (la tarjeta blanca) */ }
      <View style={ styles.modalContent }>

        {/* Usamos un ícono de Ionicons que se parece al de tu diseño */ }
        <Ionicons name="thumbs-up" size={ 80 } color="#3498DB"/>

        <Text style={ styles.title }>¡Tu solicitud ha sido ingresada!</Text>
        <Text style={ styles.subtitle }>
          Uno de nuestros trabajadores la revisará y te responderá a la
          brevedad.
        </Text>

        <Pressable style={ styles.button } onPress={ handleAccept }>
          <Text style={ styles.buttonText }>Aceptar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  // El contenedor principal es transparente y centra la tarjeta
  container: {
    flex           : 1,
    justifyContent : "center",
    alignItems     : "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)" // Fondo semi-transparente
  },
  // La tarjeta blanca
  modalContent: {
    backgroundColor: "white",
    borderRadius   : 20,
    padding        : 30,
    alignItems     : "center",
    width          : "85%",
    maxWidth       : 350,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 2 },
    shadowOpacity  : 0.25,
    shadowRadius   : 4,
    elevation      : 5
  },
  title       : {
    fontSize    : 22,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginTop   : 20,
    marginBottom: 10
  },
  subtitle    : {
    fontSize    : 16,
    color       : "#7F8C8D",
    textAlign   : "center",
    marginBottom: 30,
    lineHeight  : 24
  },
  button      : {
    backgroundColor: "#3498DB",
    paddingVertical: 15,
    borderRadius   : 30,
    alignItems     : "center",
    width          : "100%"
  },
  buttonText  : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )