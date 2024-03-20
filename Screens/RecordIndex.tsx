import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'

export default function RecordIndex() {
  return (
    <View style={globalStyles.container}>
      <Header title={'履歴'} />
      <Text>これまでのコーヒーの飲んだ履歴一覧</Text>
    </View>
  )
}
