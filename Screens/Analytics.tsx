import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import { analyticsStyles } from '../Styles/analyticsStyles';

export default function Analytics({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={globalStyles.imgBackground}>
        <Header title={'分析'} />
        <Text>コーヒーを飲んだ回数</Text>
        <Text>一日のコーヒー平均グラム</Text>
        <Text>飲んだコーヒーの総グラム</Text>
        <Text>各ランキング</Text>
      </ImageBackground>
    </View>
  )
}
