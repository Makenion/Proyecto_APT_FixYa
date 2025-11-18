import React, { useState } from "react"
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
}                          from "react-native"
import {
  SafeAreaView
}                          from "react-native-safe-area-context"
import {
  useLocalSearchParams,
  useRouter
}                          from "expo-router"
import {
  Ionicons
}                          from "@expo/vector-icons"

export default function EstadoSolicitudScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  // --- Datos de ejemplo ---
  const estado = {
    estado       : "Aceptado",
    fotos        : [
      "https://placehold.co/80x80/grey/white?text=Foto+1",
      "https://placehold.co/80x80/grey/white?text=Foto+2"
    ],
    notas        : "Se realizó la evaluación para la confección de mueble de cocina..",
    estadoEntrega: "A tiempo"
  }

  const [isNotasExpanded, setIsNotasExpanded] = useState( false )

  return (
    <SafeAreaView style={ styles.container }>

      {/* --- HEADER MANUAL CORREGIDO --- */ }
      <View style={ styles.headerContainer }>
        <Pressable
          style={ styles.backButton } // Estilo actualizado
          onPress={ () => router.back() } // La función es correcta
        >
          {/* 👇 Faltaba el ícono aquí 👇 */ }
          <Ionicons name="arrow-back-outline" size={ 28 } color="#333"/>
        </Pressable>
        <Text style={ styles.headerTitle }>Estado de solicitud</Text>
        {/* Espaciador para centrar el título correctamente */ }
        <View style={ styles.headerSpacer }/>
      </View>

      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* ... (el resto de tu contenido) ... */ }
        <View style={ styles.infoSection }>
          <View style={ styles.infoRow }>
            <Text style={ styles.label }>Estado:</Text>
            <Text style={ styles.value }>{ estado.estado }</Text>
          </View>
          <Text style={ styles.label }>Fotos de trabajo:</Text>
          <View style={ styles.photosContainer }>
            { estado.fotos.map( ( uri, index ) => (
              <Image key={ index } source={ { uri } } style={ styles.photo }/>
            ) ) }
          </View>
          <Text style={ styles.label }>Notas de trabajador:</Text>
          <Text
            style={ styles.value }
            numberOfLines={ isNotasExpanded ? undefined : 2 }
            ellipsizeMode="tail"
          >
            { estado.notas }
            <Text style={ styles.verMas }
                  onPress={ () => setIsNotasExpanded( !isNotasExpanded ) }>
              { isNotasExpanded ? " Ver menos" : " Ver más" }
            </Text>
          </Text>
          <View style={ styles.deliveryStatus }>
            <Text style={ styles.label }>Estado de entrega: </Text>
            <Text style={ styles.value }>{ estado.estadoEntrega } </Text>
            <Ionicons name="checkmark-circle" size={ 20 } color="#3498DB"/>
          </View>
        </View>
      </ScrollView>

      {/* --- Tarjeta de Soporte (fija abajo) --- */ }
      <View style={ styles.supportBox }>
        <Text style={ styles.supportTitle }>La seguridad de nuestros clientes es
          primordial para nuestra empresa</Text>
        <Text style={ styles.supportText }>Si necesitas ayuda con esta solicitud
          o estás presentando un problema con el trabajador contactanos y te
          atenderemos a la brevedad.</Text>

        {/* 👇 AQUÍ ESTÁ LA RUTA AÑADIDA 👇 */ }
        <Pressable
          style={ styles.supportButton }
          onPress={ () => router.push(
            `/soporte-solicitud/${ id }` ) } // Navega a la pantalla de soporte
        >
          <Text style={ styles.supportButtonText }>Soporte</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

// --- ESTILOS CORREGIDOS ---
const styles = StyleSheet.create( {
  container: {
    flex           : 1,
    backgroundColor: "#F7F8FA"
  },
  // --- ESTILOS PARA EL HEADER MANUAL ---
  headerContainer: {
    flexDirection    : "row",
    alignItems       : "center",
    justifyContent   : "space-between",
    paddingHorizontal: 15,
    paddingVertical  : 10,
    backgroundColor  : "#F7F8FA"
  },
  backButton     : {
    padding: 10
  },
  headerTitle    : {
    fontSize  : 17,
    fontWeight: "600",
    color     : "#333"
  },
  headerSpacer   : {
    width: 48 // (Icono 28 + padding 10*2 = 48)
  },
  // --- FIN ESTILOS HEADER ---
  scrollContent    : {
    padding      : 20,
    paddingTop   : 10,
    paddingBottom: 250
  },
  infoSection      : {
    backgroundColor: "white",
    borderRadius   : 15,
    padding        : 20,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 1 },
    shadowOpacity  : 0.05,
    shadowRadius   : 5,
    elevation      : 2
  },
  infoRow          : {
    flexDirection: "row",
    alignItems   : "center",
    marginBottom : 20
  },
  label            : {
    fontSize   : 16,
    fontWeight : "bold",
    color      : "#2C3E50",
    marginRight: 8
  },
  value            : {
    fontSize  : 16,
    color     : "#34495E",
    lineHeight: 22
  },
  photosContainer  : {
    flexDirection : "row",
    gap           : 10,
    marginVertical: 10,
    marginBottom  : 20
  },
  photo            : {
    width          : 80,
    height         : 80,
    borderRadius   : 10,
    backgroundColor: "#EAECEE"
  },
  verMas           : {
    color     : "#3498DB",
    fontWeight: "bold"
  },
  deliveryStatus   : {
    flexDirection: "row",
    alignItems   : "center",
    marginTop    : 20
  },
  supportBox       : {
    position            : "absolute",
    bottom              : 0,
    left                : 0,
    right               : 0,
    backgroundColor     : "white",
    padding             : 30,
    borderTopLeftRadius : 20,
    borderTopRightRadius: 20,
    shadowColor         : "#000",
    shadowOffset        : { width: 0, height: -3 },
    shadowOpacity       : 0.05,
    shadowRadius        : 10,
    elevation           : 10,
    alignItems          : "center"
  },
  supportTitle     : {
    fontSize    : 16,
    fontWeight  : "bold",
    textAlign   : "center",
    marginBottom: 10,
    color       : "#2C3E50"
  },
  supportText      : {
    fontSize    : 14,
    color       : "#555",
    textAlign   : "center",
    marginBottom: 20,
    lineHeight  : 20
  },
  supportButton    : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center",
    width          : "100%"
  },
  supportButtonText: {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )