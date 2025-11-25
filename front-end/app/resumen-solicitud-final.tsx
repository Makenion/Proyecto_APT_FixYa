import { useAuth } from "@/hooks/auth_context"
import { getRelativeTime } from "@/lib/utils"
import { UpdateValorRequest, updateValorRequest } from "@/models/sales/payload"
import { Ionicons } from "@expo/vector-icons"
import {
  zodResolver
} from "@hookform/resolvers/zod"
import { Image } from "expo-image"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import {
  SafeAreaView
} from "react-native-safe-area-context"
export default function ResumenSolicitudFinalScreen() {
  const router = useRouter()
  // Leemos los parámetros que vienen del formulario
  const {
    title,
    description,
    value,
    estimated_time,
    status,
    location_text,
    ends_at,
    complexity,
    imageUrls,
    imageCount,
    isWorker,
    idSolicitud,
    created_at
  } = useLocalSearchParams()

  const handleFinalizar = () => {
    console.log("Finalizando solicitud:", {
      title,
      description,
      value,
      estimated_time,
      status,
      location_text,
      ends_at,
      complexity,
      imageUrls,
      imageCount
    })

    if (isWorker === "true") {
      router.replace("/(protected)/(client-tabs)")
    }
    router.replace("/(protected)/(worker-tabs)")
     // O volver al inicio de usuario
  }

  const ends_at_date = (ends_at as string).split('T')[0]

  const { control,
    handleSubmit,
    formState: { errors },
    watch } = useForm({
      resolver: zodResolver(updateValorRequest)
    })
  
  const { proponerValor }                        = useAuth()

  const [submiting, startSubmitting]        = useState( false )
  
  const onSubmit                            = async ( data: UpdateValorRequest ) => {

    data.request_id = idSolicitud ? Number(idSolicitud) : 0
    startSubmitting( true )
    const result = await proponerValor(data)
    startSubmitting( false )
    if ( !result ) {
      return
    }
    console.log("result de proponer valor")
    console.log(result)
    router.push( "/(protected)/(worker-tabs)" )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Configura la barra de título con la flecha de atrás */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Resumen de solicitud", // Título como en la imagen
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "white" }
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Mostramos los datos recibidos */}
        {isWorker === "true" ? <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>Solicitud N° {idSolicitud}</Text>
          <Text style={styles.cardDuration}>{getRelativeTime((created_at as string).split('T')[0])}</Text>
        </View> : <></>}

        <Text style={styles.title}>{title ||
          "Título no especificado"}</Text>

        <Text style={styles.location}>
          <Ionicons name="location" size={14} color="#7F8C8D" />
          {" "}{location_text || "Dirección no especificada"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Descripción: </Text>
          {description || "Descripción no especificada"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Fecha entrega: </Text>
          {ends_at_date || "Fecha no especificada"}
        </Text>

        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Estado: </Text>
          <Text style={styles.capitalizedText} >{status || "Pendiente"}</Text>

        </Text>

        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Complejidad Estimada: </Text>
          <Text style={styles.capitalizedText}>
            {complexity || "No calculado"}
          </Text>
        </Text>

        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Duración Estimada: </Text>
          {estimated_time || "No calculado"} Horas
        </Text>

        { errors.value_proposed?.message && (
  <Text>{errors.value_proposed.message}</Text>
)}
        { errors.request_id?.message && (
  <Text>{errors.request_id.message}</Text>
)}

        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Imagenes subidas: </Text>
          {imageCount || "Sin imagenes"}
        </Text>
        {typeof imageUrls === 'string' ? (
          <View style={styles.carouselContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            >
              {imageUrls.split(',').map((url, index) => (
                <View key={`${url}-${index}`} style={styles.imageContainer}>
                  <Image
                    source={{ uri: url }}
                    style={styles.carouselImage}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
        {/* Placeholder del Mapa */}
        {/* <View style={ styles.mapPlaceholder }>
          <Text style={ styles.mapText }>[Aquí va el componente de Mapa]</Text>
        </View> */}
        {isWorker === "true" ?
        <Controller
          control={ control }
          name="value_proposed"
          render={ ( { field: { onChange, onBlur, value } } ) => (
            <TextInput
              style={ styles.input } placeholder="Valor Propuesto"
              onBlur={ onBlur }
              onChangeText={ onChange }
              value={ String(value ?? '') }
              keyboardType="phone-pad"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          ) }
                  />: <></>}

      </ScrollView>

      {/* Botón Finalizar fijo abajo */}

      {isWorker === "true" ?
      
      <View style={styles.footer}>
        <Pressable style={styles.finalizeButton} onPress={handleSubmit( onSubmit )}>
          <Text style={styles.finalizeButtonText}>Proponer Valor</Text>
        </Pressable>
      </View> :      
      
      
      <View style={styles.footer}>
        <Pressable style={styles.finalizeButton} onPress={handleFinalizar}>
          <Text style={styles.finalizeButtonText}>Volver</Text>
        </Pressable>
      </View>}      
      
      


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContent: {
    padding: 20,
    paddingBottom: 100 // Espacio para el botón fijo
  },
  title: {
    fontSize: 20, // Un poco más pequeño
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2C3E50"
  },
  info: {
    fontSize: 16,
    color: "#34495E",
    marginBottom: 10,
    lineHeight: 22
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#2C3E50"
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: "#EAECEE",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20
  },
  mapText: {
    color: "#7F8C8D",
    fontSize: 16
  },
  // Footer y Botón Finalizar
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0"
  },
  finalizeButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center"
  },
  finalizeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  carouselContainer: {
    marginVertical: 10,
    height: 300, // Altura fija para el carrusel
  },
  carouselContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  imageContainer: {
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  carouselImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  location: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 20
  },
  capitalizedText: {
    textTransform: 'capitalize'
  },
  cardDate: { fontSize: 12, color: "#7F8C8D" },
  cardDuration: { fontSize: 12, color: "#7F8C8D", marginLeft: 10 },
  disponibleBadge: {
    backgroundColor: "#E0F7FA",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginLeft: "auto"
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  input            : {
    fontSize         : 16,
    paddingVertical  : 15,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginBottom     : 20
  },
})