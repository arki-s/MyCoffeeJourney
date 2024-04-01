import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee, CoffeeBean, CoffeeBrand } from '../types';
import { globalStyles } from '../Styles/globalStyles';
import Header from './Header';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Styles/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { coffeeIndexStyles } from '../Styles/coffeeIndexStyles';
import * as SQLite from 'expo-sqlite/next';


export default function CoffeeIndex() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [newCoffee, setNewCoffee] = useState<Coffee | null>(null);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
    await db.getAllAsync<Coffee>(`
    SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, GROUP_CONCAT(coffeeBean.name) AS beans
    FROM coffee
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    JOIN inclusion ON inclusion.coffee_id = coffee.id
    JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
    GROUP BY coffee.name
    ;`).then((rsp) => {
      // console.log("rsp", rsp);
      setCoffees(rsp);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

    await db.getAllAsync<CoffeeBrand>(`
    SELECT * FROM coffeeBrand;`).then((rsp) => {
      // console.log("rsp", rsp);
      setBrands(rsp);
    }).catch((error) => {
      console.log("reading coffee brand error!");
      console.log(error.message);
    });

    await db.getAllAsync<CoffeeBean>(`
    SELECT * FROM coffeeBean;`).then((rsp) => {
      // console.log("rsp", rsp);
      setBeans(rsp);
    }).catch((error) => {
      console.log("reading coffee bean error!");
      console.log(error.message);
    });
  }

  const list = coffees.map((cf) => {
    return (
      <View key={cf.id} style={coffeeIndexStyles.coffeeContainer}>
        <Text style={coffeeIndexStyles.brandText}>{cf.brand}</Text>
        <Text style={coffeeIndexStyles.coffeeText}>{cf.name}</Text>
        {/* <Text >{cf.beans}</Text> */}
      </View>
    )
  })

  async function addTestCoffee() {
    db.withTransactionAsync(async () => {
      const result = await db.runAsync(
        `INSERT INTO coffee (name, roast, body, sweetness, fruity, bitter, aroma, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        ["モカブレンド", 3, 3, 1, 4, 4, 4, 1]
      ).catch((error) => {
        console.log("create test coffee error!")
        console.log(error.message);
        return;
      });

      console.log((result as SQLite.SQLiteRunResult).lastInsertRowId);

      await db.runAsync(
        `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
        [(result as SQLite.SQLiteRunResult).lastInsertRowId, 1]
      ).catch((error) => {
        console.log("create test coffee inclusion error!")
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
        [(result as SQLite.SQLiteRunResult).lastInsertRowId, 2]
      ).catch((error) => {
        console.log("create test coffee inclusion error!")
        console.log(error.message);
        return;
      });

    })

    console.log("successfully created test coffee!")

    await getData();
  }

  return (
    <View style={globalStyles.container}>
      <Header title={'My図鑑'} />
      <TextInput placeholder='キーワードで検索' style={coffeeIndexStyles.searchInput} />
      {/* <FontAwesome name="search" size={30} color={Colors.PRIMARY} /> */}
      {list}
      <TouchableOpacity style={coffeeIndexStyles.addBtn} onPress={addTestCoffee}>
        <Ionicons name="add-circle" size={50} color={Colors.PRIMARY} />
      </TouchableOpacity>
      <Text>メモ：豆とブランドが空の場合はまず設定画面で追加を案内されるようにしたい</Text>
    </View>
  )
}
