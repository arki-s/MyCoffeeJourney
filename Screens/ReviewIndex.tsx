import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'

export default function ReviewIndex() {
  return (
    <View style={globalStyles.container}>
      <Header title={'レビュー一覧'} />
      <Text>コーヒーのレビュー一覧</Text>
    </View>
  )
}
