import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native'
import React, { SetStateAction, useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee, CoffeeBean, CoffeeBrand } from '../types';
import { globalStyles } from '../Styles/globalStyles';
import Header from './Header';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../Styles/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { coffeeIndexStyles } from '../Styles/coffeeIndexStyles';
import * as SQLite from 'expo-sqlite/next';
import Slider from '@react-native-community/slider';
import { AntDesign } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';


export default function CoffeeIndex() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [newCoffee, setNewCoffee] = useState<Coffee | null>(null);
  const [roast, setRoast] = useState(1);
  const [addModal, setAddModal] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [items, setItems] = useState([]);

  const [openBe, setOpenBe] = useState(false);
  const [valueBe, setValueBe] = useState([]);
  const [itemsBe, setItemsBe] = useState([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
    await db.getAllAsync<Coffee>(`
    SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, GROUP_CONCAT(coffeeBean.name) AS beans
    FROM coffee
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    JOIN inclusion ON inclusion.coffee_id = coffee.id
    JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
    GROUP BY coffee.name
    ;`).then((rsp) => {
      // console.log("rsp", rsp);
      setCoffees(rsp);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

    await db.getAllAsync<CoffeeBrand>(`
    SELECT * FROM coffeeBrand;`).then((rsp) => {
      console.log("rsp", rsp);
      const brandDropDown: any = [];

      rsp.map((br) => { brandDropDown.push({ label: br.name, value: br.id }); })

      setItems(brandDropDown);

    }).catch((error) => {
      console.log("reading coffee brand error!");
      console.log(error.message);
    });

    await db.getAllAsync<CoffeeBean>(`
    SELECT * FROM coffeeBean;`).then((rsp) => {
      // console.log("rsp", rsp);
      // setBeans(rsp);

      const beanDropDown: any = [];

      rsp.map((be) => { beanDropDown.push({ label: be.name, value: be.id }); })

      setItemsBe(beanDropDown);

    }).catch((error) => {
      console.log("reading coffee bean error!");
      console.log(error.message);
    });
  }

  const list = coffees.map((cf) => {
    return (
      <View key={cf.id} style={coffeeIndexStyles.coffeeContainer}>
        <Text style={coffeeIndexStyles.brandText}>{cf.brand}</Text>
        <Text style={coffeeIndexStyles.coffeeText}>{cf.name}</Text>
        {/* <Text >{cf.beans}</Text> */}
      </View>
    )
  })

  async function addTestCoffee() {
    db.withTransactionAsync(async () => {
      const result = await db.runAsync(
        `INSERT INTO coffee (name, roast, body, sweetness, fruity, bitter, aroma, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        ["モカブレンド", 3.0, 3.0, 1.0, 4.0, 4.0, 4.0, 1.0]
      ).catch((error) => {
        console.log("create test coffee error!")
        console.log(error.message);
        return;
      });

      console.log((result as SQLite.SQLiteRunResult).lastInsertRowId);

      await db.runAsync(
        `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
        [(result as SQLite.SQLiteRunResult).lastInsertRowId, 1]
      ).catch((error) => {
        console.log("create test coffee inclusion error!")
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
        [(result as SQLite.SQLiteRunResult).lastInsertRowId, 2]
      ).catch((error) => {
        console.log("create test coffee inclusion error!")
        console.log(error.message);
        return;
      });

    })

    console.log("successfully created test coffee!")

    await getData();
  }

  const addCoffeeModal = (
    <Modal animationType='slide'>
      <View style={globalStyles.bigModalView}>
        <TouchableOpacity onPress={() => setAddModal(false)}>
          <AntDesign name="closesquare" size={24} color={Colors.SECONDARY_LIGHT} style={coffeeIndexStyles.closeModalBtn} />
        </TouchableOpacity>
        <Text style={[globalStyles.titleText, { color: Colors.SECONDARY_LIGHT }]}>新しいコーヒーの追加</Text>

        <View style={{ alignItems: 'center', zIndex: 1 }}>
          <DropDownPicker
            placeholder={'Choose a brand'}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={{ backgroundColor: Colors.SECONDARY_LIGHT }}
            containerStyle={{ width: '50%', }}
            dropDownContainerStyle={{ backgroundColor: Colors.SECONDARY_LIGHT }}
            textStyle={{ fontFamily: 'yusei', fontSize: 12 }}
            zIndex={5000}
          />
        </View>

        <TextInput placeholder='コーヒー名を入力' maxLength={11} style={coffeeIndexStyles.coffeeNameInput} />

        <View style={{ alignItems: 'center', zIndex: 2 }}>
          <DropDownPicker
            multiple={true}
            min={1}
            max={3}
            mode="BADGE"
            placeholder={'Choose beans'}
            open={openBe}
            value={valueBe}
            items={itemsBe}
            setOpen={setOpenBe}
            setValue={setValueBe}
            setItems={setItemsBe}
            style={{ backgroundColor: Colors.SECONDARY_LIGHT }}
            containerStyle={{ width: '90%', }}
            dropDownContainerStyle={{ backgroundColor: Colors.SECONDARY_LIGHT }}
            textStyle={{ fontFamily: 'yusei', fontSize: 12 }}
            zIndex={4000}
          />
        </View>
        <Text>コーヒー豆選択(複数)横スクロールでオンオフできるようにする</Text>
        <Text>画像アップロード(image picker)</Text>
        <Text>コメント</Text>

        <Text>焙煎度(1~5)</Text>
        <Text>コク(1~5)</Text>
        <Text>甘み(1~5)</Text>
        <Text>酸味(1~5)</Text>
        <Text>苦味(1~5)</Text>
        <Text>香り(1~5)</Text>
        <Text>{roast.toFixed(1)}</Text>

        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={1}
          maximumValue={5}
          value={roast}
          onValueChange={(num) => setRoast(num)}
          minimumTrackTintColor={Colors.SECONDARY}
          maximumTrackTintColor={Colors.SECONDARY_LIGHT}
        />


      </View>
    </Modal>
  )

  return (
    <View style={globalStyles.container}>
      <Header title={'My図鑑'} />
      <TextInput placeholder='キーワードで検索' style={coffeeIndexStyles.searchInput} />
      {/* <FontAwesome name="search" size={30} color={Colors.PRIMARY} /> */}
      {list}
      <TouchableOpacity style={coffeeIndexStyles.addBtn} onPress={() => setAddModal(true)}>
        <Ionicons name="add-circle" size={50} color={Colors.PRIMARY} />
      </TouchableOpacity>
      <Text>メモ：豆とブランドが空の場合はまず設定画面で追加を案内されるようにしたい</Text>
      {addModal && addCoffeeModal}
    </View>
  )
}
