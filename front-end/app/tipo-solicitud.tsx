// 🎯 ARCHIVO: app/tipo-solicitud.tsx (NUEVO)

import React                                      from "react"
import { Pressable, StyleSheet, Text, View }      from "react-native"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons }                               from "@expo/vector-icons"
import {
  SafeAreaView
}                                                 from "react-native-safe-area-context"

export default function TipoSolicitudScreen() {
  const router                       = useRouter()
  // Recibimos los datos del maestro de la pantalla anterior
  const { maestroId, maestroNombre } = useLocalSearchParams()

  // Función para navegar al formulario correspondiente
  const handleSelectTipo = ( tipo: "arreglo" | "remodelacion" ) => {

    // Asumimos que tienes dos formularios:
    // 1. app/formulario-arreglos.tsx (el que ya creamos)
    // 2. app/formulario-remodelaciones.tsx (para el otro botón)

    const pathname = tipo === "arreglo"
      ? "/formulario-arreglos"
      : "/remodelaciones-form" // Asegúrate de que esta ruta exista

    // Navegamos al formulario y le pasamos los datos del maestro
    router.push( {
      pathname: pathname,
      params  : {
        maestroId    : maestroId,
        maestroNombre: maestroNombre
        // Puedes añadir 'tipo' si el formulario necesita saberlo
      }
    } )
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* Encabezado con flecha de atrás */ }
      <Stack.Screen
        options={ {
          headerShown        : true,
          title              : "Nueva Solicitud",
          headerShadowVisible: false,
          headerStyle        : { backgroundColor: "#F7F8FA" }
        } }
      />

      <View style={ styles.content }>
        <Ionicons name="build-outline" size={ 60 } color="#3498DB"/>
        <Text style={ styles.title }>¿Para qué lo deseas solicitar?</Text>
        <Text style={ styles.subtitle }>
          Estás solicitando a: <Text
          style={ { fontWeight: "bold" } }>{ maestroNombre ||
          "Maestro seleccionado" }</Text>
        </Text>

        {/* Botón Arreglo */ }
        <Pressable style={ styles.button }
                   onPress={ () => handleSelectTipo( "arreglo" ) }>
          <Ionicons name="hammer-outline" size={ 22 } color="white"/>
          <Text style={ styles.buttonText }>Para un Arreglo</Text>
        </Pressable>

        {/* Botón Remodelación */ }
        <Pressable style={ styles.button }
                   onPress={ () => handleSelectTipo( "remodelacion" ) }>
          <Ionicons name="home-outline" size={ 22 } color="white"/>
          <Text style={ styles.buttonText }>Para una Remodelación</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container : {
    flex           : 1,
    backgroundColor: "#F7F8FA"
  },
  content   : {
    flex          : 1,
    justifyContent: "center",
    alignItems    : "center",
    padding       : 20
  },
  title     : {
    fontSize    : 24,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginTop   : 15,
    marginBottom: 10
  },
  subtitle  : {
    fontSize    : 16,
    color       : "#555",
    textAlign   : "center",
    marginBottom: 40
  },
  button    : {
    backgroundColor: "#3498DB",
    flexDirection  : "row", // Para poner icono al lado del texto
    alignItems     : "center",
    justifyContent : "center",
    paddingVertical: 18,
    borderRadius   : 30,
    marginBottom   : 15,
    width          : "100%",
    gap            : 10 // Espacio entre icono y texto
  },
  buttonText: {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )