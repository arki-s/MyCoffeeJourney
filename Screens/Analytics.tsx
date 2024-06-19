import { View, Text, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import { analyticsStyles } from '../Styles/analyticsStyles';
import { useSQLiteContext } from 'expo-sqlite/next'

export default function Analytics({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [totalCount, setTotalCount] = useState(0);
  const [averageGram, setAverageGram] = useState(0);
  const [totalGram, setTotalGram] = useState(0);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {

    await db.getAllAsync(`
      SELECT COUNT(*) AS count
      FROM record
      WHERE endDate IS NOT NULL;
      `).then((rsp) => {
      console.log("count", rsp[0]);
      const count: any = rsp[0];
      setTotalCount(count.count);
    }
    ).catch((error) => {
      console.log("count error!");
      console.log(error.message);
    })

    await db.getAllAsync(`
      SELECT SUM(gram) AS total
      FROM record
      WHERE endDate IS NOT NULL;
      `).then((rsp) => {
      console.log("total gram", rsp[0]);
      const total: any = rsp[0];
      setTotalGram(total.total);
    }).catch((error) => {
      console.log("total gram error!");
      console.log(error.message);
    })

    // await db.getAllAsync(`
    //   SELECT SUM(gram / julianday(endDate) - julianday(startDate)) AS average
    //   FROM record
    //   WHERE endDate IS NOT NULL
    //   AND startDate <> endDate;
    //   `).then((rsp) => {
    //   console.log("average gram", rsp);
    //   const average: any = rsp[0];
    //   setAverageGram(average.average);
    // }).catch((error) => {
    //   console.log("average gram error!");
    //   console.log(error.message);
    // })
  }



  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={globalStyles.imgBackground}>
        <Header title={'分析'} />
        <Text>コーヒーを飲んだ回数: {totalCount}</Text>
        {/* <Text>一日のコーヒー平均グラム: {averageGram}g</Text> */}
        <Text>飲んだコーヒーの総グラム: {totalGram}g</Text>
        <Text>各ランキング</Text>
      </ImageBackground>
    </View>
  )
}
