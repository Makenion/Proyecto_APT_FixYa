// 🎯 ARCHIVO: app/(maestro)/documentos.tsx (NUEVO)

import React                                             from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Stack, useRouter }                              from "expo-router"
import {
  Ionicons
}                                                        from "@expo/vector-icons"
import {
  SafeAreaView
}                                                        from "react-native-safe-area-context"

// --- Componente Reutilizable para el Botón de Subida ---
const UploadButton = ( { label, onPress }: {
  label: string;
  onPress: () => void
} ) => {
  return (
    <Pressable style={ styles.uploadButton } onPress={ onPress }>
      <Text style={ styles.uploadLabel }>{ label }</Text>
      <Ionicons name="cloud-upload-outline" size={ 24 } color="#555"/>
    </Pressable>
  )
}

export default function DocumentosScreen() {
  const router = useRouter()

  // --- Funciones Placeholder para la subida ---
  // Aquí deberías integrar tu lógica para seleccionar y subir archivos
  const handleUploadCarnetFrontal        = () => {
    console.log( "Subir carnet frontal..." )
    // Lógica para seleccionar archivo (ej. usando expo-document-picker o expo-image-picker)
  }
  const handleUploadCarnetTrasera        = () => {
    console.log( "Subir carnet trasera..." )
  }
  const handleUploadCertificacionEmpresa = () => {
    console.log( "Subir certificación empresa..." )
  }
  const handleUploadOtros                = () => {
    console.log( "Subir otras certificaciones..." )
  }

  const handleGuardar = () => {
    console.log( "Guardando documentos..." )
    // Lógica para confirmar/guardar los documentos subidos
    router.back() // Volver al perfil
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* Configura la barra de título con la flecha de atrás */ }
      <Stack.Screen
        options={ {
          headerShown        : true,
          title              : "Documentos",
          headerShadowVisible: false,
          headerStyle        : { backgroundColor: "#F7F8FA" }
        } }
      />

      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* Botones de subida */ }
        <UploadButton label="Foto carnet frontal"
                      onPress={ handleUploadCarnetFrontal }/>
        <UploadButton label="Foto carnet trasera"
                      onPress={ handleUploadCarnetTrasera }/>
        <UploadButton label="Certificación por empresa"
                      onPress={ handleUploadCertificacionEmpresa }/>

        {/* Sección de certificaciones adicionales */ }
        <Text style={ styles.sectionTitle }>
          Si cuentas con más certificaciones y/o cursos, adjúntalos acá
          porfavor:
        </Text>
        <UploadButton label="" onPress={ handleUploadOtros }/>
        {/* Dejamos el label vacío como en tu diseño */ }

      </ScrollView>

      {/* Botón de Guardar fijo abajo */ }
      <View style={ styles.footer }>
        <Pressable style={ styles.saveButton } onPress={ handleGuardar }>
          <Text style={ styles.saveButtonText }>Guardar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container     : {
    flex           : 1,
    backgroundColor: "#F7F8FA" // Fondo gris claro
  },
  scrollContent : {
    padding      : 20,
    paddingBottom: 100 // Espacio para el botón fijo
  },
  uploadButton  : {
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center",
    backgroundColor  : "white",
    paddingVertical  : 15,
    paddingHorizontal: 20,
    borderRadius     : 8,
    borderWidth      : 1,
    borderColor      : "#E0E0E0",
    marginBottom     : 15
  },
  uploadLabel   : {
    fontSize: 16,
    color   : "#333"
  },
  sectionTitle  : {
    fontSize    : 15,
    color       : "#555",
    marginTop   : 25,
    marginBottom: 10,
    lineHeight  : 22
  },
  footer        : {
    position       : "absolute",
    bottom         : 0,
    left           : 0,
    right          : 0,
    backgroundColor: "#F7F8FA", // Mismo fondo que la pantalla
    padding        : 20,
    paddingBottom  : 30
  },
  saveButton    : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  saveButtonText: {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )