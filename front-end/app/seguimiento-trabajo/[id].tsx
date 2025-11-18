import React, { useState }                        from "react"
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
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
const fullCommunicationPreference = "Celular. Prefiere llamadas después de las 18:00 hrs."

export default function SeguimientoTrabajoScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  // --- Estados ---
  const [existingPhotos, setExistingPhotos]                 = useState( [
    "https://placehold.co/80x80/grey/white?text=Foto+1",
    "https://placehold.co/80x80/grey/white?text=Foto+2"
  ] )
  const [showCommentInput, setShowCommentInput]             = useState( false )
  const [commentText, setCommentText]                       = useState( "" )
  const [savedComment, setSavedComment]                     = useState( "" )
  const [isClientDetailExpanded, setIsClientDetailExpanded] = useState( false )
  const [confirmModalVisible, setConfirmModalVisible]       = useState( false )

  // --- Datos de ejemplo ---
  const trabajo = {
    titulo       : "Remodelación de techo",
    diasRestantes: "2 Días restantes"
  }
  const cliente = {
    nombre                 : "Nicolas Hernandez",
    preferenciaComunicacion: "Celular.."
  }

  // --- Funciones Handler ---
  const handleAddPhoto           = () => {
    console.log( "Agregar foto..." )
  }
  const handleToggleCommentInput = () => {
    if ( !showCommentInput && savedComment ) setCommentText( savedComment )
    if ( showCommentInput ) setCommentText( "" )
    setShowCommentInput( !showCommentInput )
  }
  const handleSaveComment        = () => {
    setSavedComment( commentText )
    setShowCommentInput( false )
  }
  const handleCancelComment      = () => {
    setCommentText( "" )
    setShowCommentInput( false )
  }

  // --- Lógica Botón Actualizar ---
  const handleActualizar = () => {
    console.log( "Actualizando seguimiento:",
      { id, comment: savedComment, photos: existingPhotos } )
    Alert.alert( "Actualizado", "El seguimiento ha sido actualizado.", [
      // Vuelve a la pantalla principal de trabajos del maestro
      { text: "OK", onPress: () => router.replace( "/(tabs2)/" ) }
    ] )
  }

  // --- Lógica Botón Marcar como Terminado (Abre Modal) ---
  const handleOpenConfirmModal = () => {
    setConfirmModalVisible( true )
  }

  // --- Lógica Confirmación Terminar (Dentro del Modal) ---
  const handleConfirmMarcarTerminado = () => {
    console.log( "Marcando como terminado:", id )
    // Lógica backend para marcar como terminado...
    setConfirmModalVisible( false )
    Alert.alert( "Terminado", "El trabajo ha sido marcado como terminado.", [
      {
        text   : "OK",
        onPress: () => router.replace( "/(tabs2)/historial-maestro" )
      }
    ] )
  }


  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1 } }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 }
      >
        {/* Configura la barra de título */ }
        <Stack.Screen
          options={ {
            headerShown        : true,
            title              : "Seguimiento trabajo",
            headerShadowVisible: false,
            headerStyle        : { backgroundColor: "white" }
          } }
        />

        <ScrollView contentContainerStyle={ styles.scrollContent }>
          {/* ... (Contenido del ScrollView sin cambios) ... */ }
          <View style={ styles.headerRow }>
            <Text style={ styles.title }>{ trabajo.titulo }</Text>
            <Text
              style={ styles.daysRemaining }>{ trabajo.diasRestantes }</Text>
          </View>
          <View style={ styles.mapPlaceholder }>
            <Text style={ styles.mapText }>[Aquí va el componente de
              Mapa]</Text>
          </View>
          <Text style={ styles.sectionTitle }>Agregar fotos</Text>
          <Text style={ styles.sectionSubtitle }>Acá puedes agregar imágenes del
            progreso de tu trabajo.</Text>
          <View style={ styles.photosContainer }>
            <Pressable style={ styles.addPhotoButton }
                       onPress={ handleAddPhoto }>
              <Ionicons name="add-outline" size={ 30 } color="#7F8C8D"/>
            </Pressable>
            <Pressable style={ styles.addPhotoButton }
                       onPress={ handleAddPhoto }>
              <Ionicons name="add-outline" size={ 30 } color="#7F8C8D"/>
            </Pressable>
            { existingPhotos.map( ( uri, index ) => (
              <Image key={ index } source={ { uri } } style={ styles.photo }/>
            ) ) }
          </View>
          <Text style={ styles.sectionTitle }>Notas de trabajador</Text>
          { !showCommentInput ? (
            <>
              { savedComment ? (
                <Text style={ styles.savedCommentText }>{ savedComment }</Text>
              ) : null }
              <Pressable onPress={ handleToggleCommentInput }>
                <Text style={ styles.addCommentLink }>
                  { savedComment
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
                  <Text style={ styles.commentCancelButtonText }>Cancelar</Text>
                </Pressable>
                <Pressable onPress={ handleSaveComment }
                           style={ styles.commentAcceptButton }>
                  <Text style={ styles.commentAcceptButtonText }>Aceptar</Text>
                </Pressable>
              </View>
            </View>
          ) }
          <Text style={ styles.sectionTitle }>Detalles cliente</Text>
          <Text style={ styles.clientDetail }>Nombre: { cliente.nombre }</Text>
          <Text style={ styles.clientDetail }
                numberOfLines={ isClientDetailExpanded ? undefined : 1 }>
            Preferencia de comunicación: { isClientDetailExpanded
            ? fullCommunicationPreference
            : cliente.preferenciaComunicacion }
          </Text>
          <Pressable onPress={ () => setIsClientDetailExpanded(
            !isClientDetailExpanded ) }>
            <Text style={ styles.verMas }>
              { isClientDetailExpanded ? "Ver Menos" : "Ver Más" }
            </Text>
          </Pressable>
        </ScrollView>

        {/* --- BOTONES FIJOS AL FINAL (onPress actualizados) --- */ }
        <View style={ styles.footer }>
          <Pressable style={ styles.buttonSolid } onPress={ handleActualizar }>
            <Text style={ styles.buttonTextSolid }>Actualizar</Text>
          </Pressable>
          <Pressable style={ styles.buttonOutline }
                     onPress={ handleOpenConfirmModal }>
            <Text style={ styles.buttonTextOutline }>Marcar como
              terminado</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* --- MODAL DE CONFIRMACIÓN PARA "MARCAR COMO TERMINADO" --- */ }
      <Modal
        animationType="fade"
        transparent={ true }
        visible={ confirmModalVisible }
        onRequestClose={ () => setConfirmModalVisible( false ) }
      >
        <Pressable
          style={ styles.modalOverlay }
          onPress={ () => setConfirmModalVisible( false ) }
        >
          <Pressable style={ styles.modalContent } onPress={ () => {
          } }>
            <Ionicons name="checkmark-done-circle-outline" size={ 70 }
                      color="#3498DB" style={ { marginBottom: 15 } }/>
            <Text style={ styles.modalTitle }>¿Seguro que deseas dar por
              terminado este trabajo?</Text>
            <Pressable
              style={ styles.modalButtonAccept }
              onPress={ handleConfirmMarcarTerminado }
            >
              <Text style={ styles.modalButtonTextAccept }>Sí, terminar</Text>
            </Pressable>
            <Pressable
              style={ styles.modalButtonCancel }
              onPress={ () => setConfirmModalVisible( false ) }
            >
              <Text style={ styles.modalButtonTextCancel }>CANCELAR</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  )
}

