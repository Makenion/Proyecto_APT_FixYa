// 🎯 ARCHIVO: app/(tabs2)/historial-maestro.tsx (BOTÓN "REVISAR TRABAJO" AÑADIDO)

import { useAuth } from "@/hooks/auth_context"
import {
  Ionicons
} from "@expo/vector-icons"
import {
  Stack,
  useRouter
} from "expo-router"
import React, { useEffect, useState } from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native"
import {
  SafeAreaView
} from "react-native-safe-area-context"
import { useCountdown } from "./components/timer"

type Request = {
  id: number;
  request_id: number;
  title: string;
  created_at: string;
  ends_at: string;
  date_accepted: string;
  complexity: string;
  location_text: string;
  description: string;
  value: string;
  estimated_time: string;
  status: string;
  imageUrls: string;
  imageCount: string;
};

// --- Datos de ejemplo (Añadimos "En progreso" con más detalles) ---
const MOCK_HISTORY_DATA = {
  "En progreso": [
    {
      id           : "213",
      status       : "En progreso",
      timeRemaining: "02:15:20:45",
      daysRemaining: "3 días",
      jobNumber    : "#213",
      title        : "Remodelación techo",
      location     : "Calle las rosas 37, Viña del Mar",
      distance     : "2km",
      price        : "$30.000",
      fechaInicio  : "25/10/2025"
    }
  ],
  "Completados": [
    {
      id             : "101",
      status         : "Completado",
      jobNumber      : "#101",
      title          : "Pintura Habitación",
      location       : "Calle Falsa 123, Valparaíso",
      distance       : "3km",
      price          : "$25.000",
      fechaCompletado: "15/08/2025"
    },
    {
      id             : "103",
      status         : "Completado",
      jobNumber      : "#103",
      title          : "Armado Mueble TV",
      location       : "Av. Libertad 90, Viña del Mar",
      distance       : "1km",
      price          : "$20.000",
      fechaCompletado: "01/10/2025"
    }
  ],
  "Cancelados" : [
    {
      id             : "102",
      status         : "Cancelado",
      jobNumber      : "#102",
      title          : "Instalar Lámpara",
      location       : "Av. Siempre Viva 456, Quilpué",
      distance       : "8km",
      price          : "$15.000",
      fechaCompletado: "10/09/2025"
    }
  ]
}

