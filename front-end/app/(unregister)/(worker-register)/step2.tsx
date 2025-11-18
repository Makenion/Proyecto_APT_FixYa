import * as FileSystem from "expo-file-system/legacy"
import AntDesign       from "@expo/vector-icons/AntDesign"

import React, { useState }                               from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import {
  SafeAreaView
}                                                        from "react-native-safe-area-context"
import * as DocumentPicker
                                                         from "expo-document-picker"
import { useFieldArray, useForm }                        from "react-hook-form"
import {
  zodResolver
}                                                        from "@hookform/resolvers/zod"
import {
  useQuery
}                                                        from "@tanstack/react-query"
import {
  CertificateTypeEnum,
  Speciality
}                                                        from "@/models/worker/response"
import {
  specialitiesOption
}                                                        from "@/lib/tanstack_query"
import {
  CertificatePayload,
  registerWorkerSchema
}                                                        from "@/models/worker/payload"
import { Image }                                         from "expo-image"
import {
  errorColor
}                                                        from "@/constants/theme"
import { useRouter }                                     from "expo-router"
import {
  useAuth
}                                                        from "@/hooks/auth_context"
import {
  upload
}                                                        from "cloudinary-react-native"
import { cloudinary }                                    from "@/lib/api"


export default function WorkerRegisterStep2() {
  const {registerWorker }         = useAuth()
  const { control, handleSubmit, watch } = useForm<any>( {
    resolver: zodResolver( registerWorkerSchema )
  } )

  const {
          append: appendCertificate,
          remove: removeCertificate
        } = useFieldArray<any>( {
    control,
    name: "certificates"
  } )
  const {
          append: appendSpeciality,
          remove: removeSpeciality
        } = useFieldArray<any>( {
    control,
    name: "specialities"
  } )

  const { data } = useQuery<Speciality[]>(
    specialitiesOption )

  const dataOptions: string[] = data?.map( data => data.name ) || []

  const specialitiesValues           = watch( "specialities" ) as string[] ?? []
  const certificatesValues           = watch(
      "certificates" ) as CertificatePayload[] ??
    []
  const toggleSpeciality             = ( speciality: string ) => {

    const name = specialitiesValues.findIndex( item => item === speciality )
    if ( name !== -1 ) {
      removeSpeciality( name )
    }
    else {
      appendSpeciality( speciality )
    }
  }
  const router                       = useRouter()
  const [submiting, startSubmitting] = useState( false )
  const onSubmit                     = async ( data: any ) => {
    console.log( "Submitting worker registration with data:", data )
    if ( specialitiesValues.length === 0 || certificatesValues.length === 0 ) {
      return
    }
    startSubmitting( true )
    const uploadedCertificates: CertificatePayload[] = []
    for ( const certificate of data.certificates ) {
      await upload( cloudinary, {
        file       : certificate.url, options: {
          folder       : "worker_certificates",
          upload_preset: "react-journal",
          unsigned     : true
        }, callback: ( error: any, response: any ) => {
          if ( error ) {
            return
          }
          const url = response.secure_url
          uploadedCertificates.push( {
            name            : certificate.name,
            url             : url,
            certificate_type: certificate.certificate_type
          } )
        }
      } )
    }
    const n = {
      ...data,
      certificates: uploadedCertificates
    }
    console.log( "Final payload for worker registration:", n )
    const result = await registerWorker( n )
    startSubmitting( false )
    if ( !result ) {
      return
    }
    router.push( "/(unregister)/(worker-register)/success" )
  }
  const picker                       = async () => {
    let result = await DocumentPicker.getDocumentAsync( {
      type                : ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
      multiple            : true
    } )

    if ( result.canceled ) {
      return
    }
    const assetsWithBase64 = await Promise.all(
      result.assets.map( async ( asset ) => {
        const base64 = await FileSystem.readAsStringAsync( asset.uri, {
          encoding: FileSystem.EncodingType.Base64
        } )

        const dataUri = `data:${ asset.mimeType };base64,${ base64 }`

        return {
          ...asset,
          base64 : base64,
          dataUri: dataUri
        }
      } ) )
    assetsWithBase64.forEach( asset => {
      const exist = certificatesValues.find( c => c.name === asset.name )
      if ( exist ) {
        return
      }
      const payload: CertificatePayload = {
        name            : asset.name,
        url             : asset.dataUri,
        certificate_type: CertificateTypeEnum.Other
      }
      appendCertificate( payload )
    } )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        <Text style={ styles.headerTitle }>Registro</Text>
        <Text style={ styles.subtitle }>Selecciona tus especialidades</Text>
        <View style={ styles.specialityList }>
          { dataOptions.length > 0 ? dataOptions.map( service => (
              <Pressable key={ service } style={ styles.checkboxContainer }
                         onPress={ () => toggleSpeciality( service ) }>
                <Text style={ styles.optionText }>{ service }</Text>
                <View style={ [
                  styles.checkbox,
                  specialitiesValues.includes( service ) &&
                  styles.checkboxSelected
                ] }>
                  { specialitiesValues.includes( service ) &&
                      <Text style={ styles.checkMark }>✓</Text> }
                </View>
              </Pressable>
            ) )
            : <Text>Cargando opciones de servicios...</Text>
          }
        </View>
        { specialitiesValues.length === 0 ? <Text
          style={ { color: errorColor } }>
          Por favor selecciona al menos una especialidad.
        </Text> : null }
        <Pressable style={ styles.attachButton } onPress={ picker }>
          <Text style={ styles.attachButtonText }>Adjunta acá tus
            certificados</Text>
          <Text style={ styles.attachButtonIcon }>+</Text>
        </Pressable>
        { certificatesValues.length === 0 ? <Text
          style={ { color: errorColor } }>
          Por favor selecciona un tipo de hogar.
        </Text> : null }
        { certificatesValues.length > 0 ? certificatesValues.map( ( c, i ) => (
            <View key={ c.name } style={ {
              flexDirection    : "row",
              alignItems       : "center",
              paddingVertical  : 12,
              borderBottomWidth: 1,
              borderBottomColor: "#EEE"
            } }>
              <Image
                source={ { uri: c.url } }
                style={ { width: 50, height: 50, borderRadius: 5 } }
              />
              {/* Texto limitado para que no empuje el botón de borrar */ }
              <Text
                style={ [styles.optionText, { flex: 1, marginHorizontal: 12 }] }
                numberOfLines={ 1 }
                ellipsizeMode="tail"
              >{ c.name }</Text>
              <Pressable style={ styles.deleteButton }
                         onPress={ () => removeCertificate( i ) }>
                <AntDesign name="delete" size={ 24 } color="red"/>
              </Pressable>
            </View>
          ) )
          : null }
        <Pressable
          disabled={ submiting }
          style={ styles.button } onPress={ handleSubmit( onSubmit ) }>
          <Text style={ styles.buttonText }>{
            submiting ? "Enviando..." : "Enviar datos"
          }</Text>
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
    marginBottom: 30
  },
  specialityList   : { marginBottom: 30 },
  checkboxContainer: {
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center",
    paddingVertical  : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  checkboxText     : { fontSize: 16, color: "#34495E" },
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
  optionText       : {
    fontSize     : 16, color: "#34495E",
    textTransform: "capitalize",
    flexShrink   : 1
  },
  checkMark        : { color: "white", fontSize: 14, fontWeight: "bold" },
  attachButton     : {
    marginTop        : 10,
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center",
    paddingVertical  : 15,
    paddingHorizontal: 20,
    backgroundColor  : "white",
    borderRadius     : 10,
    shadowColor      : "#000",
    shadowOffset     : { width: 0, height: 2 },
    shadowOpacity    : 0.1,
    shadowRadius     : 5,
    elevation        : 3,
    marginBottom     : 40
  },
  attachButtonText : { fontSize: 16, color: "#34495E", fontWeight: "500" },
  attachButtonIcon : { fontSize: 24, color: "#3498DB", fontWeight: "bold" },
  deleteButton     : {
    padding       : 8,
    width         : 44,
    alignItems    : "center",
    justifyContent: "center"
  },
  button           : {
    marginTop      : 20,
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center"
  },
  buttonText       : { color: "white", fontSize: 16, fontWeight: "bold" }
} )