import { useAuth } from "@/hooks/auth_context"
import {
  Ionicons
} from "@expo/vector-icons"
import {
  Stack,
  useRouter
} from "expo-router"
import React from "react"
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native"
import {
  SafeAreaView
} from "react-native-safe-area-context"


const ListItem = ( { icon, text, onPress }: {
  icon: any;
  text: string;
  onPress?: () => void
} ) => {
  return (
    <Pressable style={ styles.listItem } onPress={ onPress }>
      <View style={ styles.listItemContent }>
        <Ionicons name={ icon } size={ 24 } color="#555"
                  style={ styles.listItemIcon }/>
        <Text style={ styles.listItemText }>{ text }</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={ 20 } color="#BDBDBD"/>
    </Pressable>
  )
}

// --- Datos para el menú ---
const menuOptions = [
  // La ruta ya está correcta porque moviste el archivo
  {
    icon : "wallet-outline",
    text : "Mi billetera",
    route: "/informacion-bancaria"
  },
  { icon: "settings-outline", text: "Configuración" },
  { icon: "lock-closed-outline", text: "Privacidad y seguridad" },
  { icon: "document-text-outline", text: "Solicitudes" },
  { icon: "log-out-outline", text: "Cerrar sesión" }
]

export default function PerfilScreen() {
  const router = useRouter()
const {logout, user} = useAuth()
  return (
    <SafeAreaView style={ styles.container }>
      <Stack.Screen
        options={ {
          headerShown: true,
          title      : "Perfil",
          headerRight: () => (
            <Pressable
              onPress={ () => router.push( "/informacion-personaluser-edit" ) }>
              <Ionicons name="create-outline" size={ 24 } color="#3498DB"
                        style={ { marginRight: 15 } }/>
            </Pressable>
          )
        } }
      />

      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* --- Header del Perfil (sin el botón de editar) --- */ }
        <View style={ styles.header }>
          {/* La ruta de la imagen se corrigió a ../assets/... */ }
          <Image source={ require( "../../../assets/images/map.jpeg" ) }
                 style={ styles.avatar }/>
          <View>
            <Text style={ styles.name }>Nicolas Henandez</Text>
          </View>
        </View>

        {/* --- Tarjeta de Estadísticas --- */ }
        <View style={ styles.statsCard }>
          <Text style={ styles.statsMainText }><Text
            style={ { fontWeight: "bold" } }>170</Text> Trabajos
            solicitados</Text>
          <Text style={ styles.statsSubText }>Miembro desde 20/06/2020</Text>
          <Text style={ styles.statsSubText }>Puntuación alta ⭐</Text>
        </View>

        {/* --- Menú de Opciones --- */ }
        <View style={ styles.menuContainer }>
          { menuOptions.map( ( option, index ) => (
            <ListItem
              key={ index }
              icon={ option.icon }
              text={ option.text }
              // 👇 AQUÍ ESTÁ EL ÚNICO CAMBIO
              onPress={ async () => {
                if(option.icon === "log-out-outline"){
                  await logout()
                  router.replace('/(unregister)/login')
                  return
                }
                if ( option.route ) {
                  // 'as any' es para que TypeScript no se queje por el tipo de ruta
                  router.push( option.route as any )
                }
                else {
                  console.log( `Presionado: ${ option.text }` )
                }
              } }
            />
          ) ) }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

// ... (tus estilos van aquí, no cambiaron)
const styles = StyleSheet.create( {
  container      : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent  : { paddingHorizontal: 20, paddingTop: 20 },
  header         : {
    flexDirection : "row",
    alignItems    : "center",
    justifyContent: "flex-start", // Alinea el contenido a la izquierda
    marginBottom  : 30,
    gap           : 15 // Añade un espacio entre la imagen y el nombre
  },
  avatar         : {
    width       : 60,
    height      : 60,
    borderRadius: 30
  },
  name           : {
    fontSize  : 20,
    fontWeight: "bold",
    color     : "#2C3E50"
  },
  statsCard      : {
    backgroundColor: "white",
    borderRadius   : 15,
    padding        : 20,
    alignItems     : "center",
    marginBottom   : 30,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 2 },
    shadowOpacity  : 0.05,
    shadowRadius   : 10,
    elevation      : 3
  },
  statsMainText  : {
    fontSize    : 16,
    color       : "#2C3E50",
    marginBottom: 8
  },
  statsSubText   : {
    fontSize: 14,
    color   : "#7F8C8D"
  },
  menuContainer  : {
    backgroundColor: "white",
    borderRadius   : 15,
    overflow       : "hidden"
  },
  listItem       : {
    flexDirection    : "row",
    alignItems       : "center",
    justifyContent   : "space-between",
    padding          : 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0"
  },
  listItemContent: {
    flexDirection: "row",
    alignItems   : "center"
  },
  listItemIcon   : {
    marginRight: 15
  },
  listItemText   : {
    fontSize: 16,
    color   : "#34495E"
  }
} )