import React from "react"
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
}            from "react-native"
import {
  Ionicons
}            from "@expo/vector-icons"
import {
  Stack,
  useRouter
}            from "expo-router"
import {
  SafeAreaView
}            from "react-native-safe-area-context"

// Datos de ejemplo para la lista de maestros
const maestros = [
  {
    id          : "1",
    name        : "Camilo Apablaza",
    specialty   : "Pintor especialista",
    rating      : 4.5,
    availability: "Lunes a Viernes de 08:00 AM a 18:00 PM",
    avatar      : require( "../assets/images/user.jpeg" )
  },
  {
    id          : "2",
    name        : "Esteban Tamayo",
    specialty   : "Pintor enfocado en interiores",
    rating      : 5.0,
    availability: "Lunes a Miercoles de 08:00 AM a 18:00 PM",

    avatar: require( "../assets/images/user.jpeg" )
  }
]


const MaestroCard = ( { maestro, router }: {
  maestro: typeof maestros[0],
  router: any
} ) => { // Pasamos router como prop

  const handlePress = () => {
    // Navegación corregida
    router.push( `/maestro-profile/${ maestro.id }` )
  }

  return (
    <View style={ styles.maestroCard }>
      <View style={ styles.cardHeader }>
        <Image source={ maestro.avatar } style={ styles.avatar }/>
        <View style={ styles.headerText }>
          <Text style={ styles.maestroName }>{ maestro.name }</Text>
          <Text style={ styles.maestroSpecialty }>{ maestro.specialty }</Text>
        </View>
        <View style={ styles.rating }>
          <Text style={ styles.ratingText }>{ maestro.rating.toFixed(
            1 ) }</Text>
          <Ionicons name="star" size={ 16 } color="#FFC107"/>
        </View>
      </View>
      <View style={ styles.availability }>
        <Text style={ styles.availabilityTitle }>Disponibilidad</Text>
        <Text style={ styles.availabilityText }>{ maestro.availability }</Text>
      </View>
      <Pressable style={ styles.profileButton } onPress={ handlePress }>
        <Text style={ styles.profileButtonText }>Ver perfil</Text>
      </Pressable>
    </View>
  )
}

export default function BuscarMaestrosScreen() {
  const router = useRouter() // Inicializamos router aquí

  const goToForm = () => {
    // 👇 Asegúrate de que esta ruta sea correcta para tu formulario
    // Lo ponemos en la raíz para que tenga flecha de atrás
    router.push( "/formulario-arreglos" )
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* Ajustamos título y fondo */ }
      <Stack.Screen
        options={ {
          headerShown        : true,
          title              : "Buscar maestros",
          headerShadowVisible: false,
          headerStyle        : { backgroundColor: "#F7F8FA" }
        } }
      />
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* Barra de Búsqueda */ }
        <View style={ styles.searchContainer }>
          <Ionicons name="search-outline" size={ 20 } color="#999"
                    style={ styles.searchIcon }/>
          <TextInput
            style={ styles.searchInput }
            placeholder="Pintor" // Podrías pasar esto como parámetro si vienes de otra pantalla
            placeholderTextColor="#999"
          />
        </View>

        {/* Resultados */ }
        <Text style={ styles.resultsTitle }>Resultados de búsqueda:</Text>

        { maestros.map( maestro => (
          // Pasamos router a MaestroCard
          <MaestroCard key={ maestro.id } maestro={ maestro }
                       router={ router }/>
        ) ) }

        {/* --- NUEVA SECCIÓN: IR AL FORMULARIO --- */ }
        <View style={ styles.formShortcutContainer }>
          <Text style={ styles.formShortcutText }>
            O si prefieres, puedes ir directamente al formulario y se te
            asignará un trabajador:
          </Text>
          <Pressable onPress={ goToForm }>
            <Text style={ styles.formShortcutLink }>Ir al formulario</Text>
          </Pressable>
        </View>
        {/* --- FIN NUEVA SECCIÓN --- */ }

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container        : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent    : { padding: 20, paddingBottom: 40 }, // Más padding abajo
  searchContainer  : {
    flexDirection    : "row",
    alignItems       : "center",
    backgroundColor  : "white",
    borderRadius     : 10,
    paddingHorizontal: 15,
    marginBottom     : 20,
    borderWidth      : 1,
    borderColor      : "#EAECEE"
  }, // Borde añadido
  searchIcon       : { marginRight: 10 },
  searchInput      : { flex: 1, paddingVertical: 12, fontSize: 16 }, // Padding vertical ajustado
  resultsTitle     : {
    fontSize    : 16,
    fontWeight  : "bold",
    color       : "#333",
    marginBottom: 15
  },
  maestroCard      : {
    backgroundColor: "white",
    padding        : 15,
    borderRadius   : 15,
    marginBottom   : 15,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 1 },
    shadowOpacity  : 0.05,
    shadowRadius   : 5,
    elevation      : 2
  }, // Padding y sombra ajustados
  cardHeader       : {
    flexDirection: "row",
    alignItems   : "center",
    marginBottom : 10
  }, // Menos margen
  avatar           : {
    width       : 50,
    height      : 50,
    borderRadius: 25,
    marginRight : 15
  },
  headerText       : { flex: 1 },
  maestroName      : { fontSize: 16, fontWeight: "bold", color: "#2C3E50" }, // Color ajustado
  maestroSpecialty : { fontSize: 14, color: "#7F8C8D" },
  rating           : { flexDirection: "row", alignItems: "center" },
  ratingText       : { fontSize: 16, fontWeight: "bold", marginRight: 3 }, // Menos margen
  availability     : { marginBottom: 15 }, // Menos margen
  availabilityTitle: {
    fontSize    : 14,
    fontWeight  : "bold",
    color       : "#333",
    marginBottom: 3
  }, // Menos margen
  availabilityText : { fontSize: 14, color: "#7F8C8D" },
  profileButton    : {
    backgroundColor: "#3498DB",
    paddingVertical: 12,
    borderRadius   : 25,
    alignItems     : "center"
  },
  profileButtonText: { color: "white", fontWeight: "bold", fontSize: 14 }, // Tamaño ajustado

  // --- NUEVOS ESTILOS ---
  formShortcutContainer: {
    marginTop     : 20, // Espacio después de la lista
    paddingTop    : 20,
    borderTopWidth: 1,
    borderTopColor: "#EAECEE",
    alignItems    : "center" // Centra el contenido
  },
  formShortcutText     : {
    fontSize    : 14,
    color       : "#555",
    textAlign   : "center",
    marginBottom: 10,
    lineHeight  : 20 // Mejor espaciado de línea
  },
  formShortcutLink     : {
    fontSize  : 16,
    color     : "#3498DB",
    fontWeight: "bold",
    padding   : 10 // Área táctil más grande
  }
} )