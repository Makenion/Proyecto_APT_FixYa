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
  SafeAreaView
}                          from "react-native-safe-area-context"
import {
  Stack,
  useRouter
}                          from "expo-router"
import {
  Ionicons
}                          from "@expo/vector-icons"

export default function InformacionBancariaScreen() {
  const router = useRouter()

  // Estados para los campos del formulario
  const [rut, setRut]             = useState( "" )
  const [numCuenta, setNumCuenta] = useState( "" )

  const handleGuardar = () => {
    console.log( "Guardando información bancaria:", { rut, numCuenta } )
    // Aquí iría tu lógica para guardar en la base de datos
    router.back() // Vuelve a la pantalla de perfil
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* Configura la barra de título superior */ }
      <Stack.Screen
        options={ { headerShown: true, title: "Información bancaria" } }/>

      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* Campo de Banco (como un botón) */ }
        <Pressable style={ styles.fieldButton }
                   onPress={ () => console.log( "Seleccionar Banco" ) }>
          <Text style={ styles.fieldButtonText }>Banco</Text>
          <Ionicons name="chevron-forward-outline" size={ 20 } color="#BDBDBD"/>
        </Pressable>

        {/* Campo de Rut */ }
        <View style={ styles.field }>
          <TextInput
            style={ styles.input }
            placeholder="Rut asociado"
            placeholderTextColor="#BDBDBD"
            value={ rut }
            onChangeText={ setRut }
          />
        </View>

        {/* Campo de Número de Cuenta */ }
        <View style={ styles.field }>
          <TextInput
            style={ styles.input }
            placeholder="Num cuenta"
            placeholderTextColor="#BDBDBD"
            value={ numCuenta }
            onChangeText={ setNumCuenta }
            keyboardType="number-pad"
          />
        </View>

        {/* Mensaje de recordatorio */ }
        <View style={ styles.infoBox }>
          <Text style={ styles.infoText }>
            <Text style={ { fontWeight: "bold" } }>Recuerda:</Text> FixYa
            depositará los montos de tus trabajos completados en esta cuenta. Si
            sufres la pérdida o cambio de esta, debes cambiarla o contactarte
            con soporte.
          </Text>
        </View>

        {/* Botón de Guardar */ }
        <Pressable style={ styles.button } onPress={ handleGuardar }>
          <Text style={ styles.buttonText }>Guardar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container      : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent  : { padding: 20 },
  field          : {
    marginBottom: 25
  },
  input          : {
    fontSize         : 16,
    color            : "#333",
    paddingVertical  : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0"
  },
  fieldButton    : {
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center",
    paddingVertical  : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom     : 25
  },
  fieldButtonText: {
    fontSize: 16,
    color   : "#333" // Color de texto oscuro para que se lea
  },
  infoBox        : {
    backgroundColor: "#F0F4F8",
    borderRadius   : 8,
    padding        : 15,
    marginTop      : 30,
    marginBottom   : 30
  },
  infoText       : {
    fontSize  : 14,
    color     : "#555",
    lineHeight: 20
  },
  button         : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 20
  },
  buttonText     : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )
