import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Touchable } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Coffee, RootStackParamList, Review } from '../types'
import { RouteProp } from '@react-navigation/native'
import Header from './Header'
import { useSQLiteContext } from 'expo-sqlite/next'
import { coffeeDetailsStyles } from '../Styles/coffeeDetailsStyles'
import Colors from '../Styles/Colors'
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


type CoffeeDetailsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CoffeeDetails'>;
  route: RouteProp<RootStackParamList, 'CoffeeDetails'>;
}

export default function CoffeeDetails({ navigation, route }: CoffeeDetailsProps) {
  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const [image, setImage] = useState(false);
  const [count, setCount] = useState(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

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

    await db.getAllAsync(`SELECT COUNT(*) FROM record WHERE coffee_id = ${memorizedId}`)
      .then((rsp: any) => {
        console.log(rsp[0]["COUNT(*)"]);
        setCount(parseInt(rsp[0]["COUNT(*)"]));
      }).catch((error) => {
        console.log("count error!");
        console.log(error.message);
      })

    await db.getAllAsync(`
      SELECT AVG(rating) FROM review
      JOIN record ON record.id = review.record_id
      JOIN coffee ON coffee.id = record.coffee_id
      WHERE coffee.id = ${memorizedId}
      `).then((rsp: any) => {
      console.log("average", rsp);
      setAverageRating(parseFloat(rsp[0]["AVG(rating)"]));
      console.log(averageRating);
    }).catch((error) => {
      console.log("average rating error!")
      console.log(error.message);
    })

    await db.getAllAsync(`
    SELECT review.rating AS rating, review.comment AS comment, record.endDate AS date FROM review
    JOIN record ON record.id = review.record_id
    JOIN coffee ON coffee.id = record.coffee_id
    WHERE coffee.id = ${memorizedId}
    `).then((rsp: any) => {
      console.log("reviews", rsp);
      setReviews(rsp);
    }).catch((error) => {
      console.log("reviews error!");
      console.log(error.message);
    })
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

  async function updateImage(imageBase64: string, id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE coffee SET photo = ? WHERE id = ?;`,
        [imageBase64, id]
      ).catch((error) => {
        console.log("updating an image error!");
        console.log(error.message);
        return;
      });
    }).catch((error) => {
      console.log("updating an image error!");
      console.log(error.message);
    })

    console.log("successfully updated an image!");
    await getData(memorizedId);
  }

  async function removeImage(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE coffee SET photo = NULL WHERE id = ?;`,
        [id]
      ).catch((error) => {
        console.log("removing an image error!");
        console.log(error.message);
        return;
      });
    }).catch((error) => {
      console.log("removing an image error!");
      console.log(error.message);
    })

    console.log("successfully removed the image!")
    await getData(memorizedId);
    setImage(false);
  }


  const pickImage = async () => {
    if (!memorizedId) return null;
    console.log("pick image");

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      console.log("permission denied");
      setImage(false);
      return;
    }

    console.log("permission allowed");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.assets) return null;

    const imageUri = result.assets[0]['uri'];

    const resizedImage = await ImageManipulator.manipulateAsync(imageUri,
      [
        {
          resize: {
            width: 100,
            height: 100,
          },
        },
      ], {
      compress: 0.3,
      base64: true,
    }
    )

    if (!result.canceled) {
      if (!result.assets) return null;

      if (resizedImage.base64 !== undefined) {
        await updateImage(resizedImage.base64, memorizedId);
      }

      setImage(false);
      return;
    }

    setImage(false);
    console.log("canceled");

  }

  const checkImage = coffee?.photo ? (
    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => { memorizedId != undefined ? removeImage(memorizedId) : null }}>
      <FontAwesome name="trash" size={50} color={Colors.PRIMARY} />
      <Text style={globalStyles.titleText}>画像を削除</Text>
    </TouchableOpacity>
  ) : (
    <View style={{ opacity: 0.5 }} >
      <View style={{ alignItems: 'center' }} >
        <FontAwesome name="trash" size={50} color={Colors.PRIMARY} />
        <Text style={globalStyles.titleText}>画像を削除</Text>
      </View>
    </View>

  );

  const cameraModal = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <View style={coffeeDetailsStyles.imageContainer}>
            <TouchableOpacity style={{ alignItems: 'center' }} onPress={pickImage}>
              <FontAwesome name="picture-o" size={50} color={Colors.PRIMARY} />
              <Text style={globalStyles.titleText}>画像を選択</Text>
            </TouchableOpacity>

            {checkImage}

          </View>
          <TouchableOpacity onPress={() => setImage(false)} style={[globalStyles.smallBtn, { marginTop: 10 }]}>
            <Text style={globalStyles.smallBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

  );

  const coffeePhoto = `data:image/png;base64,${coffee?.photo}`;

  return (
    <View style={[globalStyles.container, { backgroundColor: Colors.SECONDARY_LIGHT }]}>
      <Header title={coffee ? coffee.name : "コーヒー"} />
      <ScrollView>

        <Text style={globalStyles.titleText}>{coffee?.brand}</Text>
        <Text style={coffeeDetailsStyles.coffeeTitleText}>{coffee?.name}</Text>

        <View>

          {coffee?.photo ? (
            <Image source={{ uri: coffeePhoto }} style={coffeeDetailsStyles.coffeeImg} />
          ) : (
            <Image source={require('../assets/coffee-cup-beans.jpg')} style={coffeeDetailsStyles.coffeeImg} />
          )}

          <TouchableOpacity onPress={() => setImage(true)} style={coffeeDetailsStyles.cameraIcon}>
            <FontAwesome name="camera" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={[globalStyles.titleText, { fontSize: 14 }]}>コーヒー豆産地</Text>
          <Text style={globalStyles.titleText}>{coffee?.beans}</Text>
        </View>

        {tasteSliders}

        <Text style={globalStyles.titleText}>飲んだ回数 : {count}</Text>
        <Text style={globalStyles.titleText}>コメント</Text>
        <Text style={globalStyles.titleText}>{coffee?.comment}</Text>
        <Text style={globalStyles.titleText}>評価平均 : {averageRating}</Text>
        <Text style={globalStyles.titleText}>これまでのレビュー</Text>
      </ScrollView>
      {image && cameraModal}
    </View>
  )
}
