import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';

import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';


export default function App() {
  const db = SQLite.openDatabase('MyCoffeeJourney.db');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, userEmail TEXT)');
    })

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM users', null,
        (txObj, resultSet) => setUsers(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });

    db.transaction(tx => {
      tx.executeSql('INSERT INTO users (name, userEmail) VALUES (?, ?)', ["test", "test@test.com"]);
    })

    setIsLoading(false);
  }, [db])


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

  // async function openDatabase(pathToDatabaseFile: string): Promise<SQLite.WebSQLDatabase> {
  //   if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
  //     await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  //   }
  //   await FileSystem.downloadAsync(
  //     Asset.fromModule(require('./')).uri,
  //     FileSystem.documentDirectory + 'SQLite/MyCoffeeJourney.db'
  //   );
  //   return SQLite.openDatabase('MyCoffeeJourney.db');
  // }

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
