// 🎯 ARCHIVO: app/maestro-profile/[id].tsx (EDITADO)

import React, { useState } from "react"
import {
  Image,
  Platform,
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
  Stack,
  useLocalSearchParams,
  useRouter
}                          from "expo-router"
import {
  Ionicons
}                          from "@expo/vector-icons"

// --- Componente para mostrar estrellas ---
const RatingStars = ( { rating }: { rating: number } ) => {
  const stars      = []
  const fullStars  = Math.floor( rating )
  const halfStar   = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (
    halfStar ? 1 : 0
  )
  for ( let i = 0; i < fullStars; i++ ) stars.push( <Ionicons
    key={ `full-${ i }` } name="star" size={ 18 } color="#FFC107"/> )
  if ( halfStar ) {
    stars.push( <Ionicons key="half" name="star-half" size={ 18 }
                          color="#FFC107"/> )
  }
  for ( let i = 0; i < emptyStars; i++ ) stars.push( <Ionicons
    key={ `empty-${ i }` } name="star-outline" size={ 18 } color="#FFC107"/> )
  return <View style={ styles.starsContainer }>{ stars }</View>
}

export default function MaestroProfileScreen() {
  const router                = useRouter()
  // Leemos el 'hideSolicitar' por si vienes desde el resumen de solicitud
  const { id, hideSolicitar } = useLocalSearchParams()
  const shouldHideSolicitar   = hideSolicitar === "true"

  // --- Datos de ejemplo ---
  const maestro = {
    id                 : id,
    nombre             : "Camilo Apablaza Imbarack",
    especialidad       : "Pintor especialista",
    disponibilidad     : "Lunes a Viernes de 08:00 AM a 18:00 PM",
    calificacionGeneral: 4.5,
    trabajosCompletados: 20,
    descripcion        : "Pintor con alta especialidad en exteriores, con más de 5 años de experiencia, realizo todo tipo de trabajos en su hogar..",
    portafolio         : [
      "https://placehold.co/100x80/grey/white?text=Trabajo+1",
      "https://placehold.co/100x80/grey/white?text=Trabajo+2",
      "https://placehold.co/100x80/grey/white?text=Trabajo+3",
      "https://placehold.co/100x80/grey/white?text=Trabajo+4"
    ],
    avatar             : require( "../../assets/images/user.jpeg" )
  }

  const [isDescExpanded, setIsDescExpanded] = useState( false )

  // --- Función handleSolicitar (ACTUALIZADA) ---
  const handleSolicitar = () => {
    console.log( "Navegando a la selección de tipo de solicitud..." )
    router.push( {
      pathname: "/tipo-solicitud", // La nueva pantalla de selección
      params  : {
        maestroId    : id, // Pasamos el ID del maestro
        maestroNombre: maestro.nombre // Pasamos el Nombre del maestro
      }
    } )
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* ... (Stack.Screen y ScrollView) ... */ }
      <Stack.Screen
        options={ {
          headerShown        : true,
          title              : "Perfil de maestro",
          headerShadowVisible: false,
          headerStyle        : { backgroundColor: "white" }
        } }
      />
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        <View style={ styles.profileCard }>
          <View style={ styles.cardHeader }>
            <Image source={ maestro.avatar } style={ styles.avatar }/>
            <View style={ styles.headerText }>
              <Text style={ styles.maestroName }>{ maestro.nombre }</Text>
              <Text
                style={ styles.maestroSpecialty }>{ maestro.especialidad }</Text>
            </View>
          </View>
          <Text style={ styles.sectionTitle }>Disponibilidad</Text>
          <Text style={ styles.infoText }>{ maestro.disponibilidad }</Text>
          <View style={ styles.ratingRow }>
            <Text style={ styles.sectionTitle }>Calificación general:</Text>
            <RatingStars rating={ maestro.calificacionGeneral }/>
            <Text
              style={ styles.ratingValue }>{ maestro.calificacionGeneral.toFixed(
              1 ) }</Text>
          </View>
          <Text style={ styles.sectionTitle }>Trabajos completados: <Text
            style={ styles.trabajosValue }>{ maestro.trabajosCompletados }</Text></Text>
          <Text
            style={ styles.descriptionText }
            numberOfLines={ isDescExpanded ? undefined : 3 }
            ellipsizeMode="tail"
          >
            { maestro.descripcion }
          </Text>
          <Pressable onPress={ () => setIsDescExpanded( !isDescExpanded ) }>
            <Text style={ styles.verMas }>
              { isDescExpanded ? "Ver menos" : "Ver más" }
            </Text>
          </Pressable>
          <Text style={ styles.sectionTitle }>Ver portafolio de trabajos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={ false }
                      style={ styles.portfolioScroll }>
            { maestro.portafolio.map( ( uri, index ) => (
              <Image key={ index } source={ { uri } }
                     style={ styles.portfolioImage }/>
            ) ) }
          </ScrollView>
        </View>
      </ScrollView>

      {/* --- Botón Solicitar (onPress actualizado y condicional) --- */ }
      {/* Solo se muestra si NO vienes desde el resumen de solicitud */ }
      { !shouldHideSolicitar && (
        <View style={ styles.footer }>
          <Pressable style={ styles.solicitarButton }
                     onPress={ handleSolicitar }>
            <Text style={ styles.solicitarButtonText }>Solicitar</Text>
          </Pressable>
        </View>
      ) }
    </SafeAreaView>
  )
}

