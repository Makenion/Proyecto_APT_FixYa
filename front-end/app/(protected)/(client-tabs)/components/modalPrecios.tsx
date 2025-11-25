import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

function modalPrecios() {
  
    return (
        <View style={styles.container}>
            <Pressable style={styles.containerPressable}>

            </Pressable>
        </View>
  )
}

export default modalPrecios

const styles = StyleSheet.create( {container: { flex: 1, backgroundColor: "#F7F8FA" },
containerPressable: {
    flex: 1, backgroundColor: "#000000"
}} )