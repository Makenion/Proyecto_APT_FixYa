import React, { useState }                 from "react" // Importamos useState
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
}                                          from "react-native"
import { SafeAreaView }                    from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons }                        from "@expo/vector-icons"

export default function SoporteSolicitudScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  // Estados para el formulario
  const [problema, setProblema]       = useState( "Problemas con trabajador" )
  const [descripcion, setDescripcion] = useState( "" )

  // 2. Estado para el modal de éxito
  const [modalVisible, setModalVisible] = useState( false )

  const handleEnviar = () => {
    console.log( "Enviando ticket de soporte:",
      { solicitudId: id, problema, descripcion } )
    // Lógica para enviar el ticket a tu backend...

    // 3. Abrimos el modal en lugar de la alerta
    setModalVisible( true )
  }

  const handleVolverAlInicio = () => {
    setModalVisible( false ) // Cierra el modal
    // Navega de vuelta al inicio de la app del usuario (ajusta la ruta si es otra)
    router.replace( "/(tabs)/" )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1 } }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 }
      >
        {/* --- Header Manual con Flecha --- */ }
        <View style={ styles.headerContainer }>
          <Pressable style={ styles.backButton }
                     onPress={ () => router.back() }>
            <Ionicons name="arrow-back-outline" size={ 28 } color="#333"/>
          </Pressable>
          <Text style={ styles.headerTitle }>Soporte de solicitud</Text>
          <View style={ styles.headerSpacer }/>
        </View>

        <ScrollView contentContainerStyle={ styles.scrollContent }>
          {/* ... (Contenido del formulario: Icono, Títulos, Dropdown, Textarea) ... */ }
          <View style={ styles.iconContainer }>
            <Ionicons name="help-circle-outline" size={ 60 } color="#3498DB"/>
          </View>
          <Text style={ styles.title }>¿Necesitas ayuda?</Text>
          <Text style={ styles.subtitle }>Selecciona una opción de la lista para
            poder continuar.</Text>
          <Text style={ styles.label }>Problemas con trabajador</Text>
          <Pressable
            style={ styles.dropdownButton }
            onPress={ () => console.log( "Abrir selector de problemas" ) }
          >
            <Text style={ styles.dropdownText }>{ problema }</Text>
            <Ionicons name="chevron-down-outline" size={ 20 } color="#555"/>
          </Pressable>
          <Text style={ styles.label }>Describe el problema que estás
            presentando</Text>
          <TextInput
            style={ styles.textArea }
            placeholder="Necesito un mueble de cocina para mi casa, que sea de 2 puertas y no tan grande."
            placeholderTextColor="#BDBDBD"
            value={ descripcion }
            onChangeText={ setDescripcion }
            multiline
          />
        </ScrollView>

        {/* Botón Enviar fijo abajo */ }
        <View style={ styles.footer }>
          <Pressable style={ styles.button } onPress={ handleEnviar }>
            <Text style={ styles.buttonText }>Enviar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* --- 4. MODAL DE SOLICITUD ENVIADA --- */ }
      <Modal
        animationType="fade"
        transparent={ true }
        visible={ modalVisible }
        onRequestClose={ () => setModalVisible(
          false ) } // Para el botón 'atrás' de Android
      >
        <Pressable
          style={ styles.modalOverlay }
          onPress={ () => setModalVisible(
            false ) } // No permitir cerrar tocando fuera
        >
          <Pressable
            style={ styles.modalContent }
            onPress={ () => {
            } } // Evita cierre al tocar dentro
          >
            {/* Icono de Éxito */ }
            <Ionicons name="checkmark-circle-outline" size={ 70 }
                      color="#27AE60" style={ { marginBottom: 15 } }/>

            <Text style={ styles.modalTitle }>Solicitud enviada</Text>
            <Text style={ styles.modalSubtitle }>Tu mensaje ha sido recibido por
              el equipo de soporte.</Text>

            <Pressable
              style={ styles.modalButtonSolid }
              onPress={ handleVolverAlInicio } // Llama a la función de volver al inicio
            >
              <Text style={ styles.modalButtonTextSolid }>Volver al
                inicio</Text>
            </Pressable>

            {/* No hay botón "Cancelar" en este modal de éxito */ }

          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  )
}

// --- ESTILOS (Añadidos estilos de modal) ---
const styles = StyleSheet.create( {
  container      : {
    flex           : 1,
    backgroundColor: "#F7F8FA"
  },
  headerContainer: {
    flexDirection    : "row",
    alignItems       : "center",
    justifyContent   : "space-between",
    paddingHorizontal: 15,
    paddingVertical  : 10,
    backgroundColor  : "#F7F8FA"
  },
  backButton     : { padding: 10 },
  headerTitle    : { fontSize: 17, fontWeight: "600", color: "#333" },
  headerSpacer   : { width: 48 },
  scrollContent  : {
    padding      : 20,
    paddingBottom: 120
  },
  iconContainer  : { alignItems: "center", marginVertical: 15 },
  title          : {
    fontSize    : 20,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginBottom: 10
  },
  subtitle       : {
    fontSize    : 16,
    color       : "#555",
    textAlign   : "center",
    marginBottom: 30
  },
  label          : {
    fontSize    : 14,
    color       : "#555",
    marginBottom: 8,
    fontWeight  : "500"
  },
  dropdownButton : {
    backgroundColor  : "white",
    borderRadius     : 8,
    borderWidth      : 1,
    borderColor      : "#EAECEE",
    paddingHorizontal: 15,
    paddingVertical  : 12,
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center",
    marginBottom     : 25
  },
  dropdownText   : { fontSize: 16, color: "#333" },
  textArea       : {
    backgroundColor  : "white",
    borderRadius     : 8,
    borderWidth      : 1,
    borderColor      : "#EAECEE",
    padding          : 15,
    fontSize         : 16,
    minHeight        : 120,
    textAlignVertical: "top",
    color            : "#333"
  },
  footer         : {
    position       : "absolute",
    bottom         : 0,
    left           : 0,
    right          : 0,
    backgroundColor: "#F7F8FA",
    padding        : 20,
    paddingBottom  : Platform.OS === "ios" ? 30 : 20,
    borderTopWidth : 1,
    borderTopColor : "#E0E0E0"
  },
  button         : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  buttonText     : { color: "white", fontSize: 16, fontWeight: "bold" },

  // --- 5. Estilos para el Modal ---
  modalOverlay        : {
    flex           : 1,
    justifyContent : "center",
    alignItems     : "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent        : {
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
  modalTitle          : {
    fontSize    : 18,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginBottom: 10, // Menos espacio
    textAlign   : "center"
  },
  modalSubtitle       : { // Subtítulo añadido
    fontSize    : 14,
    color       : "#555",
    textAlign   : "center",
    marginBottom: 25
  },
  modalButtonSolid    : {
    backgroundColor: "#3498DB",
    paddingVertical: 14,
    borderRadius   : 30,
    alignItems     : "center",
    width          : "100%"
  },
  modalButtonTextSolid: {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
  // (Estilos de botón Cancelar no necesarios aquí)
} )