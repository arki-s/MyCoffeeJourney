import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Coffee, CoffeeBean, CoffeeBrand, User } from '../../types';
import { useSQLiteContext } from 'expo-sqlite/next';

export default function DBTest() {
  const [users, setUsers] = useState<User[]>([]);
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [])

  async function getData() {
    const coffeeResult = await db.getAllAsync<Coffee>(`
    SELECT * FROM coffee;`);
    setCoffees(coffeeResult);
    console.log(coffeeResult);

    const brandResult = await db.getAllAsync<CoffeeBrand>(`
    SELECT * FROM coffeeBrand;`);
    setBrands(brandResult);
    console.log(brandResult);

    const beanResult = await db.getAllAsync<CoffeeBean>(`
    SELECT * FROM coffeeBean;`);
    setBeans(beanResult);
    console.log(beanResult);
  }

  async function insertCoffee3data() {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO coffee (name, userEmail) VALUES (?, ?);`,
        ["test", "test@test.com"]
      ).catch((error) => {
        console.log("creating user error!");
        console.log(error.message);
        return;
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
        return;
      });

      console.log("successfully deleted test user!")

      await getData();
    })
  }

  async function dropUser() {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `DROP TABLE users;`,
      ).catch((error) => {
        console.log("drop table error!");
        console.log(error.message);
        return;
      });

      console.log("successfully dropped user table!")

      await getData();
    })
  }
  return (
    <View>
      <TouchableOpacity onPress={insertUser} style={{ padding: 15, backgroundColor: "yellow" }}>
        <Text>CREATE TEST USER!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteUser} style={{ padding: 15, backgroundColor: "red" }}>
        <Text>DELETE ALL USER!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={dropUser} style={{ padding: 15, backgroundColor: "gray" }}>
        <Text>DROP USER TABLE!</Text>
      </TouchableOpacity>
    </View>
  )
}
