import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee } from '../types';
import { globalStyles } from '../Styles/globalStyles';
import Header from './Header';

export default function CoffeeIndex() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);


  const db = useSQLiteContext();

  return (
    <View style={globalStyles.container}>
      <Header title={'My図鑑'} />
      <Text>今までに飲んだコーヒーのリスト</Text>
    </View>
  )
}
