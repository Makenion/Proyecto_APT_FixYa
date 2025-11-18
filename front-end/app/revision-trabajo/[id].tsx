// 🎯 ARCHIVO: app/revision-trabajo/[id].tsx (NUEVO)

import React                                             from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Stack, useLocalSearchParams, useRouter }        from "expo-router"
import {
  Ionicons
}                                                        from "@expo/vector-icons" // Para las estrellas
import {
  SafeAreaView
}                                                        from "react-native-safe-area-context"

export default function RevisionTrabajoScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams() // Obtenemos el ID del trabajo

  // --- Datos de ejemplo ---
  // Aquí harías una llamada a tu backend con el ID para obtener los detalles
  const revision = {
    titulo         : "Remodelación de techo",
    fechaCompletado: "20/09/2025",
    duracionDias   : 2,
    ganancias      : "$30.000",
    propinas       : "$5.000",
    notasTrabajador: "Se cambiaron tejas y se selló con...",
    notasCliente   : "Muy buen trabajo, quedó perfecto.",
    calificacion   : 4, // Número de estrellas (0-5)
    reseñaCliente  : {
      titulo: "Buen servicio",
      texto : "Satisfecho con la atención, lo unico que podría mejorar es la limpieza.",
      nombre: "Nicolas Hernandez",
      fecha : "20/09/2025"
    }
  }

  // --- Componente para mostrar estrellas ---
  const RatingStars = ( { rating }: { rating: number } ) => {
    const stars = []
    for ( let i = 1; i <= 5; i++ ) {
      stars.push(
        <Ionicons
          key={ i }
          name={ i <= rating ? "star" : "star-outline" }
          size={ 22 }
          color="#FFC107" // Color amarillo para estrellas
        />
      )
    }
    return <View style={ styles.starsContainer }>{ stars }</View>
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* Configura la barra de título con la flecha de atrás */ }
      <Stack.Screen
        options={ {
          headerShown        : true,
          title              : "Detalles trabajo", // Mantenemos el título como en tu foto
          headerShadowVisible: false,
          headerStyle        : { backgroundColor: "white" }
        } }
      />

      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* Título */ }
        <Text style={ styles.title }>{ revision.titulo }</Text>

        {/* Información General */ }
        <Text style={ styles.infoText }>{ revision.fechaCompletado }</Text>
        <Text style={ styles.infoText }>Se ha completado en <Text
          style={ styles.highlight }>{ revision.duracionDias } días</Text></Text>
        <Text style={ styles.infoText }>Ganancias: <Text
          style={ styles.highlight }>{ revision.ganancias }</Text></Text>
        <Text style={ styles.infoText }>Propinas: <Text
          style={ styles.highlight }>{ revision.propinas }</Text></Text>

        {/* Notas */ }
        <Text style={ styles.sectionTitle }>Notas de trabajador</Text>
        <Pressable onPress={ () => console.log( "Ver notas trabajador" ) }>
          <Text style={ styles.linkText }>Ver notas</Text>
        </Pressable>

        <Text style={ styles.sectionTitle }>Notas de cliente</Text>
        <Pressable onPress={ () => console.log( "Ver notas cliente" ) }>
          <Text style={ styles.linkText }>Ver notas</Text>
        </Pressable>

        {/* Reseña del Cliente */ }
        <View style={ styles.reviewCard }>
          <RatingStars rating={ revision.calificacion }/>
          <Text
            style={ styles.reviewTitle }>{ revision.reseñaCliente.titulo }</Text>
          <Text
            style={ styles.reviewText }>{ revision.reseñaCliente.texto }</Text>
          <Text
            style={ styles.reviewAuthor }>{ revision.reseñaCliente.nombre }</Text>
          <Text
            style={ styles.reviewDate }>{ revision.reseñaCliente.fecha }</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container     : { flex: 1, backgroundColor: "#F7F8FA" }, // Fondo gris claro
  scrollContent : {
    padding      : 20,
    paddingBottom: 40
  },
  title         : {
    fontSize    : 22,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginBottom: 15
  },
  infoText      : {
    fontSize    : 16,
    color       : "#34495E",
    marginBottom: 8
  },
  highlight     : {
    fontWeight: "bold",
    color     : "#3498DB" // Azul para destacar
  },
  sectionTitle  : {
    fontSize    : 18,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginTop   : 25,
    marginBottom: 5
  },
  linkText      : {
    fontSize    : 16,
    color       : "#3498DB",
    fontWeight  : "bold",
    marginBottom: 15
  },
  reviewCard    : {
    backgroundColor: "white",
    borderRadius   : 15,
    padding        : 20,
    marginTop      : 20,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 1 },
    shadowOpacity  : 0.05,
    shadowRadius   : 5,
    elevation      : 3
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom : 10
  },
  reviewTitle   : {
    fontSize    : 18,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginBottom: 8
  },
  reviewText    : {
    fontSize    : 16,
    color       : "#34495E",
    lineHeight  : 22,
    marginBottom: 15
  },
  reviewAuthor  : {
    fontSize  : 14,
    fontWeight: "500",
    color     : "#555"
  },
  reviewDate    : {
    fontSize: 12,
    color   : "#7F8C8D"
  }
} )