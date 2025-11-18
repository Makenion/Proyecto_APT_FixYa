// 🎯 ARCHIVO: app/detalles-trabajo-maestro/[id].tsx (CONDICIONAL COMPLETO)

import React, { useState }                        from "react"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
}                                                 from "react-native"
import {
  SafeAreaView
}                                                 from "react-native-safe-area-context"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons }                               from "@expo/vector-icons"

// --- Textos completos ---
const fullDescription = "El techo presenta evidentes filtraciones de agua durante la lluvia, cliente sospecha que el problema es una teja rota. Se necesita revisión completa y reemplazo de las partes dañadas para evitar futuras goteras."
const fullMaterials   = "Planchas de zinc, aluzinc o fibrocemento (según elección). Clavos, tornillos autoperforantes y arandelas de goma. Sellador de techo de alta calidad."

export default function DetallesTrabajoMaestroScreen() {
  const router              = useRouter()
  // Leemos el parámetro 'fromHistory' además del 'id'
  const { id, fromHistory } = useLocalSearchParams()
  // Convertimos a booleano, será true si venimos del historial
  const isAcceptedJob       = fromHistory === "true"

  // --- Para Depurar: Verifica el valor del parámetro ---
  console.log( "[DetallesTrabajo] Valor de fromHistory:", fromHistory )
  console.log( "[DetallesTrabajo] ¿Es trabajo aceptado (viene de historial)?",
    isAcceptedJob )
  // --- Fin de Depuración ---


  // --- Datos de ejemplo (sustituye con datos reales de tu backend) ---
  const trabajo = {
    id          : id,
    jobNumber   : "#213",
    title       : "Remodelación de techo",
    location    : "Calle las rosas 37, Viña del Mar",
    distance    : "2km",
    description : fullDescription, // Usamos el texto completo
    materials   : fullMaterials,     // Usamos el texto completo
    duration    : "3 días trabajo",
    price       : "$30.000",
    savedComment: isAcceptedJob
      ? "Cliente pidió revisar también el patio trasero por humedad."
      : "" // Solo carga comentario si está aceptado
  }

  // Estados para comentarios y "Ver más"
  const [isDescExpanded, setIsDescExpanded]           = useState( false )
  const [isMatExpanded, setIsMatExpanded]             = useState( false )
  const [showCommentInput, setShowCommentInput]       = useState( false )
  const [commentText, setCommentText]                 = useState(
    trabajo.savedComment )
  const [currentSavedComment, setCurrentSavedComment] = useState(
    trabajo.savedComment )

  // Funciones para manejar comentarios
  const handleToggleCommentInput = () => {
    if ( !showCommentInput && currentSavedComment ) {
      setCommentText( currentSavedComment )
    }
    setShowCommentInput( !showCommentInput )
    if ( showCommentInput && !commentText ) {
      setCurrentSavedComment( "" )
    }
  }
  const handleSaveComment        = () => {
    setCurrentSavedComment( commentText )
    setShowCommentInput( false )
    console.log(
      `Comentario guardado para el trabajo ${ id }: ${ commentText }` )
  }
  const handleCancelComment      = () => {
    setCommentText( currentSavedComment )
    setShowCommentInput( false )
  }

  // Función para Aceptar (solo se llamará si el botón es visible)
  const handleAcceptJob = () => {
    console.log( "Aceptar trabajo (desde Detalles inicial):", id )
    // Lógica para aceptar el trabajo...
    router.push( `/seguimiento-trabajo/${ id }` )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1 } }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 }
      >
        {/* Encabezado de la pantalla */ }
        <Stack.Screen
          options={ {
            headerShown        : true,
            title              : "Detalles trabajo",
            headerShadowVisible: false,
            headerStyle        : { backgroundColor: "white" }
          } }
        />

        <ScrollView contentContainerStyle={ styles.scrollContent }>
          <Text style={ styles.jobNumber }>Trabajo { trabajo.jobNumber }</Text>
          <Text style={ styles.title }>{ trabajo.title }</Text>
          <Text style={ styles.location }>
            <Ionicons name="location-pin" size={ 14 } color="#7F8C8D"/>
            { " " }{ trabajo.location }, <Text
            style={ styles.distance }>{ trabajo.distance }</Text>
          </Text>

          {/* Mapa */ }
          <View style={ styles.mapPlaceholder }>
            <Text style={ styles.mapText }>[Aquí va el componente de
              Mapa]</Text>
          </View>

          {/* Descripción */ }
          <Text style={ styles.sectionTitle }>Descripción:</Text>
          <Text style={ styles.detailsText }
                numberOfLines={ isDescExpanded ? undefined : 2 }
                ellipsizeMode="tail">
            { trabajo.description }
          </Text>
          <Pressable onPress={ () => setIsDescExpanded( !isDescExpanded ) }>
            <Text style={ styles.linkText }>{ isDescExpanded
              ? "Ver menos"
              : "Ver más" }</Text>
          </Pressable>

          {/* Materiales */ }
          <Text style={ styles.sectionTitle }>Materiales:</Text>
          <Text style={ styles.detailsText }
                numberOfLines={ isMatExpanded ? undefined : 2 }
                ellipsizeMode="tail">
            { trabajo.materials }
          </Text>
          <Pressable onPress={ () => setIsMatExpanded( !isMatExpanded ) }>
            <Text style={ styles.linkText }>{ isMatExpanded
              ? "Ver menos"
              : "Ver más" }</Text>
          </Pressable>

          {/* --- SECCIÓN CONDICIONAL: Notas de trabajador --- */ }
          { isAcceptedJob && (
            <>
              <Text style={ styles.sectionTitle }>Notas de trabajador</Text>
              { !showCommentInput ? (
                <>
                  { currentSavedComment ? (
                    <Text
                      style={ styles.savedCommentText }>{ currentSavedComment }</Text>
                  ) : null }
                  <Pressable onPress={ handleToggleCommentInput }>
                    <Text style={ styles.addCommentLink }>
                      { currentSavedComment
                        ? "Editar comentario"
                        : "+ Agregar comentarios" }
                    </Text>
                  </Pressable>
                </>
              ) : (
                <View>
                  <TextInput
                    style={ styles.commentInput }
                    placeholder="Escribe tus notas aquí..."
                    multiline
                    value={ commentText }
                    onChangeText={ setCommentText }
                    autoFocus={ true }
                  />
                  <View style={ styles.commentButtonsContainer }>
                    <Pressable onPress={ handleCancelComment }
                               style={ styles.commentCancelButton }>
                      <Text
                        style={ styles.commentCancelButtonText }>Cancelar</Text>
                    </Pressable>
                    <Pressable onPress={ handleSaveComment }
                               style={ styles.commentAcceptButton }>
                      <Text
                        style={ styles.commentAcceptButtonText }>Aceptar</Text>
                    </Pressable>
                  </View>
                </View>
              ) }
            </>
          ) }

          {/* Duración y Precio */ }
          <Text style={ styles.durationText }>{ trabajo.duration }</Text>
          <Text style={ styles.priceText }>{ trabajo.price }</Text>

          {/* --- BOTÓN CONDICIONAL: Aceptar --- */ }
          { !isAcceptedJob && (
            <Pressable
              style={ styles.acceptButton }
              onPress={ handleAcceptJob }
            >
              <Text style={ styles.acceptButtonText }>Aceptar</Text>
            </Pressable>
          ) }

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// --- ESTILOS (Sin cambios estructurales) ---
const styles = StyleSheet.create( {
  container              : { flex: 1, backgroundColor: "white" },
  scrollContent          : {
    padding      : 20,
    paddingBottom: 40
  },
  jobNumber              : {
    fontSize    : 14,
    color       : "#7F8C8D",
    marginBottom: 5
  },
  title                  : {
    fontSize    : 22,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginBottom: 10
  },
  location               : {
    fontSize    : 14,
    color       : "#7F8C8D",
    marginBottom: 20
  },
  distance               : {
    color     : "#3498DB",
    fontWeight: "bold"
  },
  mapPlaceholder         : {
    height         : 200,
    backgroundColor: "#EAECEE",
    borderRadius   : 10,
    justifyContent : "center",
    alignItems     : "center",
    marginVertical : 20
  },
  mapText                : {
    color   : "#7F8C8D",
    fontSize: 16
  },
  sectionTitle           : {
    fontSize    : 18,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginTop   : 20,
    marginBottom: 8
  },
  detailsText            : {
    fontSize    : 16,
    color       : "#34495E",
    lineHeight  : 22,
    marginBottom: 5
  },
  linkText               : {
    fontSize       : 16,
    color          : "#3498DB",
    fontWeight     : "bold",
    marginBottom   : 15,
    paddingVertical: 5
  },
  durationText           : {
    fontSize    : 16,
    color       : "#7F8C8D",
    marginTop   : 30,
    marginBottom: 5
  },
  priceText              : {
    fontSize    : 22,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginBottom: 25
  },
  savedCommentText       : {
    fontSize       : 16,
    color          : "#34495E",
    lineHeight     : 22,
    marginBottom   : 5,
    backgroundColor: "#F8F9F9",
    padding        : 10,
    borderRadius   : 5
  },
  addCommentLink         : {
    fontSize       : 16,
    color          : "#3498DB",
    fontWeight     : "bold",
    marginBottom   : 20,
    paddingVertical: 5
  },
  commentInput           : {
    backgroundColor  : "#F0F0F0",
    borderRadius     : 10,
    padding          : 15,
    fontSize         : 16,
    minHeight        : 100,
    textAlignVertical: "top",
    marginBottom     : 10
  },
  commentButtonsContainer: {
    flexDirection : "row",
    justifyContent: "flex-end",
    alignItems    : "center",
    marginBottom  : 20,
    gap           : 15
  },
  commentCancelButton    : {
    paddingVertical  : 5,
    paddingHorizontal: 10
  },
  commentCancelButtonText: {
    fontSize  : 14,
    color     : "#E74C3C",
    fontWeight: "bold"
  },
  commentAcceptButton    : {
    backgroundColor  : "#3498DB",
    paddingVertical  : 8,
    paddingHorizontal: 15,
    borderRadius     : 20
  },
  commentAcceptButtonText: {
    fontSize  : 14,
    color     : "white",
    fontWeight: "bold"
  },
  acceptButton           : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 10
  },
  acceptButtonText       : {
    color     : "white",
    fontSize  : 18,
    fontWeight: "bold"
  }
} )