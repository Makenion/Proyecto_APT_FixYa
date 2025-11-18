import React, { useState } from "react"

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import {
  SafeAreaView
}                                                        from "react-native-safe-area-context"
import { useFieldArray, useForm }                        from "react-hook-form"
import {
  zodResolver
}                                                        from "@hookform/resolvers/zod"
import {
  updateUserSchema
}                                                        from "@/models/user/payload"
import {
  useAuth
}                                                        from "@/hooks/auth_context"
import { useRouter }                                     from "expo-router"
import {
  errorColor
}                                                        from "@/constants/theme"

const dataOptions = [
  "Reparaciones simples en casa", "Reparaciones complejas en casa",
  "Construcción", "Remodelaciones en casa"
]
const homeTypes   = ["Parcela", "Casa", "Departamento", "Otro"]

export default function UserRegisterStep2() {
  const {user} = useAuth()
  console.log("user in step2:", user)
  const { control, handleSubmit, watch, setValue } = useForm<any>( {
    resolver: zodResolver( updateUserSchema ),
    defaultValues:{
      user_id: user?.id
    }
  } )

  const { append, remove }           = useFieldArray<any>( {
    control,
    name: "services_types"
  } )
  const [submiting, startSubmitting] = useState( false )


  const fieldValues      = watch( "services_types" ) as string[] ?? []
  const toggleService    = ( service: string ) => {

    const name = fieldValues.findIndex( item => item === service )
    if ( name !== -1 ) {
      remove( name )
    }
    else {
      append( service )
    }
  }
  const { update }       = useAuth()
  const router           = useRouter()
  const selectedHomeType = watch( "house_type" ) as string | undefined

  const onSubmit = async ( data: any ) => {
    console.log( "Form submitted with data:", data )
    if ( fieldValues.length === 0 || !selectedHomeType ) {
      return
    }
    startSubmitting( true )
    const result = await update( data )
    startSubmitting( false )
    if ( !result ) {
      return
    }
    router.push( "/(unregister)/(user-register)/success" )
  }


  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        <Text style={ styles.headerTitle }>Registro</Text>
        <Text style={ styles.subtitle }>Selecciona por qué quieres usar este
          servicio</Text>
        <View style={ styles.listContainer }>
          { dataOptions.length > 0 ? dataOptions.map( service => (
              <Pressable key={ service } style={ styles.checkboxContainer }
                         onPress={ () => toggleService( service ) }>
                <Text style={ styles.optionText }>{ service }</Text>
                <View style={ [
                  styles.checkbox,
                  fieldValues.includes( service ) && styles.checkboxSelected
                ] }>
                  { fieldValues.includes( service ) &&
                      <Text style={ styles.checkMark }>✓</Text> }
                </View>
              </Pressable>
            ) )
            : <Text>Cargando opciones de servicios...</Text>
          }
        </View>
        { fieldValues.length === 0 ? <Text
          style={ { color: errorColor } }>
          Por favor selecciona al menos un servicio.
        </Text> : null }

        <Text style={ styles.subtitle }>Selecciona tipo de hogar</Text>
        <View style={ styles.listContainer }>
          { homeTypes.map( type => (
            <Pressable key={ type } style={ styles.checkboxContainer }
                       onPress={ () => setValue( "house_type", type ) }>
              <Text style={ styles.optionText }>{ type }</Text>
              <View
                style={ [
                  styles.radio,
                  selectedHomeType === type && styles.radioSelected
                ] }
              >
                { selectedHomeType === type &&
                    <View style={ styles.radioInner }/> }
              </View>
            </Pressable>
          ) ) }
        </View>
        { !selectedHomeType ? <Text
          style={ { color: errorColor } }>
          Por favor selecciona un tipo de hogar.
        </Text> : null }

        <Pressable
          disabled={submiting}
          style={ styles.button } onPress={ handleSubmit( onSubmit ) }>
          <Text style={ styles.buttonText }>
            { submiting ? "Enviando..." : "Enviar datos" }
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container        : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent    : {
    flexGrow         : 1,
    justifyContent   : "center",
    paddingHorizontal: 40,
    paddingTop       : 20,
    paddingBottom    : 40
  },
  headerTitle      : {
    fontSize    : 24,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginBottom: 20
  },
  subtitle         : {
    fontSize    : 16,
    color       : "#2C3E50",
    textAlign   : "center",
    marginBottom: 20,
    fontWeight  : "500"
  },
  listContainer    : { marginBottom: 30 },
  checkboxContainer: {
    flexDirection  : "row",
    justifyContent : "space-between",
    alignItems     : "center",
    paddingVertical: 12
  },
  optionText       : {
    fontSize     : 16, color: "#34495E",
    textTransform: "capitalize"
  },
  checkbox         : {
    width         : 24,
    height        : 24,
    borderRadius  : 5,
    borderWidth   : 2,
    borderColor   : "#D0D0D0",
    justifyContent: "center",
    alignItems    : "center"
  },
  checkboxSelected : { backgroundColor: "#3498DB", borderColor: "#3498DB" },
  checkMark        : { color: "white", fontSize: 14, fontWeight: "bold" },
  radio            : {
    width         : 24,
    height        : 24,
    borderRadius  : 12,
    borderWidth   : 2,
    borderColor   : "#D0D0D0",
    justifyContent: "center",
    alignItems    : "center"
  },
  radioSelected    : { borderColor: "#3498DB" },
  radioInner       : {
    width          : 12,
    height         : 12,
    borderRadius   : 6,
    backgroundColor: "#3498DB"
  },
  button           : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 20
  },
  buttonText       : { color: "white", fontSize: 16, fontWeight: "bold" }
} )