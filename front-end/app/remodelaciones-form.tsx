// 🎯 ARCHIVO: app/remodelaciones-form.tsx

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
  Ionicons
}                          from "@expo/vector-icons"
import {
  useRouter
}                          from "expo-router" // Necesitas useRouter

export default function RemodelacionesFormScreen() {
  const router                          = useRouter() // Inicializamos el router
  const [title, setTitle]               = useState( "" )
  const [remodelType, setRemodelType]   = useState( "Seleccionar" )
  const [description, setDescription]   = useState( "" )
  const [deliveryDate, setDeliveryDate] = useState( "" )
  const [comuna, setComuna]             = useState( "" )
  const [address, setAddress]           = useState( "" )

  // --- ¡CAMBIO CLAVE AQUÍ! ---
  const handleNext = () => {
    // Recopilamos los datos del formulario actual
    const formData = {
      title,
      remodelType,
      description,
      deliveryDate,
      comuna,
      address
    }

    // Navegamos al paso 2, pasando los datos como parámetros
    router.push( {
      pathname: "/remodelaciones-form-step2",
      params  : formData
    } )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        <View style={ styles.field }>
          <Text style={ styles.label }>Título</Text>
          <TextInput style={ styles.input }
                     placeholder="Pon un titulo a tu solicitud" value={ title }
                     onChangeText={ setTitle } placeholderTextColor="#C7C7CD"/>
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Tipo de remodelación</Text>
          <Pressable style={ styles.picker }>
            <Text>{ remodelType }</Text>
            <Ionicons name="chevron-down" size={ 20 } color="#555"/>
          </Pressable>
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Descripción del trabajo</Text>
          <TextInput style={ [styles.input, styles.textArea] }
                     placeholder="Especifica que es lo que necesitas"
                     value={ description } onChangeText={ setDescription }
                     placeholderTextColor="#C7C7CD" multiline/>
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Fecha entrega</Text>
          <TextInput style={ styles.input } value={ deliveryDate }
                     onChangeText={ setDeliveryDate }
                     placeholderTextColor="#C7C7CD"/>
        </View>

        <View style={ styles.field }>
          <Text style={ styles.label }>Comuna</Text>
          <TextInput style={ styles.input } value={ comuna }
                     onChangeText={ setComuna } placeholderTextColor="#C7C7CD"/>
        </View>

        <View style={ styles.field }>
          <View style={ styles.addressHeader }>
            <Text style={ styles.label }>Dirección</Text>
            <Pressable><Text style={ styles.mapLink }>Ver en
              mapa</Text></Pressable>
          </View>
          <TextInput style={ styles.input } value={ address }
                     onChangeText={ setAddress }
                     placeholderTextColor="#C7C7CD"/>
        </View>

        <Pressable style={ styles.button } onPress={ handleNext }>
          <Text style={ styles.buttonText }>Siguiente</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create( {
  container    : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent: { padding: 20 },
  field        : { marginBottom: 25 },
  label        : {
    fontSize    : 16,
    fontWeight  : "500",
    color       : "#333",
    marginBottom: 8
  },
  input        : {
    backgroundColor  : "white",
    paddingHorizontal: 15,
    paddingVertical  : 12,
    borderRadius     : 8,
    borderWidth      : 1,
    borderColor      : "#EAEAEA",
    fontSize         : 16
  },
  textArea     : {
    height           : 120,
    textAlignVertical: "top" // Para que el placeholder empiece arriba en Android
  },
  picker       : {
    backgroundColor  : "white",
    paddingHorizontal: 15,
    paddingVertical  : 12,
    borderRadius     : 8,
    borderWidth      : 1,
    borderColor      : "#EAEAEA",
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center"
  },
  addressHeader: {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center"
  },
  mapLink      : {
    color     : "#3498DB",
    fontWeight: "bold"
  },
  button       : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 20
  },
  buttonText   : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  }
} )