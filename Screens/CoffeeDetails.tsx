import { View, Text } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Coffee, RootStackParamList } from '../types'
import { RouteProp } from '@react-navigation/native'
import Header from './Header'
import { useSQLiteContext } from 'expo-sqlite/next'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'

type CoffeeDetailsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CoffeeDetails'>;
  route: RouteProp<RootStackParamList, 'CoffeeDetails'>;
}

export default function CoffeeDetails({ navigation, route }: CoffeeDetailsProps) {
  const [coffee, setCoffee] = useState<Coffee | null>(null);

  const db = useSQLiteContext();
  const memorizedId = useMemo(() => route.params.id, [route.params.id]);

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData(memorizedId);
    })
  }, [db, memorizedId])

  async function getData(id: any) {
    await db.getAllAsync<Coffee>(`
    SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, GROUP_CONCAT(coffeeBean.name) AS beans
    FROM coffee
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    JOIN inclusion ON inclusion.coffee_id = coffee.id
    JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
    WHERE coffee.id = ${id}
    GROUP BY coffee.name
    ;`).then((rsp) => {
      console.log("Details rsp", rsp);
      setCoffee(rsp ? rsp[0] : null);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });
  }


  return (
    <View style={globalStyles.container}>
      <Header title={coffee ? coffee.name : "コーヒー"} />
      <Text>CoffeeDetails</Text>
      <Text>{coffee?.brand}</Text>
      <Text>{coffee?.name}</Text>
      <Text>{coffee?.beans}</Text>
      <Text>焙煎度{coffee?.roast}</Text>
      <Text>苦味{coffee?.bitter}</Text>
    </View>
  )
}
