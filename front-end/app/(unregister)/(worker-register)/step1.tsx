import React, { useState }     from "react"
import AntDesign
                               from "@expo/vector-icons/AntDesign"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
}                              from "react-native"
import {
  SafeAreaView
}                              from "react-native-safe-area-context"
import {
  zodResolver
}                              from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { registerUserSchema }  from "@/models/user/payload"
import { errorColor }          from "@/constants/theme"
import RNDateTimePicker
                               from "@react-native-community/datetimepicker"
import {
  passwordSchema
}                              from "@/models/utils/password"
import { z }                   from "zod"
import { UserTypeEnum }        from "@/models/user/response"
import {
  KeyboardAwareScrollView
}                              from "react-native-keyboard-aware-scroll-view"


import { useQuery }      from "@tanstack/react-query"
import { Dropdown }      from "react-native-element-dropdown"
import { regionsOption } from "@/lib/tanstack_query"
import { api }           from "@/lib/api"
import { Comuna }        from "@/models/location/response"
import { useAuth }       from "@/hooks/auth_context"
import { useRouter }     from "expo-router"

export default function WorkerRegisterStep1() {
  const {
          control,
          handleSubmit,
          formState: { errors },
          watch
        } = useForm( {
    resolver     : zodResolver( registerUserSchema.extend( {
      password: passwordSchema,
      confirm : z.string( {
        message: "La confirmación de la contraseña es obligatoria"
      } )
    } ).refine( ( data ) => data.password === data.confirm, {
      path   : ["confirm"],
      message: "Las contraseñas no coinciden"
    } ) ),
    defaultValues: {
      user_type    : UserTypeEnum.Worker,
      full_name    : "aaaa",
      phone        : "12345678",
      email        : "aaaa@gmail.com",
      bank_identity: "199733877",
      calle        : "1",
      comuna       : "1",
      date_birth   : "2025-11-17T10:38:00-03:00",
      password     : "Qwerty!12345",
      confirm      : "Qwerty!12345"
    }

  } )

  const regionSelected       = watch( "region" )
  const { data: comunaData } = useQuery( {
    queryKey: ["comunas"],
    queryFn : async () => {
      const response = await api.get( "/location/comunas", {
        params: {
          region_id: regionSelected
        }
      } )
      if ( response.status !== 200 ) {
        throw new Error( "Error fetching comunas" )
      }
      return await response.data.data as Comuna[]
    },
    enabled : Boolean( regionSelected )
  } )

  const parsedComunas                   = comunaData?.map( ( comuna ) => (
    {
      label: comuna.name,
      value: String( comuna.id )
    }
  ) ) || []
  const { data }                        = useQuery( regionsOption )
  const [showPassword, setShowPassword] = useState( false )

  const parsedRegions = data?.map( ( region ) => (
    {
      label: region.name,
      value: String( region.id )
    }
  ) ) || []

  const [submiting, startSubmitting]        = useState( false )
  const { register }                        = useAuth()
  const router                              = useRouter()
  const onSubmit                            = async ( data: any ) => {
    console.log( "Form Data:", data )
    startSubmitting( true )
    const result = await register( data, data.password )
    startSubmitting( false )
    if ( !result ) {
      return
    }
    // router.push( "/(unregister)/(worker-register)/step2" )
    router.push( "/(unregister)/(worker-register)/success" )
  }
  const [showDatePicker, setShowDatePicker] = useState( false )

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 140 : 120 }
        style={ { flex: 1 } }
      >
        <KeyboardAwareScrollView
          enableOnAndroid={ true }
          showsVerticalScrollIndicator={ false }
          extraScrollHeight={ Platform.OS === "ios" ? 20 : 100 }
          contentContainerStyle={ styles.scrollContent }
          keyboardShouldPersistTaps="handled"
          enableAutomaticScroll={ true }
        >
          <Text style={ styles.headerTitle }>Registro</Text>
          <Controller
            control={ control }
            name="full_name"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <TextInput
                style={ styles.input } placeholder="Nombre completo"
                onBlur={ onBlur }
                onChangeText={ onChange }
                value={ value }
                placeholderTextColor="#999"
              />
            ) }
          />
          { errors.full_name && <Text
              style={ { color: errorColor } }>{ errors.full_name.message }</Text> }
          <Controller
            control={ control }
            name="email"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <TextInput
                style={ styles.input } placeholder="Correo electronico"
                onBlur={ onBlur }
                onChangeText={ onChange }
                value={ value }
                keyboardType="email-address" autoCapitalize="none"
                placeholderTextColor="#999"
              />
            ) }
          />
          { errors.email && <Text
              style={ { color: errorColor } }>{ errors.email.message }</Text> }
          <Controller
            control={ control }
            name="bank_identity"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <TextInput style={ styles.input } placeholder="Rut"
                         onBlur={ onBlur }
                         onChangeText={ onChange }
                         value={ value }
                         placeholderTextColor="#999"/>
            ) }
          />
          { errors.bank_identity && <Text
              style={ { color: errorColor } }>{ errors.bank_identity.message }</Text> }
          <Controller
            control={ control }
            name="phone"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <TextInput style={ styles.input } placeholder="Celular"
                         onBlur={ onBlur }
                         onChangeText={ onChange }
                         value={ value }
                         keyboardType="phone-pad"
                         placeholderTextColor="#999"/>
            ) }
          />
          { errors.phone && <Text
              style={ { color: errorColor } }>{ errors.phone.message }</Text> }
          <Controller
            control={ control }
            name="date_birth"
            render={ ( { field: { onChange, value } } ) => {
              const dateValue = value ? new Date( value ) : undefined
              return (
                <>
                  <Pressable onPress={ () => setShowDatePicker( true ) }
                             style={ styles.input }>
                    <Text style={ { color: value ? "#000" : "#999" } }>
                      { value
                        ? dateValue!.toLocaleDateString()
                        : "Fecha de nacimiento" }
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
          { errors.date_birth && <Text
              style={ { color: errorColor } }>{ errors.date_birth.message }</Text> }
          <Controller
            control={ control }
            name="region"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <Dropdown
                style={ [styles.dropdown] }
                placeholderStyle={ styles.placeholderStyle }
                selectedTextStyle={ styles.selectedTextStyle }
                inputSearchStyle={ styles.inputSearchStyle }
                iconStyle={ styles.iconStyle }
                itemTextStyle={ styles.itemTextStyle }
                data={ parsedRegions }
                search
                maxHeight={ 300 }
                labelField="label"
                valueField="value"
                placeholder="Selecciona una region"
                searchPlaceholder="Buscar..."
                value={ value }
                onBlur={ onBlur }
                onChange={ item => {
                  // const selected = data?.find( region => region.id === item.value )
                  onChange( item.value )
                } }
              />
            ) }
          />
          { errors.region && <Text
              style={ { color: errorColor } }>{ errors.region.message }</Text> }
          <Controller
            control={ control }
            name="comuna"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <Dropdown
                style={ [styles.dropdown] }
                disable={ !regionSelected }
                placeholderStyle={ styles.placeholderStyle }
                selectedTextStyle={ styles.selectedTextStyle }
                inputSearchStyle={ styles.inputSearchStyle }
                iconStyle={ styles.iconStyle }
                itemTextStyle={ styles.itemTextStyle }
                data={ parsedComunas }
                search
                maxHeight={ 300 }
                labelField="label"
                valueField="value"
                placeholder={ regionSelected
                  ? "Selecciona una comuna"
                  : "Selecciona una región primero" }
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
          { errors.comuna && <Text
              style={ { color: errorColor } }>{ errors.comuna.message }</Text> }
          <Controller
            control={ control }
            name="calle"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <TextInput style={ styles.input } placeholder="Calle"
                         onBlur={ onBlur }
                         onChangeText={ onChange }
                         value={ value }
                         placeholderTextColor="#999"/>
            ) }
          />
          { errors.calle && <Text
              style={ { color: errorColor } }>{ errors.calle.message }</Text> }
          <Controller
            control={ control }
            name="password"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <View style={ {
                flexDirection: "row",
                alignItems   : "center",
                marginBottom : 20
              } }>
                <TextInput
                  style={ [styles.input, { flex: 1, marginBottom: 0 }] }
                  placeholder="Contraseña"
                  secureTextEntry={ !showPassword }
                  onBlur={ onBlur }
                  onChangeText={ onChange }
                  value={ value }
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="done"
                  placeholderTextColor="#999"
                />
                <Pressable
                  onPress={ () => setShowPassword( prev => !prev ) }
                  hitSlop={ 8 }
                  style={ { paddingHorizontal: 10 } }
                >
                  {
                    showPassword ?
                      <AntDesign name="eye" size={ 24 } color="black"/> :
                      <AntDesign name="eye-invisible" size={ 24 }
                                 color="black"/>
                  }
                </Pressable>
              </View>
            ) }
          />
          { errors.password && <Text
              style={ { color: errorColor } }>{ errors.password.message }</Text> }
          <Controller
            control={ control }
            name="confirm"
            render={ ( { field: { onChange, onBlur, value } } ) => (
              <View style={ {
                flexDirection: "row",
                alignItems   : "center",
                marginBottom : 20
              } }>
                <TextInput
                  style={ [styles.input, { flex: 1, marginBottom: 0 }] }
                  placeholder="Confirmar Contraseña"
                  secureTextEntry={ !showPassword }
                  onBlur={ onBlur }
                  onChangeText={ onChange }
                  value={ value }
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="done"
                  placeholderTextColor="#999"
                />
                <Pressable
                  onPress={ () => setShowPassword( prev => !prev ) }
                  hitSlop={ 8 }
                  style={ { paddingHorizontal: 10 } }
                >
                  {
                    showPassword ?
                      <AntDesign name="eye" size={ 24 } color="black"/> :
                      <AntDesign name="eye-invisible" size={ 24 }
                                 color="black"/>
                  }

                </Pressable>
              </View>

            ) }
          />
          { errors.confirm && <Text
              style={ { color: errorColor } }>{ errors.confirm.message }</Text> }

          <Pressable
            disabled={submiting}
            style={ styles.button }
                     onPress={ handleSubmit( onSubmit ) }>
            <Text style={ styles.buttonText }>
              { submiting ? "Creando cuenta..." : "Crear" }
            </Text>
          </Pressable>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container        : {
    flex           : 1,
    backgroundColor: "#F7F8FA",
    padding        : 16
  },
  dropdown         : {
    height           : 50,
    borderColor      : "gray",
    borderWidth      : 0.5,
    borderRadius     : 8,
    paddingHorizontal: 8,
    marginBottom     : 10,
    marginTop        : 10
  },
  icon             : {
    marginRight: 5
  },
  label            : {
    position         : "absolute",
    backgroundColor  : "white",
    left             : 22,
    top              : 8,
    zIndex           : 999,
    paddingHorizontal: 8,
    fontSize         : 14
  },
  placeholderStyle : {
    fontSize: 16
  },
  itemTextStyle    : {
    textTransform: "capitalize"
  },
  selectedTextStyle: {
    fontSize     : 16,
    textTransform: "capitalize"

  },
  iconStyle        : {
    width : 20,
    height: 20
  },
  inputSearchStyle : {
    height  : 40,
    fontSize: 16
  },
  scrollContent    : {
    flexGrow         : 1,
    justifyContent   : "flex-start",
    paddingHorizontal: 40,
    paddingTop       : 20,
    paddingBottom    : 40
  },
  headerTitle      : {
    fontSize    : 24,
    fontWeight  : "bold",
    color       : "#2C3E50",
    textAlign   : "center",
    marginTop   : 10,
    marginBottom: 15
  },
  input            : {
    fontSize         : 16,
    paddingVertical  : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom     : 20
  },
  button           : {
    backgroundColor: "#3498DB",
    paddingVertical: 18,
    borderRadius   : 30,
    alignItems     : "center",
    marginTop      : 30
  },
  buttonText       : { color: "white", fontSize: 16, fontWeight: "bold" }
} )