// --- ESTILOS (Sin cambios) ---
const styles = StyleSheet.create( {
  container          : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent      : { padding: 20, paddingBottom: 100 },
  profileCard        : {
    backgroundColor: "white",
    borderRadius   : 15,
    padding        : 20,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 1 },
    shadowOpacity  : 0.1,
    shadowRadius   : 5,
    elevation      : 3
  },
  cardHeader         : {
    flexDirection    : "row",
    alignItems       : "center",
    marginBottom     : 20,
    paddingBottom    : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  avatar             : {
    width       : 60,
    height      : 60,
    borderRadius: 30,
    marginRight : 15
  },
  headerText         : { flex: 1 },
  maestroName        : { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  maestroSpecialty   : { fontSize: 14, color: "#7F8C8D" },
  sectionTitle       : {
    fontSize    : 16,
    fontWeight  : "bold",
    color       : "#34495E",
    marginBottom: 5,
    marginTop   : 10
  },
  infoText           : { fontSize: 14, color: "#555", marginBottom: 15 },
  ratingRow          : {
    flexDirection: "row",
    alignItems   : "center",
    marginBottom : 15
  },
  starsContainer     : { flexDirection: "row", marginLeft: 10 },
  ratingValue        : {
    fontSize  : 16,
    fontWeight: "bold",
    color     : "#FFC107",
    marginLeft: 5
  },
  trabajosValue      : { fontWeight: "normal", color: "#555" },
  descriptionText    : {
    fontSize  : 14,
    color     : "#555",
    lineHeight: 20,
    marginTop : 5
  },
  verMas             : {
    color       : "#3498DB",
    fontWeight  : "bold",
    fontSize    : 14,
    marginTop   : 5,
    marginBottom: 15
  },
  portfolioScroll    : { marginTop: 10, marginBottom: 15 },
  portfolioImage     : {
    width          : 100,
    height         : 80,
    borderRadius   : 8,
    marginRight    : 10,
    backgroundColor: "#EAECEE"
  },
  footer             : {
    position         : "absolute",
    bottom           : 0,
    left             : 0,
    right            : 0,
    backgroundColor  : "white",
    paddingVertical  : 15,
    paddingHorizontal: 20,
    paddingBottom    : Platform.OS === "ios" ? 30 : 20,
    borderTopWidth   : 1,
    borderTopColor   : "#F0F0F0"
  },
  solicitarButton    : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  solicitarButtonText: { color: "white", fontSize: 16, fontWeight: "bold" }
} )