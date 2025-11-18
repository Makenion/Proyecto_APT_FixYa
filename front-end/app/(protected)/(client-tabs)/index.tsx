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
  SafeAreaView
}            from "react-native-safe-area-context"
import {
  useRouter
}            from "expo-router"
import { useAuth } from "@/hooks/auth_context"

export default function HomeScreen() {
  const router = useRouter()
const {user} = useAuth()
  // Componente Card reutilizable
  const Card = ( {
    title,
    description,
    buttonText,
    isFormButton = false,
    onPress
  }: any ) => {
    return (
      <View style={ styles.card }>
        <Text style={ styles.cardTitle }>{ title }</Text>
        <Text style={ styles.cardDescription }>{ description }</Text>
        <Pressable
          style={ [styles.cardButton, isFormButton && styles.formButton] }
          onPress={ onPress }>
          <Text style={ [
            styles.cardButtonText, isFormButton && styles.formButtonText
          ] }>{ buttonText }</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={ styles.container }>
      <ScrollView contentContainerStyle={ styles.scrollContent }>
        {/* Header */ }
        <View style={ styles.header }>
          <View style={ styles.userInfo }>
            <Image source={ require( "../../../assets/images/map.jpeg" ) }
                   style={ styles.avatar }/>
            <Text style={ styles.greeting }>Bienvenido, <Text
              style={ { color: "#3498DB" } }>{user?.full_name}</Text></Text>
          </View>
          <View style={ styles.headerIcons }>
            <Text style={ styles.icon }>🖼️</Text>
            <Text style={ styles.icon }>🔔</Text>
          </View>
        </View>

        {/* Title and Search */ }
        <View style={ styles.searchSection }>
          <Text style={ styles.sectionTitle }>Qué necesitas hoy?</Text>
          <Pressable onPress={ () => router.push( "/buscar-maestros" ) }>
            <Text style={ styles.seeAll }>Ver todos</Text>
          </Pressable>
        </View>
        <TextInput
          style={ styles.searchInput }
          placeholder="Buscar especialista"
          placeholderTextColor="#999"
        />

        {/* Cards */ }
        <Card
          title="Arreglos"
          description="Necesitas arreglar un enchufe? o tu refrigerador no está funcionando correctamente?"
          buttonText="Ver maestros"
          onPress={ () => router.push( "/buscar-maestros" ) }
        />

        <Card
          title="Remodelaciones"
          description="Consulta nuestro creador de presupuestos para trabajos más extensos"
          buttonText="Ir a formulario"
          isFormButton={ true }
          onPress={ () => router.push( "/remodelaciones-form" ) }
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create( {
  container      : { flex: 1, backgroundColor: "#F7F8FA" },
  scrollContent  : { padding: 20 },
  header         : {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center",
    marginBottom  : 20
  },
  userInfo       : { flexDirection: "row", alignItems: "center" },
  avatar         : { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  greeting       : { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  headerIcons    : { flexDirection: "row" },
  icon           : { fontSize: 24, marginLeft: 15 },
  searchSection  : {
    flexDirection : "row",
    justifyContent: "space-between",
    alignItems    : "center",
    marginTop     : 15
  },
  sectionTitle   : { fontSize: 18, color: "#2C3E50" },
  seeAll         : { fontSize: 14, color: "#3498DB", fontWeight: "bold" },
  searchInput    : {
    backgroundColor: "#EAECEE",
    padding        : 15,
    borderRadius   : 10,
    marginTop      : 10,
    marginBottom   : 30,
    fontSize       : 16
  },
  card           : {
    backgroundColor: "white",
    padding        : 20,
    borderRadius   : 15,
    marginBottom   : 20,
    shadowColor    : "#000",
    shadowOffset   : { width: 0, height: 2 },
    shadowOpacity  : 0.1,
    shadowRadius   : 5,
    elevation      : 3
  },
  cardTitle      : { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  cardDescription: {
    fontSize    : 14,
    color       : "#7F8C8D",
    lineHeight  : 20,
    marginBottom: 20
  },
  cardButton     : {
    backgroundColor: "#3498DB",
    paddingVertical: 12,
    borderRadius   : 25,
    alignItems     : "center"
  },
  cardButtonText : { color: "white", fontWeight: "bold" },
  formButton     : {
    backgroundColor: "transparent",
    borderWidth    : 1,
    borderColor    : "#3498DB"
  },
  formButtonText : { color: "#3498DB" }
} )