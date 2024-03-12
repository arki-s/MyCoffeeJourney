import React, { useState, useEffect, Suspense } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite/next';
import Home from './Screens/Home';
import Colors from './App/Styles/Colors';

const Tab = createBottomTabNavigator();
const db = SQLite.openDatabase('MyCoffeeJourney.db');

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
    </Tab.Navigator>
  );
}

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<SQLite.SQLResultSet | null>(null);

  // console.log(FileSystem.documentDirectory + 'SQLite/');

  useEffect(() => {
    db.transactionAsync(async (tx) => {
      await tx.executeSqlAsync(
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, userEmail TEXT)
         CREATE TABLE IF NOT EXISTS coffee ()
         CREATE TABLE IF NOT EXISTS cofeeBrand ()
         CREATE TABLE IF NOT EXISTS coffeeBean ()
         CREATE TABLE IF NOT EXISTS record ()
         CREATE TABLE IF NOT EXISTS review ();`,
      );
    })

    setIsLoading(false);

  }, [db]);

  const [fontsLoaded] = useFonts({
    'Ojuju-B': require('./assets/fonts/Ojuju-Bold.ttf'),
    'Ojuju-M': require('./assets/fonts/Ojuju-Medium.ttf'),
    'Ojuju-L': require('./assets/fonts/Ojuju-Light.ttf'),
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Ojuju-B', fontSize: 18 }}>Now Loading...</Text>
      </View>
    )
  }

  return (
    <Suspense fallback={
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
        <ActivityIndicator size={"large"} color={Colors.PRIMARY} />
      </View>
    }>
      <SQLiteProvider databaseName='MyCoffeeJourney.db' useSuspense>
        <NavigationContainer>
          <MyTabs />
        </NavigationContainer>
      </SQLiteProvider>
    </Suspense>
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
