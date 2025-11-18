// 🎯 ARCHIVO: app/informacion-personaluser-edit.tsx (NUEVO)

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
import { SafeAreaView }     from "react-native-safe-area-context"
// Asumo que usarás Ionicons para el selector de fecha si lo implementas
// import { Ionicons } from '@expo/vector-icons'; 

export default function InformacionPersonalUserEditScreen() {
  const router = useRouter()

  // Estados para los campos del formulario
  // Deberías cargarlos con los datos actuales del usuario
  const [nombres, setNombres]                 = useState( "" )
  const [direccion, setDireccion]             = useState( "" )
  const [ciudad, setCiudad]                   = useState( "" )
  const [telefono, setTelefono]               = useState( "" )
  const [correo, setCorreo]                   = useState( "" )
  const [fechaNacimiento, setFechaNacimiento] = useState( "1 Abril, 1990" ) // Placeholder

  const handleGuardar = () => {
    const formData = {
      nombres,
      direccion,
      ciudad,
      telefono,
      correo,
      fechaNacimiento
    }
    console.log( "Guardando información personal del usuario:", formData )
    // Aquí iría tu lógica para enviar los datos al backend de Go
    router.back() // Vuelve a la pantalla de perfil
  }

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1 } }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 }
      >
        {/* Configura la barra de título superior (la flecha < aparece sola) */ }
        <Stack.Screen
          options={ {
            headerShown        : true,
            title              : "Información personal",
            headerShadowVisible: false, // Quita la sombra del header
            headerStyle        : { backgroundColor: "#F7F8FA" } // Fondo del header
          } }
        />

        <ScrollView contentContainerStyle={ styles.scrollContent }>

          {/* Campo de Nombres */ }
          <View style={ styles.fieldContainer }>
            <TextInput
              style={ styles.input }
              placeholder="Nombres"
              placeholderTextColor="#BDBDBD"
              value={ nombres }
              onChangeText={ setNombres }
            />
          </View>

          {/* Campo de Dirección */ }
          <View style={ styles.fieldContainer }>
            <TextInput
              style={ styles.input }
              placeholder="Dirección actual"
              placeholderTextColor="#BDBDBD"
              value={ direccion }
              onChangeText={ setDireccion }
            />
          </View>

          {/* Campo de Ciudad */ }
          <View style={ styles.fieldContainer }>
            <TextInput
              style={ styles.input }
              placeholder="Ciudad"
              placeholderTextColor="#BDBDBD"
              value={ ciudad }
              onChangeText={ setCiudad }
            />
          </View>

          {/* Campo de Teléfono */ }
          <View style={ styles.fieldContainer }>
            <TextInput
              style={ styles.input }
              placeholder="Telefono"
              placeholderTextColor="#BDBDBD"
              value={ telefono }
              onChangeText={ setTelefono }
              keyboardType="phone-pad"
            />
          </View>

          {/* Campo de Correo */ }
          <View style={ styles.fieldContainer }>
            <TextInput
              style={ styles.input }
              placeholder="Correo electronico"
              placeholderTextColor="#BDBDBD"
              value={ correo }
              onChangeText={ setCorreo }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Campo de Fecha nacimiento (Simulado como botón) */ }
          <View style={ styles.fieldContainer }>
            <Pressable
              style={ styles.datePickerButton }
              onPress={ () => console.log( "Abrir selector de fecha..." ) }
            >
              <Text style={ styles.datePickerPlaceholder }>Fecha
                nacimiento</Text>
              <Text style={ styles.datePickerText }>{ fechaNacimiento }</Text>
            </Pressable>
          </View>

        </ScrollView>

        {/* Botón de Guardar (fijo abajo) */ }
        <View style={ styles.footer }>
          <Pressable style={ styles.button } onPress={ handleGuardar }>
            <Text style={ styles.buttonText }>Guardar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
    paddingTop   : 30, // Más espacio arriba
    paddingBottom: 120 // Espacio para el botón fijo
  },
  fieldContainer: {
    marginBottom: 30 // Espacio entre campos
  },
  input         : {
    fontSize         : 16,
    color            : "#333",
    paddingVertical  : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor  : "transparent" // Sin fondo
  },
  // Estilos para el campo de fecha
  datePickerButton     : {
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center",
    paddingVertical  : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  datePickerPlaceholder: {
    fontSize: 16,
    color   : "#BDBDBD" // Color del placeholder
  },
  datePickerText       : {
    fontSize  : 16,
    color     : "#333", // Color del texto (fecha)
    fontWeight: "500"
  },
  // Contenedor para el botón de guardar
  footer    : {
    position       : "absolute",
    bottom         : 0,
    left           : 0,
    right          : 0,
    backgroundColor: "#F7F8FA", // Mismo fondo
    padding        : 20,
    paddingBottom  : Platform.OS === "ios" ? 30 : 20
  },
  button    : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  buttonText: {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )