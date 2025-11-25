// 🎯 ARCHIVO: app/formulario-arreglos.tsx (AJUSTE VISUAL Y ESTILOS ORIGINALES)

import { Checkbox } from "@/components/ui/checkbox"
import { errorColor } from "@/constants/theme"
import { useAuth } from "@/hooks/auth_context"
import { cloudinary } from "@/lib/api"
import { specialitiesOption } from "@/lib/tanstack_query"
import { RegisterRequestPayload, registerRequestSchema, RequestImagePayload } from "@/models/sales/payload"
import { RequestImageTypeEnum } from "@/models/sales/response"
import { Speciality } from "@/models/worker/response"
import AntDesign from "@expo/vector-icons/AntDesign"
import { zodResolver } from "@hookform/resolvers/zod"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { useQuery } from "@tanstack/react-query"
import { upload } from "cloudinary-react-native"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system/legacy"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native"
import { Dropdown } from "react-native-element-dropdown"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { SafeAreaView } from "react-native-safe-area-context"
//Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_TOKEN);


//TODO
//AGREGAR VALIDACIONES DE FORMATO DE IMAGEN
// DE PESO DE IMAGEN
// DE CANTIDAD DE IMAGEN? CREO QUE ESTA, PERO REVISAR XD
// ELIMINAR EL FORMULARIO DE ARREGLOS O ALGO ASI, QUE YA EXISTE
// Y QUEDARSE SOLO CON ESTE PARA TODAS LAS SOLICITUDES
// AGREGAR PARA QUE SE MANDE EL BACKEND
export default function FormularioArreglosScreen() {
  const router = useRouter()
  const {createRequest }          = useAuth()

  const {
           control,
           handleSubmit,
           getValues,
           formState: { errors },
           watch
           } = useForm( {
      resolver       : zodResolver(registerRequestSchema),
      mode: "onChange",
      } )

  const {
           append: appendImage,
           remove: removeImage
         } = useFieldArray<any>( {
    control,
    name: "images"
  } )


  const { data } = useQuery<Speciality[]>(
    specialitiesOption )
  const dataOptions = data?.map( ( spe ) => (
    {
      label: spe.name,
      value: String( spe.id )
    }
  ) ) || []

  const [submiting, startSubmitting]         = useState( false )

  const [showDatePicker, setShowDatePicker] = useState( false )
  const imagesValues             = watch(
        "images" ) as RequestImagePayload[] ??
      []

  const onSubmit                 = async ( data: any ) => {
    startSubmitting( true )
    //console.log( "Submitting worker registration with data:", data )
    console.log(data.speciality_id)
    data.speciality_id = Number(data.speciality_id)
    if ( imagesValues.length === 0 || imagesValues.length > 3) {
      startSubmitting( false )
      return
    }
    

    const uploadedImages: RequestImagePayload[] = []
    for ( const img of data.images ) {
      await upload( cloudinary, {
        file       : img.url, options: {
          folder       : "request_images",
          upload_preset: "react-journal",
          unsigned     : true
        }, callback: ( error: any, response: any ) => {
          if ( error ) {
            startSubmitting( false )
            return
          }
          const url = response.secure_url
          uploadedImages.push( {
            name: img.name,
            url          : url,
            type: RequestImageTypeEnum.Client
          } )
        }
      } )
    }
    const n: RegisterRequestPayload = {
      ...data,
      images: uploadedImages
    }

    const result = await createRequest(n)
    startSubmitting( false )


    router.push( {
      pathname: "/resumen-solicitud-final",
      params  : {
        title: result.title,
        description: result.description,
        value: result.value.toString(),
        estimated_time: result.estimated_time.toString(),
        status: result.status,
        location_text: result.location_text,
        ends_at: result.ends_at,
        complexity: result.complexity,
        // Para imágenes, pasar solo URLs o IDs
        imageUrls: uploadedImages.map(img => img.url).join(','), // Convertir array a string
        imageCount: uploadedImages.length.toString()
      }
    } )
  }


  const picker                   = async () => {
    let result = await DocumentPicker.getDocumentAsync( {
      type           : ["image/*"],
      copyToCacheDirectory: true,
      multiple       : true
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
      const exist = imagesValues.find( i => i.name === asset.name )
      if ( exist ) {
        return
      }
      const payload: RequestImagePayload = {
        name: asset.name,
        url          : asset.dataUri,
        type: RequestImageTypeEnum.Client
      }
      appendImage( payload )
    } )
  }


  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1 } }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 80 : 0 }
      >
        {/* Encabezado con flecha de atrás */ }
      <KeyboardAwareScrollView
          enableOnAndroid={ true }
          showsVerticalScrollIndicator={ false }
          extraScrollHeight={ Platform.OS === "ios" ? 20 : 100 }
          contentContainerStyle={ styles.scrollContent }
          keyboardShouldPersistTaps="handled"
          enableAutomaticScroll={ true }
        >

        <Text style={styles.labelText}>¿Cual es su problema?</Text>
        <Controller
            control={ control }
            name="title"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <TextInput
                editable={ !submiting }
                style={ styles.input } placeholder="Problema a resolver"
                onBlur={ onBlur }
                onChangeText={ onChange }
                value={ value }
                placeholderTextColor="#999"
              />
            ) }
          />
          { errors.title && <Text
              style={ { color: errorColor } }>{ errors.title.message }</Text> }

        <Text style={styles.labelText}>Describa su problema</Text>
        <Controller
            control={ control }
            name="description"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <TextInput
                editable={ !submiting }
                style={ styles.input } placeholder="Descripción del problema"
                onBlur={ onBlur }
                onChangeText={ onChange }
                value={ value }
                placeholderTextColor="#999"
              />
            ) }
          />
        { errors.description && <Text
              style={ { color: errorColor } }>{ errors.description.message }</Text> }


        {/* 
          Cambiar css para que el checkbox se vea bien xd
        */}
        <Text style={styles.labelText}>¿Hacer publico su solicitud?</Text>
        <Controller
            control={ control }
            name="is_public"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <Checkbox
                disabled={ submiting }
                style={ styles.checkbox } // Usamos el nuevo estilo ajustado
                onBlur={ onBlur }
                onCheckedChange={ onChange }
                checked={ value }
              />
            ) }
          />
        { errors.is_public && <Text
              style={ { color: errorColor } }>{ errors.is_public.message }</Text> }

        <Text style={styles.labelText}>Seleccione una especialidad asociada al problema</Text>
        <Controller
            control={ control }
            name="speciality_id"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <Dropdown
                style={ [styles.dropdown] }
                disable={ submiting }
                placeholderStyle={ styles.placeholderStyle }
                selectedTextStyle={ styles.selectedTextStyle }
                inputSearchStyle={ styles.inputSearchStyle }
                iconStyle={ styles.iconStyle }
                itemTextStyle={ styles.itemTextStyle }
                data={ dataOptions }
                search
                maxHeight={ 300 }
                labelField="label"
                valueField="value"
                placeholder={"Selecciona una especialidad"}
                searchPlaceholder="Buscar..."
                value={ value }
                onBlur={ onBlur }
                onChange={ item => {
                  // const selected = comunaData?.find( comuna => comuna.id === item.value )
                  onChange( item.value )
                } }
              />
            ) }
          />
          { errors.speciality_id && <Text
              style={ { color: errorColor } }>{ errors.speciality_id.message }</Text> }

        <Text style={styles.labelText}>Ubicación</Text>
        <Controller
            control={ control }
            name="location_text"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <TextInput
                editable={ !submiting }
                style={ styles.input } placeholder="Dirección"
                onBlur={ onBlur }
                onChangeText={ onChange }
                value={ value }
                placeholderTextColor="#999"
              />
            ) }
          />
        { errors.location_text && <Text
              style={ { color: errorColor } }>{ errors.location_text.message }</Text> }

        <Text style={styles.labelText}>¿Cual es su fecha limite para solucionar el problema?</Text>
        <Controller
            control={ control }
            name="ends_at"
            render={ ( { field: { onChange, value } } ) => {
              const dateValue = value ? new Date( value ) : undefined
              return (
                <>
                  <Pressable disabled={ submiting }
                      onPress={ () => setShowDatePicker( true ) }
                      style={ styles.inputDate }> {/* Usamos el nuevo estilo inputDate */}
                    <Text style={ { color: value ? "#000" : "#999" } }>
                      { value
                        ? dateValue!.toLocaleDateString()
                        : "Fecha de termino del arreglo" }
                    </Text>
                  </Pressable>

                  { showDatePicker && (
                    <RNDateTimePicker
                      value={ dateValue || new Date() }
                      mode="date"
                      display={ Platform.OS === "ios" ? "spinner" : "default" }
                      onChange={ ( event, selectedDate ) => {
                        if ( Platform.OS === "android" ) {
                          setShowDatePicker(
                            false )
                        }
                        if ( (
                          event as any
                        ).type === "dismissed" )
                        {
                          return
                        }
                        const current = selectedDate || dateValue || new Date()
                        onChange( current.toISOString() )
                      } }
                    />
                  ) }
                </>
              )
            } }
          />
          { errors.ends_at && <Text
              style={ { color: errorColor } }>{ errors.ends_at.message }</Text> }

        <Pressable style={ styles.attachButton } onPress={ picker }>
          <Text style={ styles.attachButtonText }>Adjunte imagenes del problema</Text>
          <Text style={ styles.attachButtonIcon }>+</Text>
        </Pressable>
        { imagesValues.length === 0 ? <Text
          style={ { color: errorColor } }>
          Por favor selecciona almenos una imagen.
        </Text> : null }
        { imagesValues.length > 0 ? imagesValues.map( ( c, i ) => (
            <View key={ c.url } style={ {
              flexDirection      : "row",
              alignItems         : "center",
              paddingVertical    : 12,
              borderBottomWidth  : 1,
              borderBottomColor  : "#EEE"
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
                          onPress={ () => removeImage( i ) }>
                <AntDesign name="delete" size={ 24 } color="red"/>
              </Pressable>
            </View>
          ) )
          : null }

      {/*<Mapbox.MapView style={styles.map} />
      */}
        {/* Botón Siguiente fijo abajo */ }
        <View style={ styles.footer }>
          <Pressable disabled={ submiting} style={ styles.nextButton } onPress={ handleSubmit( onSubmit )}>
            <Text style={ styles.nextButtonText }>Siguiente</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container        : {
    flex           : 1,
    backgroundColor: "#F7F8FA",
    padding        : 0 // Eliminado padding aquí
  },
  dropdown         : {
    height           : 50,
    borderColor      : "gray",
    borderWidth      : 0.5,
    borderRadius     : 8,
    paddingHorizontal: 8,
    marginBottom     : 10,
    marginTop        : 10
  },
  icon             : {
    marginRight: 5
  },
  label            : {
    position         : "absolute",
    backgroundColor  : "white",
    left             : 22,
    top              : 8,
    zIndex           : 999,
    paddingHorizontal: 8,
    fontSize         : 14
  },
  placeholderStyle : {
    fontSize: 16
  },
  itemTextStyle    : {
    textTransform: "capitalize"
  },
  selectedTextStyle: {
    fontSize     : 16,
    textTransform: "capitalize"

  },
  iconStyle        : {
    width : 20,
    height: 20
  },
  inputSearchStyle : {
    height  : 40,
    fontSize: 16
  },
  scrollContent    : {
    flexGrow         : 1,
    justifyContent   : "flex-start",
    paddingHorizontal: 40, // Eliminado en el diseño final
    paddingTop       : 20,
    paddingBottom    : 40
  },
  headerTitle      : {
    fontSize    : 24,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginTop   : 10,
    marginBottom: 15
  },
  input            : {
    fontSize         : 16,
    paddingVertical  : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom     : 20
  },
  inputDate        : { // Nuevo estilo para el datepicker
    fontSize         : 16,
    paddingVertical  : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom     : 20,
    justifyContent   : "center",
    height           : 50
  },
  button           : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 30
  },
  buttonText       : { color: "white", fontSize: 16, fontWeight: "bold" },
  footer        : {
    position         : "absolute",
    bottom           : 0,
    left             : 0,
    right            : 0,
    backgroundColor  : "white",
    paddingVertical  : 15,
    paddingHorizontal: 20, // Añadir padding horizontal aquí
    paddingBottom    : Platform.OS === "ios" ? 30 : 20,
    borderTopWidth   : 1,
    borderTopColor   : "#F0F0F0"
  },
  nextButton    : {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius   : 30,
    alignItems     : "center"
  },
  nextButtonText: {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  },
  map: {
    flex: 1
  },
  attachButton     : {
    marginTop        : 10,
    flexDirection    : "row",
    justifyContent   : "space-between",
    alignItems       : "center",
    paddingVertical  : 15,
    paddingHorizontal: 20,
    backgroundColor  : "white",
    borderRadius     : 10,
    shadowColor      : "#000",
    shadowOffset     : { width: 0, height: 2 },
    shadowOpacity    : 0.1,
    shadowRadius     : 5,
    elevation        : 3,
    marginBottom     : 40
  },
  attachButtonText : { fontSize: 16, color: "#34495E", fontWeight: "500" },
  attachButtonIcon : { fontSize: 24, color: "#3498DB", fontWeight: "bold" },
  deleteButton     : {
    padding       : 8,
    width         : 44,
    alignItems    : "center",
    justifyContent: "center"
  },
  optionText       : {
    fontSize     : 16, color: "#34495E",
    textTransform: "capitalize",
    flexShrink   : 1
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5, // Espacio antes del checkbox
  },
  checkbox: {
    width: 24, 
    height: 24, 
    borderRadius: 4, 
    borderWidth: 2, 
    borderColor: "#ccc",
  },
} )
