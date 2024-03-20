import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'

export default function Analytics() {
  return (
    <View style={globalStyles.container}>
      <Header title={'分析'} />
      <Text>これまで飲んだコーヒーの分析や統計</Text>
    </View>
  )
}
