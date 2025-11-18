import React, { useState } from "react"
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
}                          from "react-native"
import {
  SafeAreaView
}                          from "react-native-safe-area-context"
import {
  Ionicons
}                          from "@expo/vector-icons"
import {
  Stack,
  useRouter
}                          from "expo-router"
import { useAuth }         from "@/hooks/auth_context"

const maestro = {
  nombre             : "Esteban",
  apellido           : "Carpintero",
  horasTrabajadas    : 80,
  trabajosSiguientes : 4,
  trabajosCompletados: 20
}

type Oferta = {
  id: number;
  titulo: string;
  fecha: string;
  duracion: string;
  estado: string;
  ubicacion: string;
  precio: string;
};

const ofertas: Oferta[] = [
  {
    id       : 212, // Trabajo #212
    titulo   : "Reparación fuga gas",
    fecha    : "20/09/25",
    duracion : "1 día",
    estado   : "Urgente", // Estado "Urgente"
    ubicacion: "San alfonso 550, Viña del mar, 2km",
    precio   : "$50.000"
  },
  {
    id       : 213,
    titulo   : "Remodelación techo",
    fecha    : "20/09/25",
    duracion : "3 días",
    estado   : "Disponible", // Estado "Disponible"
    ubicacion: "Calle las rosas 37, Viña del Mar, 2km.",
    precio   : "$30.000"
  }
]

const OfferCard = ( { oferta, router, onAcceptPress }: {
  oferta: Oferta,
  router: any,
  onAcceptPress: ( oferta: Oferta ) => void
} ) => {

  const isUrgente      = oferta.estado === "Urgente"
  const badgeStyle     = isUrgente
    ? styles.urgenteBadge
    : styles.disponibleBadge
  const badgeTextStyle = isUrgente ? styles.urgenteText : styles.disponibleText

  return (
    <View style={ styles.card }>
      {/* ... (Header, Título, Ubicación no cambian) ... */ }
      <View style={ styles.cardHeader }>
        <Text style={ styles.cardDate }>{ oferta.fecha }</Text>
        <Text style={ styles.cardDuration }>{ oferta.duracion }</Text>
        <View style={ badgeStyle }>
          <Text style={ badgeTextStyle }>{ oferta.estado }</Text>
        </View>
      </View>
      <Text style={ styles.cardTitle }>{ oferta.titulo }</Text>
      <View style={ styles.locationContainer }>
        <Ionicons name="location-outline" size={ 16 } color="#555"/>
        <Text style={ styles.locationText }>{ oferta.ubicacion }</Text>
      </View>

      {/* Footer de la tarjeta (MODIFICADO con 2 botones) */ }
      <View style={ styles.cardFooter }>
        <Text style={ styles.price }>{ oferta.precio }</Text>

        <View style={ styles.cardButtonsContainer }>
          <Pressable
            style={ styles.buttonOutline } // Botón "Detalles" con borde
            onPress={ () => router.push(
              `/detalles-trabajo-maestro/${ oferta.id }` ) }
          >
            <Text style={ styles.buttonTextOutline }>Detalles</Text>
          </Pressable>
          <Pressable
            style={ styles.buttonSolid } // Botón "Aceptar Trabajo" sólido
            // 👇 4. Llama a la función del componente padre
            onPress={ () => onAcceptPress( oferta ) }
          >
            <Text style={ styles.buttonTextSolid }>Aceptar Trabajo</Text>
          </Pressable>
        </View>

      </View>
    </View>
  )
}


