import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'

export default function RecordIndex() {
  return (
    <View style={globalStyles.container}>
      <Text>これまでのコーヒーの飲んだ履歴一覧</Text>
    </View>
  )
}
