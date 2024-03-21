import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { CoffeeBean, CoffeeBrand } from '../types';
import { useSQLiteContext } from 'expo-sqlite/next';

export default function Settings() {
  const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [brand, setBrand] = useState<string | null>(null);
  const [bean, setBean] = useState<string | null>(null);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
    await db.getAllAsync<CoffeeBrand>(`
    SELECT * FROM coffeeBrand;`).then((rsp) => {
      console.log("rsp", rsp);
      setBrands(rsp);
    }).catch((error) => {
      console.log("reading coffee brand error!");
      console.log(error.message);
    });

    await db.getAllAsync<CoffeeBean>(`
    SELECT * FROM coffeeBean;`).then((rsp) => {
      console.log("rsp", rsp);
      setBeans(rsp);
    }).catch((error) => {
      console.log("reading coffee bean error!");
      console.log(error.message);
    });
  }

  async function createBrand() {
    if (!brand) return null;

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO coffeeBrand (name) VALUES (?);`, [brand]
      ).catch((error) => {
        console.log("creating brand error!");
        console.log(error.message);
        return;
      });

      await getData();

    })
  };

  async function createBean() {
    if (!bean) return null;

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO coffeeBean (name) VALUES (?);`, [bean]
      ).catch((error) => {
        console.log("creating bean error!");
        console.log(error.message);
        return;
      });

      await getData();

    })
  };

  const brandList = brands.map((br) => {
    return (
      <Text>{br.name}</Text>
    )
  });

  const beanList = beans.map((be) => {
    return (
      <Text>{be.name}</Text>
    )
  });


  return (
    <View style={globalStyles.container}>
      <Header title={'設定'} />
      <TouchableOpacity style={{ backgroundColor: "red", padding: 20 }}>
        <Text>Add New Coffee Brand</Text>
      </TouchableOpacity>
      {brandList}
      <TouchableOpacity style={{ backgroundColor: "pink", padding: 20 }}>
        <Text>Add New Coffee Bean</Text>
      </TouchableOpacity>
      {beanList}
    </View>
  )
}