export default function MaestroDashboardScreen() {
  const router = useRouter()
  const {user} = useAuth()

  // 👇 5. Estados para el modal
  const [modalVisible, setModalVisible] = useState( false )
  const [selectedJob, setSelectedJob]   = useState<Oferta | null>( null )

  // 👇 6. Funciones para manejar el modal
  const handleOpenAcceptModal = ( oferta: Oferta ) => {
    setSelectedJob( oferta ) // Guarda el trabajo seleccionado
    setModalVisible( true ) // Abre el modal
  }

  const handleConfirmAcceptJob = () => {
    if ( !selectedJob ) return

    console.log( "Aceptando trabajo:", selectedJob.id )
    // Aquí iría tu lógica de backend para aceptar el trabajo...

    setModalVisible( false ) // Cierra el modal

    // Navega a la pantalla de seguimiento de ese trabajo
    router.push( `/seguimiento-trabajo/${ selectedJob.id }` )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <Stack.Screen options={ { headerShown: false } }/>
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        <View style={ styles.header }>
          <View style={ styles.userInfo }>
            <Image
              source={ { uri: "https://placehold.co/50x50/FAD7A0/C0392B?text=🧑" } }
              style={ styles.avatar }
            />
            <View>
              <Text style={ styles.greeting }>Bienvenido, <Text
                style={ { color: "#3498DB" } }>{ user?.full_name }</Text></Text>
            </View>
          </View>
          <View style={ styles.headerIcons }>
            <Pressable>
              <Ionicons name="chatbubble-ellipses-outline" size={ 24 }
                        color="#555" style={ styles.icon }/>
            </Pressable>
            <Pressable>
              <Ionicons name="notifications-outline" size={ 24 } color="#555"
                        style={ styles.icon }/>
            </Pressable>
          </View>
        </View>
        <Text style={ styles.hoursText }>Horas trabajadas: <Text
          style={ { fontWeight: "bold" } }>{ maestro.horasTrabajadas }</Text></Text>
        <View style={ styles.statsContainer }>
          <View style={ styles.statBox }>
            <Text
              style={ styles.statNumber }>{ maestro.trabajosSiguientes }</Text>
            <Text style={ styles.statLabel }>Trabajos siguientes:</Text>
          </View>
          <View style={ styles.statBox }>
            <Text
              style={ styles.statNumber }>{ maestro.trabajosCompletados }</Text>
            <Text style={ styles.statLabel }>Trabajos completados:</Text>
          </View>
        </View>
        <View style={ styles.searchSection }>
          <Text style={ styles.sectionTitle }>Ofertas disponibles</Text>
          <Pressable onPress={ () => console.log( "Ver todas las ofertas" ) }>
            <Text style={ styles.seeAll }>Ver todas</Text>
          </Pressable>
        </View>
        { ofertas.map( oferta => (
          <OfferCard
            key={ oferta.id }
            oferta={ oferta }
            router={ router }
            onAcceptPress={ handleOpenAcceptModal }
          />
        ) ) }
        <View style={ styles.searchSection }>
          <Text style={ styles.sectionTitle }>En progreso</Text>
        </View>
        <View style={ [styles.card, styles.inProgressCard] }>
          <Text style={ styles.inProgressText }>Aún no tienes trabajos en
            progreso.</Text>
        </View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={ true }
        visible={ modalVisible }
        onRequestClose={ () => setModalVisible( false ) }
      >
        <Pressable
          style={ styles.modalOverlay }
          onPress={ () => setModalVisible( false ) }
        >
          <Pressable
            style={ styles.modalContent }
            onPress={ () => {
            } }
          >
            <Ionicons name="thumbs-up-outline" size={ 70 } color="#3498DB"
                      style={ { marginBottom: 15 } }/>

            <Text style={ styles.modalTitle }>Aceptar trabajo?</Text>

            <Pressable
              style={ styles.modalButtonSolid }
              onPress={ handleConfirmAcceptJob }
            >
              <Text style={ styles.modalButtonTextSolid }>Aceptar</Text>
            </Pressable>

            <Pressable
              style={ styles.modalButtonCancel }
              onPress={ () => setModalVisible( false ) }
            >
              <Text style={ styles.modalButtonTextCancel }>CANCELAR</Text>
            </Pressable>

          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  )
}