// --- ESTILOS (Sin cambios estructurales) ---
const styles = StyleSheet.create( {
  container              : { flex: 1, backgroundColor: "white" },
  scrollContent          : {
    padding      : 20,
    paddingBottom: 150
  },
  headerRow              : {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center",
    marginBottom  : 10
  },
  title                  : {
    fontSize   : 20,
    fontWeight : "bold",
    color      : "#2C3E50",
    flexShrink : 1,
    marginRight: 10
  },
  daysRemaining          : {
    fontSize  : 14,
    color     : "#3498DB",
    fontWeight: "bold",
    flexShrink: 0
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
  sectionSubtitle        : {
    fontSize    : 14,
    color       : "#555",
    marginBottom: 15
  },
  photosContainer        : {
    flexDirection: "row",
    gap          : 10,
    marginBottom : 20,
    flexWrap     : "wrap"
  },
  addPhotoButton         : {
    width          : 80,
    height         : 80,
    borderRadius   : 10,
    backgroundColor: "#F0F0F0",
    justifyContent : "center",
    alignItems     : "center",
    borderWidth    : 1,
    borderColor    : "#E0E0E0"
  },
  photo                  : {
    width          : 80,
    height         : 80,
    borderRadius   : 10,
    backgroundColor: "#EAECEE"
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
  clientDetail           : {
    fontSize    : 16,
    color       : "#34495E",
    marginBottom: 8,
    lineHeight  : 22
  },
  verMas                 : {
    color          : "#3498DB",
    fontWeight     : "bold",
    fontSize       : 16,
    paddingVertical: 5
  },
  footer                 : {
    position         : "absolute",
    bottom           : 0,
    left             : 0,
    right            : 0,
    backgroundColor  : "white",
    paddingVertical  : 15,
    paddingHorizontal: 20,
    paddingBottom    : Platform.OS === "ios" ? 30 : 20,
    borderTopWidth   : 1,
    borderTopColor   : "#F0F0F0",
    gap              : 10
  },
  buttonSolid            : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  buttonTextSolid        : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  },
  buttonOutline          : {
    backgroundColor: "white",
    borderWidth    : 1.5,
    borderColor    : "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  buttonTextOutline      : {
    color     : "#3498DB",
    fontSize  : 16,
    fontWeight: "bold"
  },
  modalOverlay           : {
    flex           : 1,
    justifyContent : "center",
    alignItems     : "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent           : {
    width          : "85%",
    backgroundColor: "white",
    borderRadius   : 15,
    padding        : 25,
    alignItems     : "center",
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 2 },
    shadowOpacity  : 0.25,
    shadowRadius   : 4,
    elevation      : 5
  },
  modalTitle             : {
    fontSize    : 18,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginBottom: 25,
    textAlign   : "center"
  },
  modalButtonAccept      : {
    backgroundColor: "#3498DB",
    paddingVertical: 14,
    borderRadius   : 30,
    alignItems     : "center",
    width          : "100%"
  },
  modalButtonTextAccept  : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  },
  modalButtonCancel      : {
    marginTop: 15,
    padding  : 10
  },
  modalButtonTextCancel  : {
    color     : "#7F8C8D",
    fontSize  : 14,
    fontWeight: "bold"
  }
} )