import { View, Text, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Coffee, RootStackParamList, Record, Review } from '../types'
import { useSQLiteContext } from 'expo-sqlite/next';

export default function RecordIndex({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [records, setRecords] = useState<Record[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
    db.getAllAsync<Record>(`
    SELECT record.*, coffee.name AS coffeeName, coffeeBrand.name AS brandName, review.rating AS rating, review.comment AS comment
    FROM record
    JOIN coffee ON coffee.id = record.coffee_id
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    JOIN review ON review.record_id = record.id
    WHERE record.endDate IS NOT NULL;
    `).then((rsp) => {
      // console.log(rsp);
      setRecords(rsp);
    }).catch((error) => {
      console.log("loading error!");
      console.log(error.message);
      return;
    })
  }

  const list = records ? records.map((record) => {
    if (!record.endDate) return null;

    const changeStartDate = new Date(record.startDate);
    const startDate = `${changeStartDate.getFullYear()}年 ${Number(changeStartDate.getMonth()) + 1}月 ${changeStartDate.getDate()}日`;

    const changeEndDate = new Date(record.endDate);
    const endDate = `${changeEndDate.getFullYear()}年 ${Number(changeEndDate.getMonth()) + 1}月 ${changeEndDate.getDate()}日`;

    return (
      <View key={record.id}>
        <Text>{record.brandName} {record.coffeeName}</Text>
        <Text>{startDate}</Text>
        <Text>{endDate}</Text>
      </View>
    )

  }) : (
    <Text>履歴がありません。</Text>
  )



  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={globalStyles.imgBackground}>

        <Header title={'履歴'} />
        <Text>これまでのコーヒーの飲んだ履歴一覧</Text>
        {list}
      </ImageBackground>
    </View>
  )
}
