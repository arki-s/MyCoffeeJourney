import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'

export default function Analytics() {
  return (
    <View style={globalStyles.container}>
      <Text>これまで飲んだコーヒーの分析や統計</Text>
    </View>
  )
}
