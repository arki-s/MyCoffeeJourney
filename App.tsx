import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';


export default function App() {
  const [fontsLoaded] = useFonts({
    'Ojuju-B': require('./assets/fonts/Ojuju-Bold.ttf'),
    'Ojuju-M': require('./assets/fonts/Ojuju-Medium.ttf'),
    'Ojuju-L': require('./assets/fonts/Ojuju-Light.ttf'),
  });

  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Ojuju-B', fontSize: 18 }}>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
