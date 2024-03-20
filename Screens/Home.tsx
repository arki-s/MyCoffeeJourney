import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { User } from '../types';
import { globalStyles } from '../Styles/globalStyles';
import Header from './Header';



export default function Home() {

  return (
    <View style={globalStyles.container}>
      <Header title={'ホーム'} />
      <Text>現在飲んでいるコーヒー豆の表示</Text>
      <Text>スライドでカレンダー切り替え</Text>
    </View>
  )
}
