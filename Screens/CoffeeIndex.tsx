import { View, Text, TextInput, TouchableOpacity, Modal, ImageBackground, ScrollView } from 'react-native'
import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee, CoffeeBean, CoffeeBrand, RootStackParamList } from '../types';
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
// import toast from 'react-native-toast-notifications/lib/typescript/toast';
// import { useToast } from "react-native-toast-notifications";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CoffeeContext } from '../contexts/CoffeeContext';

export default function CoffeeIndex({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  // const [coffees, setCoffees] = useState<Coffee[]>([]);
  // const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  // const [beans, setBeans] = useState<CoffeeBean[]>([]);
  // const { brands, setBrands, beans, setBeans } = useCoffee();
  const { coffees, setCoffees, brands, setBrands, beans, setBeans } = useContext(CoffeeContext);
  // const [newCoffee, setNewCoffee] = useState<Coffee | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [warningModal, setWarningModal] = useState<"warning" | "confirm" | null>(null);

  const [openBrand, setOpenBrand] = useState(false);
  const [valueBrand, setValueBrand] = useState(0);
  const [itemsBrand, setItemsBrand] = useState([]);

  const [openBean, setOpenBean] = useState(false);
  const [valueBean, setValueBean] = useState([]);
  const [itemsBean, setItemsBean] = useState([]);

  const [coffeeName, setCoffeeName] = useState("");
  const [comment, setComment] = useState("");
  const [roast, setRoast] = useState(1.0);
  const [body, setBody] = useState(1.0);
  const [sweetness, setSweetness] = useState(1.0);
  const [fruity, setFruity] = useState(1.0);
  const [bitter, setBitter] = useState(1.0);
  const [aroma, setAroma] = useState(1.0);

  const [searchWord, setSearchWord] = useState("");

  const db = useSQLiteContext();
  // const toast = useToast();

  useEffect(() => {

    const brandDropDown: any = [];
    brands && brands.map((brand) => {
      brandDropDown.push({ label: brand.name, value: brand.id });
    })
    setItemsBrand(brandDropDown);

    const beanDropDown: any = [];
    beans && beans.map((be) => { beanDropDown.push({ label: be.name, value: be.id }); })
    setItemsBean(beanDropDown);

    //   db.withExclusiveTransactionAsync(async () => {
    //     await getData();
    //   })
  }, [brands, beans])

  async function getData() {
    db.getAllAsync<Coffee>(`
    SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, GROUP_CONCAT(coffeeBean.name) AS beans
    FROM coffee
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    JOIN inclusion ON inclusion.coffee_id = coffee.id
    JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
    GROUP BY coffee.name
    ;`).then((rsp) => {
      console.log("getData works", rsp);
      setCoffees(rsp);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

    db.getAllAsync<Coffee>(`
      SELECT * FROM coffee
      ;`).then((rsp) => {
      console.log("coffees", rsp);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

    db.getAllAsync<Coffee>(`
      SELECT * FROM inclusion
      ;`).then((rsp) => {
      console.log("inclusion", rsp);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

    // db.getAllAsync<CoffeeBrand>(`
    // SELECT * FROM coffeeBrand;`).then((rsp) => {
    //   // console.log("rsp", rsp);
    //   const brandDropDown: any = [];

    //   rsp.map((br) => { brandDropDown.push({ label: br.name, value: br.id }); })

    //   setItemsBrand(brandDropDown);

    // }).catch((error) => {
    //   console.log("reading coffee brand error!");
    //   console.log(error.message);
    // });

    // const brandDropDown: any = [];

    // brands && brands.map((brand) => {
    //   brandDropDown.push({ label: brand.name, value: brand.id });
    // })

    // setItemsBrand(brandDropDown);

    // db.getAllAsync<CoffeeBean>(`
    // SELECT * FROM coffeeBean;`).then((rsp) => {
    //   // console.log("rsp", rsp);
    //   // setBeans(rsp);

    //   const beanDropDown: any = [];

    //   rsp.map((be) => { beanDropDown.push({ label: be.name, value: be.id }); })

    //   setItemsBean(beanDropDown);

    // }).catch((error) => {
    //   console.log("reading coffee bean error!");
    //   console.log(error.message);
    // });

    // const beanDropDown: any = [];

    // beans && beans.map((be) => { beanDropDown.push({ label: be.name, value: be.id }); })

    // setItemsBean(beanDropDown);
  }

  const filteredCoffee = (!coffees) ? [] : coffees.filter((coffee) => {
    let beans: string[] = [];
    let brands: string[] = [];

    itemsBean.map((bean) => {
      beans.push(bean.label);
    })

    itemsBrand.map((brand) => {
      brands.push(brand.label);
    })

    const haystack = coffee.name + beans.join("") + brands.join("");
    const isMatched = (!searchWord) || (!!searchWord && haystack.toLowerCase().includes(searchWord.toLowerCase()));
    return isMatched;

  })

  const list = filteredCoffee && filteredCoffee.map((cf) => {
    return (
      <TouchableOpacity key={cf.id} style={coffeeIndexStyles.coffeeContainer}
        onPress={() => navigation.navigate("CoffeeDetails", { id: cf.id })}>
        <Text style={coffeeIndexStyles.brandText}>{cf.brand}</Text>
        <Text style={coffeeIndexStyles.coffeeText}>{cf.name}</Text>
      </TouchableOpacity>
    )
  })

  const warning = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <Text style={globalStyles.titleText}>コーヒー名の入力、コーヒーブランドとコーヒー豆の選択は必須項目です。</Text>
          <TouchableOpacity style={[globalStyles.smallBtn, { marginTop: 10 }]} onPress={() => setWarningModal(null)}>
            <Text style={globalStyles.smallBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  const success = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <Text style={globalStyles.titleText}>新しいコーヒー情報を登録しました。</Text>
          <TouchableOpacity style={[globalStyles.smallBtn, { marginTop: 10 }]} onPress={() => setWarningModal(null)}>
            <Text style={globalStyles.smallBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  async function addInclusion(coffee_id: number, bean_id: number) {
    db.runAsync(
      `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
      [coffee_id, bean_id]
    ).catch((error) => {
      console.log("create test coffee inclusion error!")
      console.log(error.message);
      return;
    });
  }

  async function addNewCoffee() {
    if (coffeeName === "" || valueBrand === 0 || valueBean.length == 0) {
      setWarningModal("warning");
      return;
    }

    db.withTransactionAsync(async () => {
      const result = await db.runAsync(
        `INSERT INTO coffee (name, roast, body, sweetness, fruity, bitter, aroma, comment, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [coffeeName, roast, body, sweetness, fruity, bitter, aroma, comment, valueBrand])

      // ).catch((error) => {
      //   console.log("create coffee error!")
      //   console.log(error.message);
      //   return;
      // });

      if (!result) {
        console.log("creating new coffee error!");
      }

      // console.log((result as SQLite.SQLiteRunResult).lastInsertRowId);
      // console.log(valueBean.length);

      // if (valueBean.length == 1) {
      //   addInclusion((result as SQLite.SQLiteRunResult).lastInsertRowId, valueBean[0]);
      // } else if ((valueBean.length == 2)) {
      //   addInclusion((result as SQLite.SQLiteRunResult).lastInsertRowId, valueBean[0]);
      //   addInclusion((result as SQLite.SQLiteRunResult).lastInsertRowId, valueBean[1]);
      // } else if ((valueBean.length == 3)) {
      //   addInclusion((result as SQLite.SQLiteRunResult).lastInsertRowId, valueBean[0]);
      //   addInclusion((result as SQLite.SQLiteRunResult).lastInsertRowId, valueBean[1]);
      //   addInclusion((result as SQLite.SQLiteRunResult).lastInsertRowId, valueBean[2]);
      // }

      for (let i = 0; i < valueBean.length; i++) {
        addInclusion((result as SQLite.SQLiteRunResult).lastInsertRowId, valueBean[i]);
      }

      await getData();

    })

    console.log("successfully created new coffee!")

    setValueBrand(0);
    setValueBean([]);
    setCoffeeName("");
    setComment("");
    setRoast(1.0);
    setBody(1.0);
    setSweetness(1.0);
    setFruity(1.0);
    setBitter(1.0);
    setAroma(1.0);
    setAddModal(false);

    setWarningModal("confirm");

  }

  const values = [
    { name: "焙煎度", value: roast, setValue: setRoast },
    { name: "コク　", value: body, setValue: setBody },
    { name: "甘味　", value: sweetness, setValue: setSweetness },
    { name: "酸味　", value: fruity, setValue: setFruity },
    { name: "苦味　", value: bitter, setValue: setBitter },
    { name: "香り　", value: aroma, setValue: setAroma }
  ]

  const setTaste = values.map((v) => {

    return (
      <View style={coffeeIndexStyles.sliderContainer} key={v.name}>
        <Text style={globalStyles.textLight}>{v.name}</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={1}
          maximumValue={5}
          value={v.value}
          onValueChange={(num) => v.setValue(num)}
          minimumTrackTintColor={Colors.SECONDARY}
          maximumTrackTintColor={Colors.SECONDARY_LIGHT}
        />
        <Text style={globalStyles.textLight}>{v.value.toFixed(1)}</Text>
      </View>
    );
  })

  const addCoffeeModal = (
    <Modal animationType='slide'>
      <View style={globalStyles.bigModalView}>
        <TouchableOpacity onPress={() => setAddModal(false)} style={globalStyles.closeModalBtn} >
          <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
        </TouchableOpacity>
        <Text style={[globalStyles.titleTextLight, { marginBottom: 10 }]}>新しいコーヒーの追加</Text>

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

        <TextInput placeholder='コーヒー名を入力' maxLength={11} value={coffeeName} onChangeText={(text) => setCoffeeName(text)} style={globalStyles.coffeeNameInput} />

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

        {/* <TouchableOpacity style={[globalStyles.smallBtn, { alignSelf: 'center', marginVertical: 10 }]} onPress={() => setAddModal(false)}>
          <Text style={globalStyles.smallBtnText}>画像アップロード</Text>
        </TouchableOpacity> */}

        <TextInput placeholder='コメントを入力' maxLength={200} numberOfLines={4} multiline={true}
          value={comment} onChangeText={(text) => setComment(text)}
          style={[globalStyles.coffeeNameInput, { height: 100, marginTop: 10 }]} />


        <TouchableOpacity style={[globalStyles.smallBtn, { alignSelf: 'center', marginVertical: 20 }]} onPress={addNewCoffee}>
          <Text style={globalStyles.titleTextLight}>保存する</Text>
        </TouchableOpacity>

        {warningModal === "warning" && warning}
      </View>
    </Modal>
  )


  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={{ width: '100%', height: '100%' }}>
        <Header title={'My図鑑'} />
        <TextInput placeholder='キーワードで検索' style={coffeeIndexStyles.searchInput} value={searchWord} onChangeText={(text) => setSearchWord(text)} />
        {/* <FontAwesome name="search" size={30} color={Colors.PRIMARY} /> */}
        <ScrollView>
          {filteredCoffee.length != 0 ? list : (
            <Text style={globalStyles.titleText}>データがありません</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={coffeeIndexStyles.addBtn} onPress={() => setAddModal(true)}>
          <Ionicons name="add-circle" size={50} color={Colors.PRIMARY} />
        </TouchableOpacity>
        {addModal && addCoffeeModal}
        {warningModal === "confirm" && success}
      </ImageBackground>
    </View>
  )
}
