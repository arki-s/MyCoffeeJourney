import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'

export default function Settings() {
  return (
    <View style={globalStyles.container}>
      <Header title={'設定'} />
      <Text>Settings</Text>
    </View>
  )
}
