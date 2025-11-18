import React                                 from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import {
  SafeAreaView
}                                            from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter }   from "expo-router"
import { Ionicons }                          from "@expo/vector-icons"

export default function CancelarSolicitudModal() {
  const router        = useRouter()
  const { requestId } = useLocalSearchParams()

  // Esta función se ejecutaría si el usuario confirma la cancelación
  const handleConfirmCancel = () => {
    console.log( `Solicitud ID: ${ requestId } ha sido cancelada.` )
    // Aquí iría la lógica para llamar a tu backend de Go y actualizar el estado.

    // Cerramos el modal
    router.back()
  }

  // Esta función simplemente cierra el modal
  const handleGoBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={ styles.container }>
      <View style={ styles.modalContent }>

        <View style={ styles.iconCircle }>
          <Ionicons name="remove-outline" size={ 40 } color="#3498DB"/>
        </View>

        <Text style={ styles.title }>¿Seguro que deseas cancelar esta
          solicitud?</Text>
        <Text style={ styles.subtitle }>
          Podrás crear una nueva en el inicio de la aplicación.
        </Text>

        <Pressable style={ styles.buttonSolid } onPress={ handleConfirmCancel }>
          <Text style={ styles.buttonTextSolid }>Cancelar solicitud</Text>
        </Pressable>

        <Pressable style={ styles.buttonOutline } onPress={ handleGoBack }>
          <Text style={ styles.buttonTextOutline }>Volver</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container        : {
    flex           : 1,
    justifyContent : "center",
    alignItems     : "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent     : {
    backgroundColor: "white",
    borderRadius   : 20,
    padding        : 30,
    alignItems     : "center",
    width          : "85%",
    maxWidth       : 350
  },
  iconCircle       : {
    width         : 70,
    height        : 70,
    borderRadius  : 35,
    borderWidth   : 2,
    borderColor   : "#3498DB",
    justifyContent: "center",
    alignItems    : "center",
    marginBottom  : 20
  },
  title            : {
    fontSize    : 20,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginBottom: 10
  },
  subtitle         : {
    fontSize    : 16,
    color       : "#7F8C8D",
    textAlign   : "center",
    marginBottom: 30
  },
  buttonSolid      : {
    backgroundColor: "#3498DB",
    paddingVertical: 15,
    borderRadius   : 30,
    alignItems     : "center",
    width          : "100%",
    marginBottom   : 10
  },
  buttonTextSolid  : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  },
  buttonOutline    : {
    backgroundColor: "#E0F0FF", // Un azul más claro para el fondo
    paddingVertical: 15,
    borderRadius   : 30,
    alignItems     : "center",
    width          : "100%"
  },
  buttonTextOutline: {
    color     : "#3498DB", // Texto azul
    fontSize  : 16,
    fontWeight: "bold"
  }
} )