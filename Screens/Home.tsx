import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
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


export default function Home({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [start, setStart] = useState(false);
  const [grindSize, setGrindSize] = useState(3);
  const [gram, setGram] = useState(0);
  const [cost, setCost] = useState(0);
  const [startDate, setStartDate] = useState(0);


  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      // await getData();
    })
  }, [db])

  const startModal = (
    <Modal animationType='slide'>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.bigModalView}>
          <TouchableOpacity onPress={() => setStart(false)} style={globalStyles.closeModalBtn} >
            <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
          </TouchableOpacity>
          <Text style={globalStyles.titleText}>コーヒーを飲み始める！</Text>
          <Text>開始日</Text>
          <Text>飲むコーヒーを選択</Text>
          <Text>グラム数</Text>
          <Text>値段</Text>
          <Text>挽き目：スライダー</Text>
        </View>
      </View>
    </Modal>
  );


  return (
    <View style={globalStyles.container}>
      <Header title={'ホーム'} />
      <TouchableOpacity onPress={() => setStart(true)}>
        <Text>コーヒーを飲み始める！</Text>
      </TouchableOpacity>
      {/* 終了日のないレコード一覧を表示åする */}

      {start && startModal}
    </View>
  )
}
