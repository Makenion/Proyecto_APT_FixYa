// 🎯 ARCHIVO: app/formulario-arreglos.tsx (CON CHECKBOX URGENTE)

import React, { useState }  from "react"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
}                           from "react-native"
import { Stack, useRouter } from "expo-router"
import { Ionicons }         from "@expo/vector-icons"
import { SafeAreaView }     from "react-native-safe-area-context" // Necesario para el checkbox

export default function FormularioArreglosScreen() {
  const router = useRouter()

  // Estados para los campos del formulario
  const [isUrgente, setIsUrgente]           = useState( false ) // <--- NUEVO ESTADO PARA CHECKBOX
  const [titulo, setTitulo]                 = useState( "" )
  const [tipoTrabajador, setTipoTrabajador] = useState( "" )
  const [descripcion, setDescripcion]       = useState( "" )
  const [fechaEntrega, setFechaEntrega]     = useState( "" )
  const [comuna, setComuna]                 = useState( "" )
  const [direccion, setDireccion]           = useState( "" )

  const handleSiguiente = () => {
    // 👇 Incluimos isUrgente en los datos
    const formData = {
      isUrgente,
      titulo,
      tipoTrabajador,
      descripcion,
      fechaEntrega,
      comuna,
      direccion
    }
    console.log( "Datos del formulario:", formData )

    router.push( {
      pathname: "/resumen-solicitud-final",
      params  : formData
    } )
  }

  const handleVerEnMapa = () => {
    console.log( "Abrir mapa para la dirección:", direccion )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1 } }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 }
      >
        {/* Encabezado con flecha de atrás */ }
        <Stack.Screen
          options={ {
            headerShown        : true,
            title              : "Formulario de arreglos",
            headerShadowVisible: false,
            headerStyle        : { backgroundColor: "white" }
          } }
        />

        <ScrollView contentContainerStyle={ styles.scrollContent }>

          {/* --- 👇 CHECKBOX URGENTE AÑADIDO --- */ }
          <Pressable
            style={ styles.checkboxContainer }
            onPress={ () => setIsUrgente(
              !isUrgente ) } // Cambia el estado al presionar
            activeOpacity={ 0.7 } // Efecto visual leve
          >
            <Ionicons
              name={ isUrgente
                ? "checkbox"
                : "square-outline" } // Cambia el ícono
              size={ 26 }
              color={ isUrgente ? "#3498DB" : "#7F8C8D" } // Cambia el color
            />
            <Text style={ styles.checkboxLabel }>
              Si tu solicitud es <Text
              style={ { fontWeight: "bold" } }>urgente</Text> marca aqui
            </Text>
          </Pressable>
          {/* --- FIN CHECKBOX --- */ }


          {/* Campo Título */ }
          <View style={ styles.fieldContainer }>
            <Text style={ styles.label }>Título</Text>
            <TextInput
              style={ styles.input }
              placeholder="Pon un título a tu solicitud"
              placeholderTextColor="#BDBDBD"
              value={ titulo }
              onChangeText={ setTitulo }
            />
          </View>

          {/* ... (Resto de los campos: Tipo trabajador, Descripción, Fecha, Comuna, Dirección) ... */ }
          {/* Campo Tipo de trabajador (Placeholder para Dropdown) */ }
          <View style={ styles.fieldContainer }>
            <Text style={ styles.label }>Tipo de trabajador</Text>
            <Pressable style={ styles.dropdownButton }
                       onPress={ () => console.log(
                         "Abrir selector tipo trabajador" ) }>
              <Text style={ styles.dropdownText }>{ tipoTrabajador ||
                "Selecciona un tipo" }</Text>
              <Ionicons name="chevron-down-outline" size={ 20 } color="#555"/>
            </Pressable>
          </View>

          {/* Campo Descripción */ }
          <View style={ styles.fieldContainer }>
            <Text style={ styles.label }>Descripción del trabajo</Text>
            <TextInput
              style={ [styles.input, styles.textArea] }
              placeholder="Especifica que es lo que necesitas"
              placeholderTextColor="#BDBDBD"
              value={ descripcion }
              onChangeText={ setDescripcion }
              multiline
            />
          </View>

          {/* Campo Fecha entrega (Placeholder para DatePicker) */ }
          <View style={ styles.fieldContainer }>
            <Text style={ styles.label }>Fecha entrega</Text>
            <TextInput
              style={ styles.input }
              placeholder="DD/MM/AAAA" // O formato preferido
              placeholderTextColor="#BDBDBD"
              value={ fechaEntrega }
              onChangeText={ setFechaEntrega }
            />
          </View>

          {/* Campo Comuna */ }
          <View style={ styles.fieldContainer }>
            <Text style={ styles.label }>Comuna</Text>
            <TextInput
              style={ styles.input }
              placeholder="Ej: Viña del Mar"
              placeholderTextColor="#BDBDBD"
              value={ comuna }
              onChangeText={ setComuna }
            />
          </View>

          {/* Campo Dirección */ }
          <View style={ styles.fieldContainer }>
            <Text style={ styles.label }>Dirección</Text>
            <View style={ styles.addressRow }>
              <TextInput
                style={ [styles.input, styles.addressInput] }
                placeholder="Ej: Av. Siempre Viva 123"
                placeholderTextColor="#BDBDBD"
                value={ direccion }
                onChangeText={ setDireccion }
              />
              <Pressable onPress={ handleVerEnMapa }>
                <Text style={ styles.mapLink }>Ver en mapa</Text>
              </Pressable>
            </View>
          </View>


        </ScrollView>

        {/* Botón Siguiente fijo abajo */ }
        <View style={ styles.footer }>
          <Pressable style={ styles.nextButton } onPress={ handleSiguiente }>
            <Text style={ styles.nextButtonText }>Siguiente</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container    : {
    flex           : 1,
    backgroundColor: "white"
  },
  scrollContent: {
    padding      : 20,
    paddingBottom: 100 // Espacio para el botón fijo
  },
  // --- 👇 ESTILOS PARA CHECKBOX ---
  checkboxContainer: {
    flexDirection: "row",
    alignItems   : "center",
    marginBottom : 30, // Espacio antes del título
    // backgroundColor: '#f0f0f0', // Opcional: fondo para verlo mejor
    paddingVertical: 10
  },
  checkboxLabel    : {
    fontSize  : 16,
    color     : "#333",
    marginLeft: 10,
    flexShrink: 1 // Permite que el texto se ajuste si es largo
  },
  // --- FIN ESTILOS CHECKBOX ---
  fieldContainer: {
    marginBottom: 25
  },
  label         : {
    fontSize    : 14,
    color       : "#555",
    marginBottom: 8,
    fontWeight  : "500"
  },
  input         : {
    backgroundColor  : "#F7F8FA",
    borderRadius     : 8,
    borderWidth      : 1,
    borderColor      : "#EAECEE",
    paddingHorizontal: 15,
    paddingVertical  : 12,
    fontSize         : 16,
    color            : "#333"
  },
  textArea      : {
    minHeight        : 100,
    textAlignVertical: "top"
  },
  dropdownButton: {
    backgroundColor  : "#F7F8FA",
    borderRadius     : 8,
    borderWidth      : 1,
    borderColor      : "#EAECEE",
    paddingHorizontal: 15,
    paddingVertical  : 12,
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center"
  },
  dropdownText  : {
    fontSize: 16,
    color   : "#333"
  },
  addressRow    : {
    flexDirection  : "row",
    alignItems     : "center",
    backgroundColor: "#F7F8FA",
    borderRadius   : 8,
    borderWidth    : 1,
    borderColor    : "#EAECEE"
  },
  addressInput  : {
    flex           : 1,
    borderWidth    : 0,
    backgroundColor: "transparent"
  },
  mapLink       : {
    fontSize         : 14,
    color            : "#3498DB",
    fontWeight       : "bold",
    paddingHorizontal: 15
  },
  footer        : {
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
  nextButton    : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  nextButtonText: {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )