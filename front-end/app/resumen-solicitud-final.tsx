import React                                             from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Stack, useLocalSearchParams, useRouter }        from "expo-router"
import {
  SafeAreaView
}                                                        from "react-native-safe-area-context"

export default function ResumenSolicitudFinalScreen() {
  const router = useRouter()
  // Leemos los parámetros que vienen del formulario
  const {
          titulo,
          tipoTrabajador,
          descripcion,
          fechaEntrega,
          comuna,
          direccion
        }      = useLocalSearchParams()

  const handleFinalizar = () => {
    console.log( "Finalizando solicitud:", {
      titulo,
      tipoTrabajador,
      descripcion,
      fechaEntrega,
      comuna,
      direccion
    } )
    // Aquí iría la lógica para enviar la solicitud final al backend
    // Después, probablemente quieras navegar a la pantalla de "Solicitudes" del usuario
    alert( "Solicitud enviada con éxito (simulación)" ) // Placeholder
    // Ejemplo de navegación (ajusta la ruta si es necesario):
    // router.replace('/(tabs)/solicitudes');
    router.replace( "/(tabs)/" ) // O volver al inicio de usuario
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* Configura la barra de título con la flecha de atrás */ }
      <Stack.Screen
        options={ {
          headerShown        : true,
          title              : "Resumen de solicitud", // Título como en la imagen
          headerShadowVisible: false,
          headerStyle        : { backgroundColor: "white" }
        } }
      />

      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* Mostramos los datos recibidos */ }
        <Text style={ styles.title }>{ titulo ||
          "Título no especificado" }</Text>
        <Text style={ styles.info }>
          <Text style={ styles.infoLabel }>Necesito: </Text>
          { tipoTrabajador || "Tipo no especificado" }
        </Text>
        <Text style={ styles.info }>
          <Text style={ styles.infoLabel }>Fecha entrega: </Text>
          { fechaEntrega || "Fecha no especificada" }
        </Text>
        <Text style={ styles.info }>
          <Text style={ styles.infoLabel }>Dirección: </Text>
          { direccion
            ? `${ direccion }, ${ comuna }`
            : "Dirección no especificada" }
        </Text>

        {/* Placeholder del Mapa */ }
        <View style={ styles.mapPlaceholder }>
          <Text style={ styles.mapText }>[Aquí va el componente de Mapa]</Text>
        </View>

        <Text style={ styles.infoLabel }>Descripción:</Text>
        <Text style={ styles.info }>
          { descripcion || "Sin descripción." }
          {/* Podrías añadir "Ver más" si la descripción es larga */ }
        </Text>

      </ScrollView>

      {/* Botón Finalizar fijo abajo */ }
      <View style={ styles.footer }>
        <Pressable style={ styles.finalizeButton } onPress={ handleFinalizar }>
          <Text style={ styles.finalizeButtonText }>Finalizar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container     : { flex: 1, backgroundColor: "white" },
  scrollContent : {
    padding      : 20,
    paddingBottom: 100 // Espacio para el botón fijo
  },
  title         : {
    fontSize    : 20, // Un poco más pequeño
    fontWeight  : "bold",
    marginBottom: 15,
    color       : "#2C3E50"
  },
  info          : {
    fontSize    : 16,
    color       : "#34495E",
    marginBottom: 10,
    lineHeight  : 22
  },
  infoLabel     : {
    fontWeight: "bold",
    color     : "#2C3E50"
  },
  mapPlaceholder: {
    height         : 200,
    backgroundColor: "#EAECEE",
    borderRadius   : 10,
    justifyContent : "center",
    alignItems     : "center",
    marginVertical : 20
  },
  mapText       : {
    color   : "#7F8C8D",
    fontSize: 16
  },
  // Footer y Botón Finalizar
  footer            : {
    position         : "absolute",
    bottom           : 0,
    left             : 0,
    right            : 0,
    backgroundColor  : "white",
    paddingVertical  : 15,
    paddingHorizontal: 20,
    borderTopWidth   : 1,
    borderTopColor   : "#F0F0F0"
  },
  finalizeButton    : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  finalizeButtonText: {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )