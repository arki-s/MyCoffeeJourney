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
  const [addModal, setAddModal] = useState(false);

  const [openBrand, setOpenBrand] = useState(false);
  const [valueBrand, setValueBrand] = useState(0);
  const [itemsBrand, setItemsBrand] = useState([]);

  const [openBean, setOpenBean] = useState(false);
  const [valueBean, setValueBean] = useState([]);
  const [itemsBean, setItemsBean] = useState([]);

  const [roast, setRoast] = useState(1);
  const [body, setBody] = useState(1);
  const [sweetness, setSweetness] = useState(1);
  const [fruity, setFruity] = useState(1);
  const [bitter, setBitter] = useState(1);


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

      setItemsBrand(brandDropDown);

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

      setItemsBean(beanDropDown);

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

  const values = [
    { name: "焙煎度", value: roast, setValue: setRoast },
    { name: "コク　", value: body, setValue: setBody },
    { name: "甘味　", value: sweetness, setValue: setSweetness },
    { name: "酸味　", value: fruity, setValue: setFruity },
    { name: "苦味　", value: bitter, setValue: setBitter },
  ]

  const setTaste = values.map((v) => {

    return (
      <View style={coffeeIndexStyles.sliderContainer} key={v.name}>
        <Text style={coffeeIndexStyles.addModalText}>{v.name}</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={1}
          maximumValue={5}
          value={v.value}
          onValueChange={(num) => v.setValue(num)}
          minimumTrackTintColor={Colors.SECONDARY}
          maximumTrackTintColor={Colors.SECONDARY_LIGHT}
        />
        <Text style={coffeeIndexStyles.addModalText}>{v.value.toFixed(1)}</Text>
      </View>
    );
  })

  const addCoffeeModal = (
    <Modal animationType='slide'>
      <View style={globalStyles.bigModalView}>
        <TouchableOpacity onPress={() => setAddModal(false)}>
          <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} style={coffeeIndexStyles.closeModalBtn} />
        </TouchableOpacity>
        <Text style={[coffeeIndexStyles.saveBtnText, { textAlign: 'center', marginBottom: 10 }]}>新しいコーヒーの追加</Text>

        <View style={{ alignItems: 'center', zIndex: 2, marginVertical: 10 }}>
          <DropDownPicker
            placeholder={'Choose a brand'}
            open={openBrand}
            value={valueBrand}
            items={itemsBrand}
            setOpen={setOpenBrand}
            setValue={setValueBrand}
            setItems={setItemsBrand}
            style={{ backgroundColor: Colors.SECONDARY_LIGHT }}
            containerStyle={{ width: '50%', }}
            dropDownContainerStyle={{ backgroundColor: Colors.SECONDARY_LIGHT }}
            textStyle={{ fontFamily: 'yusei', fontSize: 12 }}
            zIndex={5000}
          />
        </View>

        <TextInput placeholder='コーヒー名を入力' maxLength={11} style={coffeeIndexStyles.coffeeNameInput} />

        <View style={{ alignItems: 'center', zIndex: 1, marginVertical: 10 }}>
          <DropDownPicker
            multiple={true}
            min={1}
            max={3}
            mode="BADGE"
            placeholder={'Choose beans'}
            open={openBean}
            value={valueBean}
            items={itemsBean}
            setOpen={setOpenBean}
            setValue={setValueBean}
            setItems={setItemsBean}
            style={{ backgroundColor: Colors.SECONDARY_LIGHT }}
            containerStyle={{ width: '90%', }}
            dropDownContainerStyle={{ backgroundColor: Colors.SECONDARY_LIGHT }}
            textStyle={{ fontFamily: 'yusei', fontSize: 12 }}
            zIndex={4000}
          />
        </View>

        {setTaste}

        <TouchableOpacity style={[globalStyles.smallBtn, { alignSelf: 'center', marginVertical: 10 }]} onPress={() => setAddModal(false)}>
          <Text style={globalStyles.smallBtnText}>画像アップロード</Text>
        </TouchableOpacity>

        <TextInput placeholder='コメントを入力' maxLength={200} numberOfLines={4} multiline={true} style={[coffeeIndexStyles.coffeeNameInput, { height: 100, marginTop: 10 }]} />


        <TouchableOpacity style={[globalStyles.smallBtn, { alignSelf: 'center', marginVertical: 20 }]} onPress={() => setAddModal(false)}>
          <Text style={coffeeIndexStyles.saveBtnText}>保存する</Text>
        </TouchableOpacity>


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