// --- Componente de Tarjeta de Historial (MODIFICADO) ---
const HistoryCard = ( { req, router, isProgressTab }: {
  req: any,
  router: any,
  isProgressTab: boolean
} ) => {
  console.log("req de HistoryCard")
  console.log(req)
  const timeLeft = useCountdown(req.request.ends_at, 60000);
  const acepted_at_time = useCountdown(req.date_accepted, 60000 * 60 * 24)
  // Determina qué fecha/tiempo mostrar
  const fechaMostrada   = !isProgressTab && (
    req.request.status === "completado" || req.request.status === "cancelado"
  )
    ? req.request.ends_at
    : req.date_accepted
  const isCompleted     = req.request.status === "Completado" // Variable para saber si está completado

  return (
    // Quitamos onPress general y ponemos activeOpacity=1
    <Pressable
      key={ req.id }
      style={ styles.jobCard }
    >
      <View style={ styles.cardTopRow }>
        { isProgressTab ? (
          <>
            <Text style={ styles.cardTimeRemaining }>{`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}</Text>
          </>
        ) : (
          fechaMostrada &&
          <Text style={ styles.cardDate }>{ fechaMostrada }</Text>
        ) }

        {/* Badge de Estado */ }
        <View style={ [
          styles.statusBadge,
          isProgressTab ? styles.statusInProgress :
            isCompleted ? styles.statusCompleted : // Usamos la variable isCompleted
              styles.statusCancelled
        ] }>
          <Text style={ [
            styles.statusText,
            isProgressTab ? styles.statusTextInProgress :
              isCompleted ? styles.statusTextCompleted : // Usamos la variable isCompleted
                styles.statusTextCancelled
          ] }>
            { isProgressTab ? "En progreso" : req.request.status }
          </Text>
        </View>
      </View>
      <Text style={ styles.cardAceptedAt }>{`Aceptada hace ${acepted_at_time.days} dias`}</Text>
      <Text style={ styles.cardJobNumber }>Trabajo N°{ req.request.id }</Text>
      <Text style={ styles.cardTitle }>{ req.request.title }</Text>
      <Text style={ styles.cardLocation }>
        <Ionicons name="location" size={ 14 } color="#7F8C8D"/>
        { " " }{ req.request.location_text }
      </Text>
      <Text style={ styles.cardPrice }>{ req.request.value }</Text>

      {/* --- BOTONES CONDICIONALES --- */ }
      {/* Si está "En progreso" */ }
      { isProgressTab && (
        <View style={ styles.cardButtons }>
          <Pressable
            style={ [styles.button, styles.buttonOutline] }
            onPress={ ( e ) => {
              e.stopPropagation()
              router.push( `/detalles-trabajo-maestro/${ req.id }` )
            } }
          >
            <Text style={ [
              styles.buttonText, styles.buttonTextOutline
            ] }>Detalles</Text>
          </Pressable>
          <Pressable
            style={ [styles.button, styles.buttonSolid] }
            onPress={ ( e ) => {
              e.stopPropagation()
              router.push( `/seguimiento-trabajo/${ req.id }` )
              {
                "true"
              }
            } }
          >
            <Text style={ styles.buttonText }>Agregar seguimiento</Text>
          </Pressable>
        </View>
      ) }

      {/* 👇 SI ESTÁ "Completado" (Y NO está en la pestaña "En Progreso") 👇 */ }
      { isCompleted && !isProgressTab && (
        <View style={ [
          styles.cardButtons, { justifyContent: "flex-end", marginTop: 10 }
        ] }> {/* Alinea botón a la derecha y añade margen */ }
          <Pressable
            style={ [
              styles.button, styles.buttonOutline, { flex: 0.6 }
            ] } // Botón un poco más ancho
            onPress={ ( e ) => {
              e.stopPropagation()
              router.push( `/revision-trabajo/${ req.id }` )
            } } // Navega a la nueva ruta
          >
            <Text style={ [
              styles.buttonText, styles.buttonTextOutline
            ] }>Revisar</Text>
          </Pressable>
        </View>
      ) }
      {/* Si está Cancelado, no muestra botones */ }

    </Pressable>
  )
}


export default function HistorialMaestroScreen() {
  const router                                = useRouter()
  const [activeFilterTab, setActiveFilterTab] = useState( "Completados" ) // Cambiado a Completados por defecto
  const filterTabs                            = [
    "En curso", "Completados", "Cancelados"
  ]
  //getRequestsWorker
  const {getRequestsWorker} = useAuth()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      const loadRequests = async () => {
        setLoading(true)
        try {
          const data = await getRequestsWorker(activeFilterTab.toLowerCase())
          console.log("data de historial_maestro")
          console.log(data)
          setRequests(data)
        } catch (error) {
          console.error('Error loading requests:', error)
        } finally {
          setLoading(false)
        }
      }
  
      loadRequests()
    }, [activeFilterTab])
  // --- Función para renderizar el contenido ---
  const renderTabContent = () => {
    // @ts-ignore
    const isProgressTab = activeFilterTab === "En curso"
    console.log("requests de renderTabContent")
    console.log(requests)

    if ( requests.length === 0 ) {
      return <Text style={ styles.emptyText }>No hay
        trabajos { activeFilterTab.toLowerCase() } en tu historial.</Text>
    }

    return requests.map( req => (
      <HistoryCard key={ req.id } req={ req } router={ router }
                   isProgressTab={ isProgressTab }/>
    ) )
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* Encabezado de la pantalla */ }
      <Stack.Screen
        options={ {
          headerShown        : true,
          title              : "Historial",
          headerShadowVisible: false,
          headerStyle        : { backgroundColor: "white" },
          headerTitleStyle   : { fontSize: 18, fontWeight: "bold" }
        } }
      />

      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* Pestañas de filtro internas */ }
        <View style={ styles.filterTabContainer }>
          { filterTabs.map( tab => (
            <Pressable
              key={ tab }
              style={ [
                styles.filterTab,
                activeFilterTab === tab && styles.filterTabActive
              ] }
              onPress={ () => setActiveFilterTab( tab ) }
            >
              <Text style={ [
                styles.filterTabText,
                activeFilterTab === tab && styles.filterTabTextActive
              ] }>{ tab }</Text>
            </Pressable>
          ) ) }
        </View>

        {/* Barra de Búsqueda */ }
        <View style={ styles.searchContainer }>
          <Ionicons name="search-outline" size={ 20 } color="#999"
                    style={ styles.searchIcon }/>
          <TextInput
            style={ styles.searchInput }
            placeholder="Buscar en historial"
            placeholderTextColor="#999"
          />
        </View>

        {/* Header de la lista */ }
        <View style={ styles.listHeader }>
          {/* @ts-ignore */ }
          <Text
            style={ styles.listTitle }>{ requests?.length ||
            0 } trabajos { activeFilterTab.toLowerCase() }</Text>
        </View>

        {/* Renderizado del contenido */ }
        { renderTabContent() }

      </ScrollView>
    </SafeAreaView>
  )
}

// --- ESTILOS ---
const styles = StyleSheet.create( {
  container          : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent      : { padding: 20 },
  filterTabContainer : {
    flexDirection  : "row",
    backgroundColor: "#EAECEE",
    borderRadius   : 20,
    padding        : 4,
    marginBottom   : 20
  },
  filterTab          : {
    flex           : 1,
    paddingVertical: 10,
    borderRadius   : 18,
    alignItems     : "center"
  },
  filterTabActive    : {
    backgroundColor: "white",
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 1 },
    shadowOpacity  : 0.1,
    shadowRadius   : 5,
    elevation      : 3
  },
  filterTabText      : {
    color     : "#7F8C8D",
    fontWeight: "500"
  },
  filterTabTextActive: {
    color     : "#3498DB",
    fontWeight: "bold"
  },
  searchContainer    : {
    flexDirection    : "row",
    alignItems       : "center",
    backgroundColor  : "#EAECEE",
    borderRadius     : 10,
    paddingHorizontal: 15,
    marginBottom     : 30
  },
  searchIcon         : {
    marginRight: 10
  },
  searchInput        : {
    flex           : 1,
    paddingVertical: 15,
    fontSize       : 16
  },
  listHeader         : {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center",
    marginBottom  : 15
  },
  listTitle          : {
    fontSize  : 16,
    fontWeight: "bold"
  },
  jobCard            : {
    backgroundColor: "white",
    borderRadius   : 15,
    padding        : 20,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 2 },
    shadowOpacity  : 0.05,
    shadowRadius   : 10,
    elevation      : 3,
    marginBottom   : 15
  },
  cardTopRow         : {
    flexDirection: "row",
    alignItems   : "center",
    marginBottom : 10,
  },
  cardDate           : {
    fontSize   : 14,
    color      : "#7F8C8D",
  },
  cardTimeRemaining  : {
    fontSize  : 14,
    color     : "#E74C3C",
    fontWeight: "bold",
  },
  cardAceptedAt  : {
    fontSize  : 14,
    color     : "#00AA00",
    fontWeight: "bold"
  },
  cardDaysRemaining  : {
    fontSize   : 14,
    color      : "#7F8C8D",
    marginRight: "auto"
  },
  statusBadge        : {
    paddingHorizontal: 10,
    paddingVertical  : 5,
    borderRadius     : 15,
    marginLeft: "auto"
  },
  statusInProgress   : { backgroundColor: "#D6EAF8" /* Azul claro */ },
  statusCompleted    : { backgroundColor: "#D4EDDA" /* Verde claro */ },
  statusCancelled    : { backgroundColor: "#F8D7DA" /* Rojo claro */ },

  statusText          : { fontSize: 12, fontWeight: "bold" },
  statusTextInProgress: { color: "#3498DB" /* Azul oscuro */ },
  statusTextCompleted : { color: "#155724" /* Verde oscuro */ },
  statusTextCancelled : { color: "#721C24" /* Rojo oscuro */ },

  cardJobNumber: {
    fontSize    : 14,
    color       : "#7F8C8D",
    marginBottom: 5
  },
  cardTitle    : {
    fontSize    : 18,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginBottom: 5
  },
  cardLocation : {
    fontSize    : 14,
    color       : "#7F8C8D",
    marginBottom: 10
  },
  cardPrice    : {
    fontSize  : 18,
    fontWeight: "bold",
    color     : "#2C3E50"
    // marginBottom quitado o ajustado si hay botón
  },
  // Contenedor y estilos de botones
  cardButtons      : {
    flexDirection : "row",
    justifyContent: "space-between", // Cambiado para botones condicionales
    gap           : 10,
    marginTop     : 15 // Añadido margen superior para separar del precio
  },
  button           : {
    // flex: 1, // Quitamos flex:1 para que el botón no ocupe todo el espacio
    paddingVertical  : 10, // Un poco menos de padding vertical
    paddingHorizontal: 15, // Padding horizontal
    borderRadius     : 20, // Más redondeado
    alignItems       : "center"
  },
  buttonOutline    : {
    backgroundColor: "transparent",
    borderWidth    : 1,
    borderColor    : "#3498DB"
  },
  buttonSolid      : {
    backgroundColor: "#3498DB"
  },
  buttonText       : {
    fontWeight: "bold",
    fontSize  : 12, // Texto más pequeño para botones
    color     : "white"
  },
  buttonTextOutline: {
    color   : "#3498DB",
    fontSize: 12 // Texto más pequeño para botones
  },
  emptyText        : {
    textAlign: "center",
    marginTop: 50,
    fontSize : 16,
    color    : "#7F8C8D"
  }
} )