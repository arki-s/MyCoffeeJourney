import { View, Text, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Coffee, RootStackParamList } from '../types'
import { useSQLiteContext } from 'expo-sqlite/next';

export default function RecordIndex({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      // await getData();
    })
  }, [db])

  async function getData() {
    db.getAllAsync<Coffee>(`

    `).then((rsp) => {
      console.log(rsp);
    }).catch((error) => {
      console.log("loading error!");
      console.log(error.message);
      return;
    })

  }



  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={globalStyles.imgBackground}>

        <Header title={'履歴'} />
        <Text>これまでのコーヒーの飲んだ履歴一覧</Text>
      </ImageBackground>
    </View>
  )
}
