import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'

export default function ReviewIndex({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  return (
    <View style={globalStyles.container}>
      <Header title={'レビュー一覧'} />
      <Text>コーヒーのレビュー一覧</Text>
    </View>
  )
}
