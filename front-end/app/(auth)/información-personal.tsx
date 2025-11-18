import React, { useState } from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
}                          from "react-native"
import {
  Stack,
  useRouter
}                          from "expo-router"
import {
  SafeAreaView
}                          from "react-native-safe-area-context"

export default function InformacionPersonalScreen() {
  const router = useRouter()

  // Estados para cada campo, pre-llenados con datos de ejemplo
  const [nombres, setNombres]     = useState( "Nicolas Henandez" )
  const [direccion, setDireccion] = useState( "" )
  const [ciudad, setCiudad]       = useState( "" )
  const [telefono, setTelefono]   = useState( "" )
  const [correo, setCorreo]       = useState( "" )

  const handleSaveChanges = () => {
    const updatedInfo = { nombres, direccion, ciudad, telefono, correo }
    console.log( "Guardando información personal:", updatedInfo )
    // Lógica para enviar los datos a tu backend de Go...
    router.back() // Volvemos a la pantalla de perfil
  }

  return (
    <SafeAreaView style={ styles.container }>
      <Stack.Screen
        options={ { headerShown: true, title: "Información personal" } }/>
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        <View style={ styles.field }>
          <Text style={ styles.label }>Nombres</Text>
          <TextInput style={ styles.input } value={ nombres }
                     onChangeText={ setNombres }/>
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Dirección actual</Text>
          <TextInput style={ styles.input } value={ direccion }
                     onChangeText={ setDireccion }/>
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Ciudad</Text>
          <TextInput style={ styles.input } value={ ciudad }
                     onChangeText={ setCiudad }/>
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Telefono</Text>
          <TextInput style={ styles.input } value={ telefono }
                     onChangeText={ setTelefono } keyboardType="phone-pad"/>
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Correo electronico</Text>
          <TextInput style={ styles.input } value={ correo }
                     onChangeText={ setCorreo } keyboardType="email-address"/>
        </View>

        <View style={ styles.field }>
          <View style={ styles.dateFieldContainer }>
            <Text style={ styles.label }>Fecha nacimiento</Text>
            <Pressable style={ styles.datePicker }>
              <Text style={ styles.dateText }>1 Abril, 1990</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={ styles.button } onPress={ handleSaveChanges }>
          <Text style={ styles.buttonText }>Guardar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container         : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent     : { padding: 20 },
  field             : { marginBottom: 25 },
  label             : { fontSize: 14, color: "#888", marginBottom: 8 },
  input             : {
    fontSize         : 16,
    paddingVertical  : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  dateFieldContainer: {
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center",
    paddingVertical  : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  datePicker        : {
    backgroundColor  : "#EAECEE",
    paddingVertical  : 6,
    paddingHorizontal: 12,
    borderRadius     : 8
  },
  dateText          : {
    fontSize  : 14,
    fontWeight: "500"
  },
  button            : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 40
  },
  buttonText        : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )