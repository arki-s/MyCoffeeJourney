import { View, Text, ImageBackground, ScrollView, Modal, TextInput, TouchableOpacity } from 'react-native'
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
// import { TouchableOpacity } from 'react-native-gesture-handler'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider'


export default function RecordIndex({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [records, setRecords] = useState<Record[]>([]);
  const [modalState, setModalState] = useState<"edit" | "delete" | null>(null);
  const [itemsCoffee, setItemsCoffee] = useState([]);
  const [openCoffee, setOpenCoffee] = useState(false);
  const [valueCoffee, setValueCoffee] = useState(0);
  const [grindSize, setGrindSize] = useState(3);
  const [gram, setGram] = useState<number | "">(0);
  const [cost, setCost] = useState<number | "">(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [openRating, setOpenRating] = useState(false);
  const [itemsRating, setItemsRating] = useState([
    { label: '⭐️', value: 1 },
    { label: '⭐️⭐️', value: 2 },
    { label: '⭐️⭐️⭐️', value: 3 },
    { label: '⭐️⭐️⭐️⭐️', value: 4 },
    { label: '⭐️⭐️⭐️⭐️⭐️', value: 5 }
  ]);

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

    db.getAllAsync<Coffee>(`
      SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, GROUP_CONCAT(coffeeBean.name) AS beans
      FROM coffee
      JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
      JOIN inclusion ON inclusion.coffee_id = coffee.id
      JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
      GROUP BY coffee.name
      `).then((rsp) => {
      // console.log("rsp", rsp);
      const coffeeDropDown: any = [];

      rsp.map((cf) => { coffeeDropDown.push({ label: `${cf.name}(${cf.brand})`, value: cf.id }); })

      setItemsCoffee(coffeeDropDown);

    }).catch((error) => {
      console.log("loading coffee error!");
      console.log(error.message);
      return;
    });
  }

  function HandleClosePress() {

    setModalState(null);
  }

  async function HandleEditPress() {

  }

  async function HandleDeletePress() {

  }

  const list = records.length > 0 ? records.map((record) => {
    if (!record.endDate) return null;

    const changeStartDate = new Date(record.startDate);
    const startDateDisplay = `${changeStartDate.getFullYear()}年 ${Number(changeStartDate.getMonth()) + 1}月 ${changeStartDate.getDate()}日`;

    const changeEndDate = new Date(record.endDate);
    const endDateDisplay = `${changeEndDate.getFullYear()}年 ${Number(changeEndDate.getMonth()) + 1}月 ${changeEndDate.getDate()}日`;

    const ratingStars = record.rating ? "⭐️".repeat(record.rating) : "";


    const edit = (
      <Modal animationType='slide'>
        <View style={[globalStyles.bigModalView, { zIndex: 2 }]}>
          <TouchableOpacity onPress={HandleClosePress} style={{ position: 'absolute', top: 25, right: 20, zIndex: 10 }}>
            <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
          </TouchableOpacity>

          <Text style={[globalStyles.titleTextLight, { marginBottom: 10, zIndex: 1 }]}>履歴の編集</Text>

          <View style={globalStyles.inputContainerRecord}>
            <Text style={globalStyles.textLight}>開始日</Text>
            <View style={{ backgroundColor: Colors.SECONDARY_LIGHT, borderRadius: 5 }}>
              <RNDateTimePicker
                mode="date"
                display='calendar'
                value={startDate}
                onChange={() => setStartDate(startDate)} />
            </View>
          </View>

          <View style={globalStyles.inputContainerRecord}>
            <Text style={globalStyles.textLight}>終了日</Text>
            <View style={{ backgroundColor: Colors.SECONDARY_LIGHT, borderRadius: 5 }}>
              <RNDateTimePicker
                mode="date"
                display='calendar'
                value={startDate}
                onChange={() => setStartDate(startDate)} />
            </View>
          </View>

          <View style={globalStyles.inputContainerRecord}>
            <Text style={globalStyles.textLight}>コーヒーを選択</Text>
            <View style={{ alignItems: 'center', width: 300, marginLeft: -15 }}>
              <DropDownPicker
                placeholder={'Choose coffee'}
                open={openCoffee}
                value={valueCoffee}
                items={itemsCoffee}
                setOpen={setOpenCoffee}
                setValue={setValueCoffee}
                setItems={setItemsCoffee}
                style={{ backgroundColor: Colors.SECONDARY_LIGHT }}
                containerStyle={{ width: '50%', }}
                dropDownContainerStyle={{ backgroundColor: Colors.SECONDARY_LIGHT }}
                textStyle={{ fontFamily: 'yusei', fontSize: 12 }}
                zIndex={5000}
              />
            </View>
          </View>

          <View style={globalStyles.inputContainerRecord}>
            <Text style={globalStyles.textLight}>グラム数</Text>
            <TextInput placeholder='金額' keyboardType='numeric' maxLength={5} value={gram.toString()} style={globalStyles.numberInput} />
          </View>

          <View style={globalStyles.inputContainerRecord}>
            <Text style={globalStyles.textLight}>値段(円)</Text>
            <TextInput placeholder='金額' keyboardType='numeric' maxLength={5} value={cost.toString()} style={globalStyles.numberInput} />
          </View>

          <View style={globalStyles.inputContainerRecord}>
            <Text style={globalStyles.textLight}>挽き目：{grindSize.toFixed(0)}</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={1}
              maximumValue={5}
              value={grindSize}
              onValueChange={(num) => setGrindSize(num)}
              minimumTrackTintColor={Colors.SECONDARY}
              maximumTrackTintColor={Colors.SECONDARY_LIGHT}
            />
          </View>

          <View style={globalStyles.inputContainerRecord}>
            <Text style={globalStyles.textLight}>評価</Text>
            <View style={{ alignItems: 'center', width: 360 }}>
              <DropDownPicker
                placeholder={'Choose rating'}
                open={openRating}
                value={rating}
                items={itemsRating}
                setOpen={setOpenRating}
                setValue={setRating}
                setItems={setItemsRating}
                style={{ backgroundColor: Colors.SECONDARY_LIGHT }}
                containerStyle={{ width: '50%', }}
                dropDownContainerStyle={{ backgroundColor: Colors.SECONDARY_LIGHT }}
                textStyle={{ fontFamily: 'yusei', fontSize: 12 }}
                zIndex={5000}
              />
            </View>
          </View>

          <TextInput placeholder='感想を入力' value={comment} onChangeText={(text) => setComment(text)}
            multiline={true} numberOfLines={5} style={globalStyles.commentInput} />

          <View style={{ padding: 20 }}>
            <TouchableOpacity style={globalStyles.smallBtn}>
              <Text style={globalStyles.titleTextLight}>編集内容を保存する</Text>
            </TouchableOpacity>
          </View>
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
          <Text style={recordIndexStyles.recordTextSmall}>{startDateDisplay}〜{endDateDisplay}</Text>
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
