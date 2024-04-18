import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ImageBackground } from 'react-native'
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


export default function Home({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [start, setStart] = useState(false);
  const [grindSize, setGrindSize] = useState(3);
  const [gram, setGram] = useState<number | "">(0);
  const [cost, setCost] = useState<number | "">(0);
  const [startDate, setStartDate] = useState(new Date());
  const [openCoffee, setOpenCoffee] = useState(false);
  const [valueCoffee, setValueCoffee] = useState(0);
  const [itemsCoffee, setItemsCoffee] = useState([]);
  const [warningModal, setWarningModal] = useState(false);

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
    SELECT record.id, record.startDate, record.gram, record.cost, record.grindSize, coffee.name AS coffeeName, coffeeBrand.name AS brandName
    FROM record
    JOIN coffee ON coffee.id = record.coffee_id
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    WHERE record.endDate IS NULL;
    `);

    if (!response) {
      console.log("loading record error!");
      return;
    }

    console.log(response);

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

    setStart(false);
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

  const recordList = records.length != 0 ? records.map((rc) => {
    const changedate = new Date(rc.startDate);
    console.log(changedate);
    const date = `${changedate.getFullYear()}年 ${Number(changedate.getMonth()) + 1}月 ${changedate.getDate()}日`;


    return (
      (
        <View key={rc.id} style={homeStyles.recordContainer}>
          <Text style={[homeStyles.recordText, { fontSize: 16, marginBottom: 5 }]}>開始日　{date}</Text>
          <Text style={homeStyles.recordText}>{rc.brandName}</Text>
          <Text style={[homeStyles.recordText, { marginBottom: 5 }]}>{rc.coffeeName}</Text>
          <Text style={[homeStyles.recordText, { fontSize: 16 }]}>{rc.gram}g　{rc.cost}円</Text>
          <Text style={[homeStyles.recordText, { fontSize: 16 }]}>挽き目：{rc.grindSize}</Text>
        </View>
      )
    )
  }) : (
    <Text>データがありません</Text>
  )

  const warning = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <Text style={globalStyles.titleText}>コーヒー名の選択、グラム数の入力は必須項目です。</Text>
          <TouchableOpacity style={[globalStyles.smallBtn, { marginTop: 10 }]} onPress={() => setWarningModal(false)}>
            <Text style={globalStyles.smallBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const startModal = (
    <Modal animationType='slide'>
      <View style={globalStyles.bigModalView}>
        <TouchableOpacity onPress={() => setStart(false)} style={globalStyles.closeModalBtn} >
          <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
        </TouchableOpacity>
        <Text style={[globalStyles.titleTextLight, { marginBottom: 10 }]}>新しくコーヒーを飲み始める</Text>
        <View style={homeStyles.inputContainer}>
          <Text style={globalStyles.textLight}>開始日</Text>
          <View style={{ backgroundColor: Colors.SECONDARY_LIGHT, borderRadius: 5 }}>
            <RNDateTimePicker
              mode="date"
              display='calendar'
              value={startDate}
              onChange={() => setStartDate(startDate)} />
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
          <TextInput placeholder='金額' keyboardType='numeric' maxLength={5} value={gram.toString()} onChangeText={HandleGramInput} style={homeStyles.numberInput} />
        </View>
        <View style={homeStyles.inputContainer}>
          <Text style={globalStyles.textLight}>値段(円)</Text>
          <TextInput placeholder='金額' keyboardType='numeric' maxLength={5} value={cost.toString()} onChangeText={HandleCostInput} style={homeStyles.numberInput} />
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
        <TouchableOpacity onPress={createNewRecord} style={[globalStyles.smallBtn, { alignSelf: 'center', marginVertical: 20 }]} >
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
        <TouchableOpacity onPress={() => setStart(true)} style={homeStyles.recordBtn}>
          <Text style={globalStyles.btnText}>新しくコーヒーを飲み始める</Text>
        </TouchableOpacity>

        {recordList}
        {/* 終了日のないレコード一覧を表示する */}

        {start && startModal}
      </ImageBackground>
    </View>
  )
}
