// 🎯 ARCHIVO: app/remodelaciones-form-step2.tsx (CON CORRECCIÓN DE SINTAXIS)

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
  Ionicons
}                          from "@expo/vector-icons"
import {
  useLocalSearchParams,
  useRouter
}                          from "expo-router"
import {
  SafeAreaView
}                          from "react-native-safe-area-context"

export default function RemodelacionesFormStep2() {
  const router              = useRouter()
  const formDataStep1       = useLocalSearchParams()
  const [budget, setBudget] = useState( "" )

  const handleSendForm = () => {
    const fullFormData = { ...formDataStep1, budget: budget }
    console.log( "Enviando formulario completo al backend:", fullFormData )
    router.push( "/solicitud-enviada" )
  }

  const handleImagePicker = () => {
    console.log( "Abrir selector de imágenes..." )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        <View style={ styles.field }>
          <Text style={ styles.label }>Presupuesto <Text
            style={ styles.labelOptional }>(Cuanto estás dispuesto a
            pagar)</Text></Text>
          <TextInput
            style={ styles.input }
            placeholder="$"
            value={ budget }
            onChangeText={ setBudget }
            keyboardType="numeric"
            placeholderTextColor="#C7C7CD"
          />
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Imagenes del espacio <Text
            style={ styles.labelOptional }>(Almenos 2)</Text></Text>
          <View style={ styles.imagePickerContainer }>
            <Pressable style={ styles.imagePickerBox }
                       onPress={ handleImagePicker }>
              <Ionicons name="add" size={ 40 } color="#C7C7CD"/>
            </Pressable>
            <Pressable style={ styles.imagePickerBox }
                       onPress={ handleImagePicker }>
              <Ionicons name="add" size={ 40 } color="#C7C7CD"/>
            </Pressable>
            <Pressable style={ styles.imagePickerBox }
                       onPress={ handleImagePicker }>
              <Ionicons name="add" size={ 40 } color="#C7C7CD"/>
            </Pressable>
          </View>
        </View>

        <Text style={ styles.importantNote }>
          Importante: Esto ayuda a que el trabajador que acepte tu solicitud
          tenga una mejor noción del espacio donde trabajará y los materiales
          que necesitará.
        </Text>

        <Pressable style={ styles.button } onPress={ handleSendForm }>
          <Text style={ styles.buttonText }>Enviar formulario</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container           : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent       : { padding: 20 },
  field               : { marginBottom: 25 },
  label               : {
    fontSize    : 16,
    fontWeight  : "500",
    color       : "#333",
    marginBottom: 8
  },
  labelOptional       : { color: "#888", fontWeight: "normal" },
  input               : {
    backgroundColor  : "white",
    paddingHorizontal: 15,
    paddingVertical  : 12,
    borderRadius     : 8,
    borderWidth      : 1,
    borderColor      : "#EAEAEA",
    fontSize         : 16
  },
  imagePickerContainer: {
    flexDirection: "row",
    gap          : 10
  },
  imagePickerBox      : {
    width          : 80,
    height         : 80,
    borderRadius   : 8,
    borderWidth    : 1,
    borderColor    : "#EAEAEA",
    backgroundColor: "white",
    justifyContent : "center",
    alignItems     : "center"
  },
  importantNote       : {
    fontSize    : 14,
    color       : "#7F8C8D",
    lineHeight  : 20,
    marginTop   : 10,
    marginBottom: 40
  },
  button              : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 20
  },
  buttonText          : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )