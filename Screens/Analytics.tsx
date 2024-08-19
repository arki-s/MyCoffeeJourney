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
  const [totalCountCoffee, setTotalCountCoffee] = useState(0);
  const [totalCountBean, setTotalCountBean] = useState(0);
  const [totalCountBrand, setTotalCountBrand] = useState(0);

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
      // console.log("count", rsp[0]);
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
      // console.log("total gram", rsp[0]);
      const total: any = rsp[0];
      setTotalGram(total.total);
    }).catch((error) => {
      console.log("total gram error!");
      console.log(error.message);
    })

    await db.getAllAsync(`
      SELECT COUNT(*) AS count
      FROM coffee;
      `).then((rsp) => {
      // console.log("total count coffee", rsp[0]);
      const totalCoffee: any = rsp[0];
      setTotalCountCoffee(totalCoffee.count);
    }).catch((error) => {
      console.log("total coffee Count error!");
      console.log(error.message);
    })

    await db.getAllAsync(`
      SELECT COUNT(*) AS count
      FROM coffeeBean;
      `).then((rsp) => {
      // console.log("total count bean", rsp[0]);
      const totalBean: any = rsp[0];
      setTotalCountBean(totalBean.count);
    }).catch((error) => {
      console.log("total bean Count error!");
      console.log(error.message);
    })

    await db.getAllAsync(`
      SELECT COUNT(*) AS count
      FROM coffeeBrand;
      `).then((rsp) => {
      // console.log("total count brand", rsp[0]);
      const totalBrand: any = rsp[0];
      setTotalCountBrand(totalBrand.count);
    }).catch((error) => {
      console.log("total brand Count error!");
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

  // 飲んだ回数、総グラム、図鑑登録コーヒー数、登録コーヒー豆数、登録ブランド数、飲んだ回数が一番多いコーヒー


  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={globalStyles.imgBackground}>
        <Header title={'分析'} />
        <Text>図鑑登録コーヒー数: {totalCountCoffee}</Text>
        <Text>登録コーヒー豆数: {totalCountBean}</Text>
        <Text>登録コーヒーブランド数: {totalCountBrand}</Text>
        <Text>コーヒーを飲んだ回数: {totalCount}</Text>
        {/* <Text>一日のコーヒー平均グラム: {averageGram}g</Text> */}
        <Text>飲んだコーヒーの総グラム: {totalGram}g</Text>
        <Text>飲んだ回数が多いコーヒー（上位3種類）</Text>
      </ImageBackground>
    </View>
  )
}