// --- ESTILOS (Añadidos estilos de modal) ---
const styles = StyleSheet.create( {
  // ... (tus estilos anteriores: container, header, stats, card, etc.)
  container           : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent       : { padding: 20 },
  header              : {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center",
    marginBottom  : 20
  },
  userInfo            : { flexDirection: "row", alignItems: "center" },
  avatar              : {
    width       : 50,
    height      : 50,
    borderRadius: 25,
    marginRight : 10
  },
  greeting            : { fontSize: 16, fontWeight: "500", color: "#2C3E50" },
  maestroSubtitle     : { fontSize: 14, color: "#7F8C8D" },
  headerIcons         : { flexDirection: "row" },
  icon                : { fontSize: 24, marginLeft: 15 },
  hoursText           : {
    fontSize    : 14,
    color       : "#7F8C8D",
    textAlign   : "center",
    marginBottom: 15
  },
  statsContainer      : { flexDirection: "row", gap: 15, marginBottom: 30 },
  statBox             : {
    flex           : 1,
    backgroundColor: "white",
    borderRadius   : 10,
    padding        : 15,
    alignItems     : "center",
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 1 },
    shadowOpacity  : 0.05,
    shadowRadius   : 5,
    elevation      : 2
  },
  statNumber          : { fontSize: 22, fontWeight: "bold", color: "#3498DB" },
  statLabel           : { fontSize: 14, color: "#555" },
  searchSection       : {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center",
    marginBottom  : 15
  },
  sectionTitle        : { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  seeAll              : { fontSize: 14, color: "#3498DB", fontWeight: "bold" },
  card                : {
    backgroundColor: "white",
    padding        : 15,
    borderRadius   : 15,
    marginBottom   : 15,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 2 },
    shadowOpacity  : 0.1,
    shadowRadius   : 5,
    elevation      : 3
  },
  cardHeader          : {
    flexDirection: "row",
    alignItems   : "center",
    marginBottom : 10
  },
  cardDate            : { fontSize: 12, color: "#7F8C8D" },
  cardDuration        : { fontSize: 12, color: "#7F8C8D", marginLeft: 10 },
  disponibleBadge     : {
    backgroundColor  : "#E0F7FA",
    borderRadius     : 15,
    paddingHorizontal: 12,
    paddingVertical  : 5,
    marginLeft       : "auto"
  },
  disponibleText      : { color: "#00838F", fontSize: 12, fontWeight: "bold" },
  urgenteBadge        : {
    backgroundColor  : "#E74C3C",
    borderRadius     : 15,
    paddingHorizontal: 12,
    paddingVertical  : 5,
    marginLeft       : "auto"
  },
  urgenteText         : { color: "white", fontSize: 12, fontWeight: "bold" },
  cardTitle           : {
    fontSize    : 16,
    fontWeight  : "bold",
    color       : "#34495E",
    marginBottom: 10
  },
  locationContainer   : {
    flexDirection: "row",
    alignItems   : "center",
    gap          : 5,
    marginBottom : 15
  },
  locationText        : { fontSize: 14, color: "#555", flexShrink: 1 },
  cardFooter          : {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop    : 15
  },
  price               : { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  cardButtonsContainer: { flexDirection: "row", gap: 10 },
  buttonOutline       : {
    backgroundColor  : "white",
    paddingVertical  : 10,
    paddingHorizontal: 18,
    borderRadius     : 20,
    borderWidth      : 1,
    borderColor      : "#3498DB"
  },
  buttonTextOutline   : { color: "#3498DB", fontWeight: "bold", fontSize: 12 },
  buttonSolid         : {
    backgroundColor  : "#3498DB",
    paddingVertical  : 10,
    paddingHorizontal: 18,
    borderRadius     : 20
  },
  buttonTextSolid     : { color: "white", fontWeight: "bold", fontSize: 12 },
  inProgressCard      : {
    alignItems     : "center",
    justifyContent : "center",
    height         : 100,
    borderWidth    : 1,
    borderColor    : "#EAECEE",
    backgroundColor: "#FDFEFE"
  },
  inProgressText      : { fontSize: 14, color: "#7F8C8D" },

  // --- 👇 9. ESTILOS PARA EL MODAL ---
  modalOverlay         : {
    flex           : 1,
    justifyContent : "center",
    alignItems     : "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContent         : {
    width          : "85%",
    backgroundColor: "white",
    borderRadius   : 15,
    padding        : 25,
    alignItems     : "center",
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 2 },
    shadowOpacity  : 0.25,
    shadowRadius   : 4,
    elevation      : 5
  },
  modalTitle           : {
    fontSize    : 18,
    fontWeight  : "bold",
    color       : "#2C3E50",
    marginBottom: 25,
    textAlign   : "center"
  },
  modalButtonSolid     : {
    backgroundColor: "#3498DB",
    paddingVertical: 14,
    borderRadius   : 30,
    alignItems     : "center",
    width          : "100%"
  },
  modalButtonTextSolid : {
    color     : "white",
    fontSize  : 16,
    fontWeight: "bold"
  },
  modalButtonCancel    : {
    marginTop: 15,
    padding  : 10
  },
  modalButtonTextCancel: {
    color     : "#7F8C8D",
    fontSize  : 14,
    fontWeight: "bold"
  }
} )