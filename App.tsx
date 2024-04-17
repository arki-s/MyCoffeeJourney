import React, { useState, useEffect, Suspense } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as Font from 'expo-font';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite/next';
import Home from './Screens/Home';
import Colors from './Styles/Colors';
import CoffeeIndex from './Screens/CoffeeIndex';
import ReviewIndex from './Screens/ReviewIndex';
import Analytics from './Screens/Analytics';
import RecordIndex from './Screens/RecordIndex';
import DBTest from './Screens/DBTest';
import { Asset } from 'expo-asset';
import * as FileSystem from "expo-file-system";
import Footer from './Screens/Footer';
import Settings from './Screens/Settings';
import { ToastProvider } from 'react-native-toast-notifications'
import CoffeeDetails from './Screens/CoffeeDetails';

const Tab = createBottomTabNavigator();

// ASSET内のDBファイルを使わずに直接ファイル作成から始める場合は以下
const db = SQLite.openDatabase('MyCoffeeJourney.db');

// const loadDatabase = async () => {
//   const dbName = "mySQLiteDB.db";
//   const dbAsset = require("./assets/mySQLiteDB.db");
//   const dbUri = Asset.fromModule(dbAsset).uri;
//   const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

//   const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
//   if (!fileInfo.exists) {
//     await FileSystem.makeDirectoryAsync(
//       `${FileSystem.documentDirectory}SQLite`,
//       { intermediates: true }
//     );
//     await FileSystem.downloadAsync(dbUri, dbFilePath);
//   }
// };

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={props => <Footer {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MyZukan" component={CoffeeIndex} />
      <Tab.Screen name="History" component={RecordIndex} />
      <Tab.Screen name="Review" component={ReviewIndex} />
      <Tab.Screen name="Analytics" component={Analytics} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="CoffeeDetails" component={CoffeeDetails} />
      <Tab.Screen name="Test" component={DBTest} />
    </Tab.Navigator>
  );
}

export default function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  // console.log(FileSystem.documentDirectory + 'SQLite/');

  useEffect(() => {

    // loadDatabase()
    //   .then(() => {
    //     console.log("successfully loaded DB!");
    //     setIsLoading(false);
    //   })
    //   .catch((error) => console.error(error.message));

    // ASSET内のDBファイルを使わずに直接DB設定する場合は以下を利用
    db.transactionAsync(async (tx) => {
      tx.executeSqlAsync(
        `
        CREATE TABLE IF NOT EXISTS coffeeBean (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
        );
        `
      );
    }).catch((error) => {
      console.log("CREATE coffeeBean error!");
      console.log(error.message);
    });

    db.transactionAsync(async (tx) => {
      tx.executeSqlAsync(
        `
        CREATE TABLE IF NOT EXISTS coffeeBrand (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL);
        `
      )
    }).catch((error) => {
      console.log("CREATE coffeeBrand error!");
      console.log(error.message);
    });

    db.transactionAsync(async (tx) => {
      tx.executeSqlAsync(
        `
        CREATE TABLE IF NOT EXISTS coffee (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          brand_id INTEGER,
          name TEXT NOT NULL,
          photo BLOB,
          favorite INTEGER DEFAULT 0,
          drinkCount INTEGER DEFAULT 0,
          comment TEXT,
          roast REAL DEFAULT 1.0,
          body REAL DEFAULT 1.0,
          sweetness REAL DEFAULT 1.0,
          fruity REAL DEFAULT 1.0,
          bitter REAL DEFAULT 3.0,
          aroma REAL DEFAULT 3.0,
          FOREIGN KEY (brand_id) REFERENCES coffeeBrand (id));
        `
      )
    }).catch((error) => {
      console.log("CREATE coffee error!");
      console.log(error.message);
    });

    db.transactionAsync(async (tx) => {
      tx.executeSqlAsync(
        `
        CREATE TABLE IF NOT EXISTS inclusion (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          coffee_id INTEGER,
          bean_id INTEGER,
          FOREIGN KEY (coffee_id) REFERENCES coffee (id),
          FOREIGN KEY (bean_id) REFERENCES coffeeBean (id));
        `
      )
    }).catch((error) => {
      console.log("CREATE inclusion error!");
      console.log(error.message);
    });

    db.transactionAsync(async (tx) => {
      tx.executeSqlAsync(
        `
        CREATE TABLE IF NOT EXISTS record (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          coffee_id INTEGER,
          startDate INTEGER NOT NULL,
          endDate INTEGER,
          gram INTEGER DEFAULT 0,
          cost INTEGER DEFAULT 0,
          grindSize INTEGER DEFAULT 3,
          FOREIGN KEY (coffee_id) REFERENCES coffee (id));
        `
      )
    }).catch((error) => {
      console.log("CREATE record error!");
      console.log(error.message);
    });

    db.transactionAsync(async (tx) => {
      tx.executeSqlAsync(
        `
        CREATE TABLE IF NOT EXISTS review (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          record_id INTEGER,
          rating INTEGER DEFAULT 3,
          comment TEXT,
          date INTEGER NOT NULL,
          FOREIGN KEY (record_id) REFERENCES record (id));
        `
      )
    }).catch((error) => {
      console.log("CREATE record error!");
      console.log(error.message);
    });

    setIsLoading(false);

    // }, []);
    // ASSET内のDBファイル使わず直接書き込みの場合は以下
  }, [db]);

  useEffect(() => {
    loadFonts();
  }, []);

  async function loadFonts() {
    await Font.loadAsync({
      'Ojuju-B': require('./assets/fonts/Ojuju-Bold.ttf'),
      'Ojuju-M': require('./assets/fonts/Ojuju-Medium.ttf'),
      'Ojuju-L': require('./assets/fonts/Ojuju-Light.ttf'),
      'yusei': require('./assets/fonts/YuseiMagic-Regular.ttf'),
    })

    setFontsLoaded(true);
  }

  if (isLoading || fontsLoaded == false) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18 }}>Now Loading...</Text>
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
        <ToastProvider>
          <NavigationContainer>
            <MyTabs />
          </NavigationContainer>
        </ToastProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
