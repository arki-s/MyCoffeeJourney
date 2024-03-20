import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee } from '../types';
import { globalStyles } from '../Styles/globalStyles';

export default function CoffeeIndex() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);


  const db = useSQLiteContext();

  return (
    <View style={globalStyles.container}>
      <Text>今までに飲んだコーヒーのリスト</Text>
    </View>
  )
}
