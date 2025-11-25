import { useAuth } from "@/hooks/auth_context"
import { RegisterRequestWorkerPayload } from "@/models/sales/payload"
import {
  Ionicons
} from "@expo/vector-icons"
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView
} from '@gorhom/bottom-sheet'
import {
  Stack,
  useRouter
} from "expo-router"
import React, { useCallback, useEffect, useRef, useState } from "react"
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

export default function SolicitudesScreen() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("En curso")
  const tabs = ["Pendiente", "En curso", "Historial"]
  const { getRequestsCliente } = useAuth()
  const [loading, setLoading] = useState(false)
  const [requests, setRequests] = useState<any[]>([])
  const [valoresPropuestos, setValoresPropuestos] = useState<any[]>([])
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [currentRequestId, setCurrentRequestId] = useState<string>("0")
  const { getValueRequestClient,setValueStateCliente,registerWorkerRequest } = useAuth()

  // callbacks
  const handlePresentModalPress = useCallback(async (requestId: string) => {

    try {
      const valores = await getValueRequestClient(requestId)
      console.log("valores")
      console.log(valores)
      setValoresPropuestos(valores)
      setCurrentRequestId(requestId)
    } catch (error) {
      console.error('Error loading valores:', error)
      setValoresPropuestos([])
      setCurrentRequestId("0")
    } finally {
      setLoading(false)
    }
    bottomSheetModalRef.current?.present()
  }, [])
  const handleSheetChanges = useCallback((index: number) => {
    // Si se cierra el modal, limpiar el estado
    if (index === -1) {
      setValoresPropuestos([])
      setCurrentRequestId("0")
    }
  }, [])

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true)
      try {
        const data = await getRequestsCliente(activeTab.toLowerCase())
        setRequests(data)
      } catch (error) {
        console.error('Error loading requests:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [activeTab]) // Se ejecuta cuando activeTab cambia

  // useEffect(() => {
  //   const loadValoresPropuestos = async () => {
  //     if (!currentRequestId) return

  //     setLoading(true)
  //     try {
  //       const valores = await getValueRequestClient(currentRequestId)
  //       setValoresPropuestos(valores)
  //     } catch (error) {
  //       console.error('Error loading valores:', error)
  //       setValoresPropuestos([])
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   loadValoresPropuestos()
  // }, [currentRequestId])



  const movingResume = (request: any) => {
    const images = request.images
    router.push({
      pathname: "/resumen-solicitud-final",
      params: {
        title: request.title,
        description: request.description,
        value: request.value.toString(),
        estimated_time: request.estimated_time.toString(),
        status: request.status,
        location_text: request.location_text,
        ends_at: request.ends_at,
        complexity: request.complexity,
        // Para imágenes, pasar solo URLs o IDs
        imageUrls: images.map((img: { url: any }) => img.url).join(','), // Convertir array a string
        imageCount: images.length.toString()
      }
    })
  }

  const enviarEstadoValor = async (status : string, id: number, request_id = 0, worker_id = 0) => {
    
    const statusCode = await setValueStateCliente(status, id)
    console.log("statusCode del setValue")
    console.log(statusCode)

    if (status === 'aceptado' && statusCode === 200) {
      const payload: RegisterRequestWorkerPayload = {
        request_id: request_id,
        worker_id: worker_id,
      }
      await registerWorkerRequest(payload)
      setRequests(prev => prev.filter((_, i) => i !== request_id))
      setValoresPropuestos([])
    }

  }

  // --- 1. FUNCIÓN PARA RENDERIZAR EL CONTENIDO DE LA PESTAÑA ACTIVA ---
  const renderTabContent = () => {
    // @ts-ignore
    if (loading) {
      return <Text>Cargando solicitudes...</Text>
    }

    if (requests.length === 0) {
      return <Text style={styles.emptyText}>No hay solicitudes en esta categoría</Text>
    }

    return requests.map(request => (
      <View key={request.id} style={styles.requestCard}>
        <Pressable onPress={() => movingResume(request)}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardDate}>{request.date}</Text>
            <Text style={styles.cardJobNumber}>{request.jobNumber}</Text>
          </View>
          <Text style={styles.cardTitle}>{request.title}</Text>
          <Text style={styles.cardLocation}>
            <Ionicons name="location" size={14} color="#7F8C8D" />
            {" "}{request.location_text} <Text
              style={{ color: "#3498DB" }}>{request.distance}</Text>
          </Text>
        </Pressable>


        {activeTab === "Pendiente" ?
          <>
            <View style={styles.cardButtons}>
              <Pressable
                style={[styles.button, styles.buttonOutline]}
                onPress={() => { handlePresentModalPress(request.id) }}
              >
                <Text style={[
                  styles.buttonText, styles.buttonTextOutline
                ]}>Ver Precios</Text>
              </Pressable>
            </View>
            <View style={styles.cardButtons}>
              <Pressable
                style={[styles.button, styles.buttonOutline]}
                onPress={() => router.push({
                  pathname: "/(protected)/(client-tabs)/editar-solicitud",
                  params: { requestId: request.id }
                })}
              >
                <Text style={[
                  styles.buttonText, styles.buttonTextOutline
                ]}>Editar</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonSolid]}
                onPress={() => router.push({
                  pathname: "/cancelar-solicitud-modal",
                  params: { requestId: request.id }
                })}
              >
                <Text style={styles.buttonText}>Cancelar solicitud</Text>
              </Pressable>
            </View>
          </>
          :
          <View style={styles.cardButtons}>
            <Pressable
              style={[styles.button, styles.buttonOutline]}
              onPress={() => movingResume(request)}
            >
              <Text style={[styles.buttonText, styles.buttonTextOutline]}>Resumen
                solicitud</Text>
            </Pressable>

            {/* El botón "Cancelar solicitud" ha sido eliminado */}

          </View>}

      </View>
    ))

  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "Solicitudes" }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pestañas de filtro */}
        <View style={styles.tabContainer}>
          {tabs.map(tab => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText, activeTab === tab && styles.tabTextActive
              ]}>{tab}</Text>
            </Pressable>
          ))}
        </View>
        {/* Barra de Búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999"
            style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar solicitud"
            placeholderTextColor="#999"
          />
        </View>
        {/* Título de la lista */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {/* @ts-ignore */}
            {requests?.length || 0} Solicitud(es)
          </Text>
          <Text style={styles.listStatus}>{activeTab} ▼</Text>
        </View>
        {/* --- 3. Llamamos a la función de renderizado --- */}
        {renderTabContent()}
      </ScrollView>
      {activeTab === "Pendiente" ?
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={['50%', '90%']} // ← Puntos de snap para expansión
            onChange={handleSheetChanges}
            enablePanDownToClose={true} // ← Permite cerrar arrastrando
          >
            <BottomSheetView style={styles.contentContainerModal}>
              <Text style={styles.modalTitle}>
                Precios para solicitud #{currentRequestId}
              </Text>

              {loading ? (
                <Text>Cargando precios...</Text>
              ) : valoresPropuestos.length > 0 ? (
                valoresPropuestos.map((valor, index) => (
                  <View key={index} style={styles.valorCardModal}>
                    <View style={styles.cardContent}>
                      <View style={styles.textContainer}>
                        <Text style={styles.valorText}>
                          ${valor.value_proposed}
                        </Text>
                        <Text style={styles.workerText}>
                          Worker ID: {valor.worker_detail_id}
                        </Text>
                      </View>

                      <View style={styles.cardButtonsModal}>
                        <Pressable
                          style={[styles.button, styles.buttonOutline]}
                          onPress={() => { 
                            enviarEstadoValor('aceptado',valor.id, Number(currentRequestId),valor.worker_detail_id)}}
                        >
                          <Text style={[styles.buttonText, styles.buttonTextOutline]}>
                            Aceptar
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[styles.button, styles.buttonSolid]}
                          onPress={() => { enviarEstadoValor('rechazado',Number(valor.id),0) 
                            setValoresPropuestos(prev => prev.filter((_, i) => i !== index))
                          }}
                        >
                          <Text style={styles.buttonText}>Cancelar</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>
                  No hay precios propuestos para esta solicitud
                </Text>
              )}
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
        : <></>}

    </SafeAreaView>
  )

}

// --- TUS ESTILOS (PERMANECEN IGUALES) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent: { padding: 20 },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#EAECEE",
    borderRadius: 20,
    padding: 4,
    marginBottom: 20
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: "center"
  },
  tabActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  tabText: {
    color: "#7F8C8D",
    fontWeight: "500"
  },
  tabTextActive: {
    color: "#3498DB",
    fontWeight: "bold"
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EAECEE",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 30
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold"
  },
  listStatus: {
    fontSize: 14,
    color: "#7F8C8D"
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 15
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  cardDate: {
    fontSize: 14,
    color: "#7F8C8D"
  },
  cardJobNumber: {
    fontSize: 14,
    color: "#7F8C8D"
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginVertical: 5
  },
  cardLocation: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 20
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center"
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3498DB"
  },
  buttonSolid: {
    backgroundColor: "#3498DB"
  },
  buttonText: {
    fontWeight: "bold",
    color: "white"
  },
  buttonTextOutline: {
    color: "#3498DB"
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#7F8C8D",
    marginTop: 40
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainerModal: {
    flex: 1,
    justifyContent: 'space-between', // ← Separa los elementos
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 15,
  },
  valorCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#FF0000',
    borderWidth: 10,
    padding: 16,
    borderRadius: 12,
    marginBottom: 5,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: 'auto',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  valorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  workerText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  valorCardModal: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    width: '100%', // ← Ocupa todo el ancho
  },
  cardContent: {
    flexDirection: 'row', // ← Texto a la izquierda, botones a la derecha
    justifyContent: 'space-between', // ← Separa los elementos
    alignItems: 'flex-start', // ← Alinea al inicio
  },
  textContainer: {
    flex: 1, // ← Toma todo el espacio disponible
    marginRight: 12, // ← Espacio entre texto y botones
  },
  cardButtonsModal: {
    flexDirection: 'row', // ← Botones en columna
    alignItems: 'flex-end', // ← Alinea a la derecha
    width: 200,
    gap: 8, // ← Espacio entre botones
  },
})