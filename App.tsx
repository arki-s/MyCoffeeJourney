import React, { useState, useEffect, Suspense } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite/next';
import Home from './Screens/Home';
import Colors from './App/Styles/Colors';
import CoffeeIndex from './Screens/CoffeeIndex';
import ReviewIndex from './Screens/ReviewIndex';
import Analytics from './Screens/Analytics';
import RecordIndex from './Screens/RecordIndex';

const Tab = createBottomTabNavigator();
const db = SQLite.openDatabase('MyCoffeeJourney.db');

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ホーム" component={Home} />
      <Tab.Screen name="My図鑑" component={CoffeeIndex} />
      <Tab.Screen name="履歴" component={RecordIndex} />
      <Tab.Screen name="感想" component={ReviewIndex} />
      <Tab.Screen name="分析" component={Analytics} />
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
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          userEmail TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS coffeeBean (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            );
          CREATE TABLE IF NOT EXISTS coffeeBrand (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            );
          CREATE TABLE IF NOT EXISTS coffee (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          photo BLOB,
          favorite INTEGER DEFAULT 0,
          drinkCount INTEGER DEFAULT 0,
          comment TEXT,
          roast INTEGER DEFAULT 3,
          body INTEGER DEFAULT 3,
          sweetness INTEGER DEFAULT 3,
          fruity INTEGER DEFAULT 3,
          bitter INTEGER DEFAULT 3,
          aroma INTEGER DEFAULT 3,
          FOREIGN KEY (coffeeBrand_id) REFERENCES coffeeBrand (id))
         CREATE TABLE IF NOT EXISTS inclusion (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          FOREIGN KEY (coffee_id) REFERENCES coffee (id),
          FOREIGN KEY (coffeeBena_id) REFERENCES coffeeBean (id)
         );
         CREATE TABLE IF NOT EXISTS record (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          startDate INTEGER NOT NULL,
          endDate INTEGER,
          gram INTEGER DEFAULT 0,
          cost INTEGER DEFAULT 0,
          grindSize INTEGER DEFAULT 3,
          FOREIGN KEY (coffee_id) REFERENCES coffee (id),
         );
         CREATE TABLE IF NOT EXISTS review (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rating INTEGER DEFAULT 3,
          comment TEXT,
          date INTEGER NOT NULL,
          FOREIGN KEY (record_id) REFERENCES record (id)
         );`,
      );
    }).catch((error) => {
      console.log("SQL error!");
      console.log(error.message);
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
