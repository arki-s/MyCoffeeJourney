import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { User } from '../types';



export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [])

  async function getData() {
    const result = await db.getAllAsync<User>(`SELECT * FROM users;`);
    setUsers(users);
    console.log(result);
  }

  async function insertUser() {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO users (name, userEmail) VALUES (?, ?);`,
        ["test", "test@test.com"]
      ).catch((error) => {
        console.log("creating user error!");
        console.log(error.message);
      });

      console.log("successfully created test user!")

      await getData();
    })
  }

  async function deleteUser() {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `DELETE FROM users WHERE name = ?;`,
        ["test"]
      ).catch((error) => {
        console.log("deleting user error!");
        console.log(error.message);
      });

      console.log("successfully deleted test user!")

      await getData();
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={insertUser} style={{ padding: 15, backgroundColor: "yellow" }}>
        <Text>CREATE TEST USER!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteUser} style={{ padding: 15, backgroundColor: "red" }}>
        <Text>DELETE ALL USER!</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
