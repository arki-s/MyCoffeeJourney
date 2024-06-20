import { View, Text, ImageBackground, ScrollView, Modal, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Coffee, RootStackParamList, Record, Review } from '../types'
import { useSQLiteContext } from 'expo-sqlite/next';
import { recordIndexStyles } from '../Styles/recordIndexStyles'
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../Styles/Colors'
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'


export default function RecordIndex({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [records, setRecords] = useState<Record[]>([]);
  const [modalState, setModalState] = useState<"edit" | "delete" | null>(null);

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
    WHERE record.endDate IS NOT NULL
    ORDER BY record.endDate DESC;
    `).then((rsp) => {
      // console.log(rsp);
      setRecords(rsp);
    }).catch((error) => {
      console.log("loading error!");
      console.log(error.message);
      return;
    })
  }

  async function HandleEditPress() {

  }

  async function HandleDeletePress() {

  }

  const list = records.length > 0 ? records.map((record) => {
    if (!record.endDate) return null;

    const changeStartDate = new Date(record.startDate);
    const startDate = `${changeStartDate.getFullYear()}年 ${Number(changeStartDate.getMonth()) + 1}月 ${changeStartDate.getDate()}日`;

    const changeEndDate = new Date(record.endDate);
    const endDate = `${changeEndDate.getFullYear()}年 ${Number(changeEndDate.getMonth()) + 1}月 ${changeEndDate.getDate()}日`;

    const ratingStars = record.rating ? "⭐️".repeat(record.rating) : "";


    const edit = (
      <Modal animationType='slide'>
        <View style={globalStyles.bigModalView}>
          <TouchableOpacity onPress={() => setModalState(null)} style={globalStyles.closeModalBtn}>
            <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalState(null)}>
            <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
          </TouchableOpacity>
          <Text style={[globalStyles.titleTextLight, { marginBottom: 10 }]}>履歴の編集</Text>
        </View>
      </Modal>
    )

    const deletion = (
      <Modal animationType='slide' transparent={true}>
        <View style={globalStyles.modalBackdrop}>
          <View style={globalStyles.modalBasic}>
            <Text style={globalStyles.titleText}>この履歴を削除しますか？{"\n"}削除したらデータは元に戻せません。</Text>
            <TouchableOpacity onPress={() => setModalState(null)} style={[globalStyles.smallBtn, { marginTop: 10 }]}>
              <Text style={globalStyles.smallBtnText}>削除する</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalState(null)} style={[globalStyles.smallCancelBtn, { marginTop: 10 }]}>
              <Text style={globalStyles.smallCancelBtnText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )

    return (
      <View key={record.id} style={recordIndexStyles.recordContainer}>
        <View style={recordIndexStyles.buttonContainer}>
          <TouchableOpacity onPress={() => setModalState("edit")}>
            <FontAwesome name="pencil" size={22} color={Colors.SECONDARY_LIGHT} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalState("delete")}>
            <FontAwesome name="trash-o" size={22} color={Colors.SECONDARY_LIGHT} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: -20, zIndex: -10 }}>
          <Text style={recordIndexStyles.recordTextSmall}>{startDate}〜{endDate}</Text>
          <Text style={recordIndexStyles.recordText}>{record.brandName} {record.coffeeName}</Text>
          <Text style={recordIndexStyles.recordTextSmall}>{record.gram}g  {record.cost.toLocaleString('en-US').replace(/\B(?=(\d{3})+(?!\d))/g, ",")}円  挽き具合 : {record.grindSize}</Text>
          <Text style={{ marginTop: 10 }}>{ratingStars}</Text>
          <Text style={recordIndexStyles.recordTextSmall}>{record.comment}</Text>
        </View>
        {modalState === "edit" && edit}
        {modalState === "delete" && deletion}
      </View>
    )

  }) : (
    <Text style={globalStyles.titleText}>履歴がありません</Text>
  )



  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={globalStyles.imgBackground}>
        <Header title={'履歴'} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
          {list}
        </ScrollView>


      </ImageBackground>
    </View>
  )
}
