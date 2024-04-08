import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Touchable } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Coffee, RootStackParamList } from '../types'
import { RouteProp } from '@react-navigation/native'
import Header from './Header'
import { useSQLiteContext } from 'expo-sqlite/next'
import { coffeeDetailsStyles } from '../Styles/coffeeDetailsStyles'
import Colors from '../Styles/Colors'
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';

type CoffeeDetailsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CoffeeDetails'>;
  route: RouteProp<RootStackParamList, 'CoffeeDetails'>;
}

export default function CoffeeDetails({ navigation, route }: CoffeeDetailsProps) {
  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const [image, setImage] = useState(false);

  const db = useSQLiteContext();
  const memorizedId = useMemo(() => route.params.id, [route.params.id]);

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData(memorizedId);
    })
  }, [db, memorizedId])

  async function getData(id: any) {
    await db.getAllAsync<Coffee>(`
    SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, GROUP_CONCAT(coffeeBean.name) AS beans
    FROM coffee
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    JOIN inclusion ON inclusion.coffee_id = coffee.id
    JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
    WHERE coffee.id = ${id}
    GROUP BY coffee.name
    ;`).then((rsp) => {
      console.log("Details rsp", rsp);
      setCoffee(rsp ? rsp[0] : null);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });
  }

  const coffeeTaste = coffee ? [
    { name: "焙煎度", value: coffee.roast },
    { name: "コク", value: coffee.body },
    { name: "甘味", value: coffee.sweetness },
    { name: "酸味", value: coffee.fruity },
    { name: "苦味", value: coffee.bitter },
    { name: "香り", value: coffee.aroma },
  ] : null;

  const tasteSliders = coffeeTaste?.map((ct) => {

    return (
      <View style={globalStyles.sliderContainer} key={ct.name}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: 110 }}>
          <Text style={globalStyles.titleText}>{ct.name}</Text>
          <Text style={globalStyles.titleText}>{ct.value.toFixed(1)}</Text>
        </View>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={1}
          maximumValue={5}
          value={ct.value}
          minimumTrackTintColor={Colors.PRIMARY}
          maximumTrackTintColor={Colors.WHITE}
          disabled={true}
        />
      </View>
    )
  })

  const cameraModal = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <View style={coffeeDetailsStyles.imageContainer}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <FontAwesome name="picture-o" size={50} color={Colors.PRIMARY} />
              <Text style={globalStyles.titleText}>画像を選択</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <FontAwesome name="trash" size={50} color={Colors.PRIMARY} />
              <Text style={globalStyles.titleText}>画像を削除</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setImage(false)} style={[globalStyles.smallBtn, { marginTop: 10 }]}>
            <Text style={globalStyles.smallBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

  );

  return (
    <View style={[globalStyles.container, { backgroundColor: Colors.SECONDARY_LIGHT }]}>
      <Header title={coffee ? coffee.name : "コーヒー"} />
      <ScrollView>

        <Text style={globalStyles.titleText}>{coffee?.brand}</Text>
        <Text style={coffeeDetailsStyles.coffeeTitleText}>{coffee?.name}</Text>

        <View>
          <Image source={require('../assets/coffee-cup-beans.jpg')} style={coffeeDetailsStyles.coffeeImg} />
          <TouchableOpacity onPress={() => setImage(true)} style={coffeeDetailsStyles.cameraIcon}>
            <FontAwesome name="camera" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={[globalStyles.titleText, { fontSize: 14 }]}>コーヒー豆産地</Text>
          <Text style={globalStyles.titleText}>{coffee?.beans}</Text>
        </View>

        {tasteSliders}

        <Text style={globalStyles.titleText}>飲んだ回数</Text>
        <Text style={globalStyles.titleText}>コメント</Text>
        <Text style={globalStyles.titleText}>{coffee?.comment}</Text>
        <Text style={globalStyles.titleText}>評価平均</Text>
        <Text style={globalStyles.titleText}>これまでのレビュー</Text>
      </ScrollView>
      {image && cameraModal}
    </View>
  )
}
