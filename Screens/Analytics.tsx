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

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {

    await db.getAllAsync(`
      SELECT

      `).then((rsp) => {
      console.log("count", rsp);

    }
    ).catch((error) => {
      console.log("count error!");
      console.log(error.message);
    })


    // await db.getAllAsync<Coffee>(`
    // SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, GROUP_CONCAT(coffeeBean.name) AS beans
    // FROM coffee
    // JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    // JOIN inclusion ON inclusion.coffee_id = coffee.id
    // JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
    // WHERE coffee.id = ${id}
    // GROUP BY coffee.name
    // ;`).then((rsp) => {
    //   console.log("Details rsp", rsp);
    //   setCoffee(rsp ? rsp[0] : null);
    // }).catch((error) => {
    //   console.log("reading coffee error!");
    //   console.log(error.message);
    // });

    // await db.getAllAsync(`SELECT COUNT(*) FROM record WHERE coffee_id = ${memorizedId}`)
    //   .then((rsp: any) => {
    //     console.log(rsp[0]["COUNT(*)"]);
    //     setCount(parseInt(rsp[0]["COUNT(*)"]));
    //   }).catch((error) => {
    //     console.log("count error!");
    //     console.log(error.message);
    //   })

    // await db.getAllAsync(`
    //   SELECT AVG(rating) FROM review
    //   JOIN record ON record.id = review.record_id
    //   JOIN coffee ON coffee.id = record.coffee_id
    //   WHERE coffee.id = ${memorizedId}
    //   `).then((rsp: any) => {
    //   console.log("average", rsp);
    //   setAverageRating(parseFloat(rsp[0]["AVG(rating)"]));
    //   console.log(averageRating);
    // }).catch((error) => {
    //   console.log("average rating error!")
    //   console.log(error.message);
    // })

    // await db.getAllAsync(`
    // SELECT review.rating AS rating, review.comment AS comment, record.endDate AS date
    // FROM review
    // JOIN record ON record.id = review.record_id
    // JOIN coffee ON coffee.id = record.coffee_id
    // WHERE coffee.id = ${memorizedId}
    // `).then((rsp: any) => {
    //   console.log("reviews", rsp);
    //   setReviews(rsp);
    // }).catch((error) => {
    //   console.log("reviews error!");
    //   console.log(error.message);
    // })
  }



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
