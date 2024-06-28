import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ImageBackground, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee, RootStackParamList, User, Record } from '../types';
import { globalStyles } from '../Styles/globalStyles';
import Header from './Header';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../Styles/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import Slider from '@react-native-community/slider';
import * as SQLite from 'expo-sqlite/next';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { homeStyles } from '../Styles/homeStyles';
import { FontAwesome } from '@expo/vector-icons';


export default function Home({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [modal, setModal] = useState<"New" | "Edit" | null>(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [grindSize, setGrindSize] = useState(3);
  const [gram, setGram] = useState<number | "">(0);
  const [cost, setCost] = useState<number | "">(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openCoffee, setOpenCoffee] = useState(false);
  const [valueCoffee, setValueCoffee] = useState(0);
  const [itemsCoffee, setItemsCoffee] = useState([]);
  const [warningModal, setWarningModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<number | null>(null);
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


  // console.log(startDate.getTime());

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
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

    const response = await db.getAllAsync<Record>(`
    SELECT record.id, record.startDate, record.gram, record.cost, record.grindSize, coffee.name AS coffeeName, coffeeBrand.name AS brandName, coffee.id AS coffeeId
    FROM record
    JOIN coffee ON coffee.id = record.coffee_id
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    WHERE record.endDate IS NULL;
    `);

    if (!response) {
      console.log("loading record error!");
      return;
    }

    // console.log(response);

    // const date = new Date(response[0]["startDate"]);
    // console.log(date);

    setRecords(response);

  }

  async function createNewRecord() {
    if (!startDate || gram == 0 || valueCoffee == 0) {
      setWarningModal(true);
      return;
    }

    db.runAsync(`
    INSERT INTO record (startDate, gram, cost, grindSize, coffee_id) VALUES (?, ?, ?, ?, ?);
    `, [startDate.getTime(), gram, cost, grindSize.toFixed(0), valueCoffee]
    ).catch((error) => {
      console.log("creating new record error!");
      console.log(error.message);
      return;
    })

    setModal(null);
    await getData();
  }

  async function editRecord() {
    if (!editingRecord) return null;

    console.log(startDate);

    if (!startDate || gram == 0 || valueCoffee == 0) {
      setWarningModal(true);
      return;
    }

    db.runAsync(`
    UPDATE record SET startDate = ?, gram = ?, cost = ?, grindSize = ?, coffee_id = ? WHERE id = ?;
    `, [startDate.getTime(), gram, cost, grindSize, valueCoffee, editingRecord]
    ).catch((error) => {
      console.log("editing record error!");
      console.log(error.message);
      return;
    })

    setCost(0);
    setGram(0);
    setStartDate(new Date());
    setGrindSize(3);
    setValueCoffee(0);
    setEditingRecord(null);
    setModal(null);
    await getData();

  }

  async function completeRecord() {
    if (!rating) setWarningModal(true);

    db.runAsync(`
    UPDATE record SET endDate = ? WHERE id = ?;
    `, [endDate.getTime(), editingRecord]
    ).catch((error) => {
      console.log("completing record error!");
      console.log(error.message);
      return;
    })

    db.runAsync(`
    INSERT INTO review (rating, comment, record_id) VALUES (?, ?, ?);
    `, [rating, comment, editingRecord]
    ).catch((error) => {
      console.log("creating review error!");
      console.log(error.message);
      return;
    })

    console.log("successfully created a new review!");

    await getData();

    setComment("");
    setRating(null);
    setEditingRecord(null);
    setReviewModal(false);

  }

  async function deleteRecord() {
    if (!editingRecord) return null;

    db.runAsync(`DELETE FROM record WHERE id = ?`, [editingRecord])
      .catch((error) => {
        console.log("deleting record error!");
        console.log(error.message);
        return;
      })

    console.log("successfully deleted the record!");

    await getData();

    setCost(0);
    setGram(0);
    setStartDate(new Date());
    setGrindSize(3);
    setValueCoffee(0);
    setEditingRecord(null);
    setModal(null);
    await getData();

  }

  const HandleCostInput = (input: string) => {
    const parsedInput = parseInt(input, 10);

    if (parsedInput === 0 || isNaN(parsedInput)) {
      setCost("");
    } else {
      setCost(parsedInput);
    }
  }

  const HandleGramInput = (input: string) => {
    const parsedInput = parseInt(input, 10);

    if (parsedInput === 0 || isNaN(parsedInput)) {
      setGram("");
    } else {
      setGram(parsedInput);
    }
  }

  function HandleClosePress() {
    setCost(0);
    setGram(0);
    setStartDate(new Date());
    setGrindSize(3);
    setValueCoffee(0);
    setEditingRecord(null);
    setModal(null);
  }

  function HandleReviewClosePress() {
    setComment("");
    setRating(null);
    setEditingRecord(null);
    setReviewModal(false);
  }

  const recordList = records.length != 0 ? records.map((rc) => {
    const changedate = new Date(rc.startDate);
    // console.log(changedate);
    const date = `${changedate.getFullYear()}年 ${Number(changedate.getMonth()) + 1}月 ${changedate.getDate()}日`;

    function handleEditPress() {
      setEditingRecord(rc.id);
      setCost(rc.cost);
      setGram(rc.gram);
      setStartDate(changedate);
      setGrindSize(rc.grindSize);
      setValueCoffee(rc.coffeeId);
      setModal("Edit");
    }

    function handleCompletePress() {
      setEditingRecord(rc.id);
      setReviewModal(true);
    }

    return (
      (
        <View key={rc.id} style={homeStyles.recordContainer}>
          <TouchableOpacity onPress={handleEditPress} style={globalStyles.editIcon}>
            <FontAwesome name="pencil" size={22} color={Colors.SECONDARY_LIGHT} />
          </TouchableOpacity>
          <Text style={[homeStyles.recordText, { fontSize: 16, marginBottom: 5 }]}>開始日　{date}</Text>
          <Text style={homeStyles.recordText}>{rc.brandName}</Text>
          <Text style={[homeStyles.recordText, { marginBottom: 5 }]}>{rc.coffeeName}</Text>
          <Text style={[homeStyles.recordText, { fontSize: 16 }]}>{rc.gram}g　{rc.cost}円</Text>
          <Text style={[homeStyles.recordText, { fontSize: 16 }]}>挽き目：{rc.grindSize}</Text>
          <TouchableOpacity onPress={handleCompletePress} style={homeStyles.completeBtn}>
            <Image source={require('../assets/cup_brown.png')} style={homeStyles.cupImg} />
            <Text style={homeStyles.completeBtnText}>飲み終わった</Text>
          </TouchableOpacity>
        </View>
      )
    )
  }) : (
    <View style={homeStyles.recordContainer}>
      <Text style={[globalStyles.titleTextLight, { fontSize: 24, marginBottom: 20 }]}>このアプリの使い方</Text>
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={[homeStyles.recordText, { marginBottom: 10 }]}>1. 設定画面でコーヒーブランドとコーヒー豆を登録する</Text>
        <Text style={[homeStyles.recordText, { marginBottom: 10 }]}>2. My図鑑画面でコーヒーを登録する</Text>
        <Text style={[homeStyles.recordText, { marginBottom: 10 }]}>3. ホーム画面で飲み始めたコーヒーの記録を開始する</Text>
        <Text style={homeStyles.recordText}>4. 履歴や分析画面でこれまでの記録を振り返って楽しむ</Text>
      </View>
    </View>
  )

  const warningText = reviewModal ? ("評価を選択してください。") : ("コーヒー名の選択、グラム数の入力は必須項目です。");

  const warning = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <Text style={globalStyles.titleText}>{warningText}</Text>
          <TouchableOpacity style={[globalStyles.smallBtn, { marginTop: 10 }]} onPress={() => setWarningModal(false)}>
            <Text style={globalStyles.smallBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    const parsedDate = new Date(currentDate);
    setStartDate(parsedDate);
  };

  const recordModal = (
    <Modal animationType='slide'>
      <View style={globalStyles.bigModalView}>
        <TouchableOpacity onPress={HandleClosePress} style={globalStyles.closeModalBtn} >
          <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
        </TouchableOpacity>
        <Text style={[globalStyles.titleTextLight, { marginBottom: 10 }]}>{modal == "New" ? "新しくコーヒーを飲み始める" : "編集する"}</Text>
        <View style={homeStyles.inputContainer}>
          <Text style={globalStyles.textLight}>開始日</Text>
          <View style={{ backgroundColor: Colors.SECONDARY_LIGHT, borderRadius: 5 }}>
            <RNDateTimePicker
              mode="date"
              display='calendar'
              value={startDate}
              onChange={onChangeStartDate} />
          </View>
        </View>

        <View style={[homeStyles.inputContainer, { alignItems: 'center', gap: -15, zIndex: 2 }]}>
          <Text style={globalStyles.textLight}>コーヒーを選択</Text>
          <View style={{ alignItems: 'center', width: 300 }}>
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

        <View style={homeStyles.inputContainer}>
          <Text style={globalStyles.textLight}>グラム数</Text>
          <TextInput placeholder='金額' keyboardType='numeric' maxLength={5} value={gram.toString()} onChangeText={HandleGramInput} style={globalStyles.numberInput} />
        </View>
        <View style={homeStyles.inputContainer}>
          <Text style={globalStyles.textLight}>値段(円)</Text>
          <TextInput placeholder='金額' keyboardType='numeric' maxLength={5} value={cost.toString()} onChangeText={HandleCostInput} style={globalStyles.numberInput} />
        </View>

        <View style={homeStyles.inputContainer}>
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
        <TouchableOpacity onPress={modal === "New" ? createNewRecord : editRecord} style={[globalStyles.smallBtn, { alignSelf: 'center', marginVertical: 20 }]} >
          <Text style={globalStyles.titleTextLight}>保存する</Text>
        </TouchableOpacity>
        {modal === "Edit" && (
          <TouchableOpacity style={homeStyles.deleteBtn} onPress={deleteRecord}>
            <Text style={homeStyles.deleteText}>データを削除</Text>
          </TouchableOpacity>
        )}
        {warningModal && warning}
      </View>
    </Modal>
  );

  const recordBtn = itemsCoffee.length != 0 ? (
    <TouchableOpacity onPress={() => setModal("New")} style={homeStyles.recordBtn}>
      <Text style={globalStyles.btnText}>新しくコーヒーを飲み始める</Text>
    </TouchableOpacity>
  ) : (
    <View style={{ opacity: 0.5 }}>
      <View style={homeStyles.recordBtn}>
        <Text style={globalStyles.btnText}>新しくコーヒーを飲み始める</Text>
      </View>
    </View>

  );

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    const parsedDate = new Date(currentDate);
    setEndDate(parsedDate);
  };

  const review = (
    <Modal animationType='slide'>
      <View style={globalStyles.bigModalView}>
        <TouchableOpacity onPress={HandleReviewClosePress} style={globalStyles.closeModalBtn} >
          <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
        </TouchableOpacity>
        <Text style={globalStyles.titleTextLight}>ご馳走様でした！</Text>
        <View style={homeStyles.inputContainer}>
          <Text style={globalStyles.textLight}>終了日</Text>
          <View style={{ backgroundColor: Colors.SECONDARY_LIGHT, borderRadius: 5 }}>
            <RNDateTimePicker
              mode="date"
              display='calendar'
              value={endDate}
              onChange={onChangeEndDate} />
          </View>
        </View>

        <View style={[homeStyles.inputContainer, { zIndex: 2 }]}>
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

        <TouchableOpacity onPress={completeRecord} style={[globalStyles.smallBtn, { alignSelf: 'center', marginVertical: 20, zIndex: 1 }]} >
          <Text style={globalStyles.titleTextLight}>保存する</Text>
        </TouchableOpacity>

        {warningModal && warning}
      </View>
    </Modal>
  );


  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={globalStyles.imgBackground}>
        <Header title={'ホーム'} />

        {recordBtn}

        {recordList}

        {modal && recordModal}

        {reviewModal && review}
      </ImageBackground>
    </View>
  )
}
