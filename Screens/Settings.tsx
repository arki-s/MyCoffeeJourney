import { View, Text, TouchableOpacity, TextInput, Touchable, ImageBackground, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { CoffeeBean, CoffeeBrand } from '../types';
import { useSQLiteContext } from 'expo-sqlite/next';
import Colors from '../Styles/Colors';
import { settingsStyles } from '../Styles/settingsStyles';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


export default function Settings() {
  const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [brand, setBrand] = useState<string>("");
  const [brandId, setBrandId] = useState<number | null>(null);
  const [bean, setBean] = useState<string>("");
  const [beanId, setBeanId] = useState<number | null>(null);
  const [brandManage, setBrandManage] = useState<"brand" | "bean" | null>(null);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData();
    })
  }, [db])

  async function getData() {
    await db.getAllAsync<CoffeeBrand>(`
    SELECT * FROM coffeeBrand;`).then((rsp) => {
      console.log("rsp", rsp);
      setBrands(rsp);
    }).catch((error) => {
      console.log("reading coffee brand error!");
      console.log(error.message);
    });

    await db.getAllAsync<CoffeeBean>(`
    SELECT * FROM coffeeBean;`).then((rsp) => {
      console.log("rsp", rsp);
      setBeans(rsp);
    }).catch((error) => {
      console.log("reading coffee bean error!");
      console.log(error.message);
    });
  }

  async function createBrand() {
    if (!brand) return null;

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO coffeeBrand (name) VALUES (?);`, [brand]
      ).catch((error) => {
        console.log("creating brand error!");
        console.log(error.message);
        return;
      });

      await getData();

    })
  };

  async function editBrand(id: number) {
    // if (!brand || !brandId) return null;

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE coffeeBrand SET name= ? WHERE id = ?;`, [brand, id]
      ).catch((error) => {
        console.log("editing brand error!");
        console.log(error.message);
        setBrandId(null);
        setBrandId(null);
        setBrand("");
        return;
      });

      setBrandId(null);
      setBrand("");
      await getData();

    })
  };

  async function deleteBrand(id: number) {
    // if (!brandId) return null;

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `DELETE FROM coffeeBrand WHERE id = ?;`, [id]
      ).catch((error) => {
        console.log("deleting brand error!");
        console.log(error.message);
        setBrandId(null);
        return;
      });

      setBrandId(null);
      await getData();

    })
  };


  async function createBean() {
    if (!bean) return null;

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO coffeeBean (name) VALUES (?);`, [bean]
      ).catch((error) => {
        console.log("creating bean error!");
        console.log(error.message);
        setBean("");
        return;
      });

      setBean("");
      await getData();
    })
  };

  async function editBean(id: number) {
    // if (!bean || !beanId) return null;

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE coffeeBean SET name= ? WHERE id = ?;`, [bean, id]
      ).catch((error) => {
        console.log("editing bean error!");
        console.log(error.message);
        setBeanId(null);
        setBean("");
        return;
      });

      setBeanId(null);
      setBean("");
      await getData();

    })
  };

  async function deleteBean(id: number) {
    // if (!beanId) return null;

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `DELETE FROM coffeeBean WHERE id = ?;`, [id]
      ).catch((error) => {
        console.log("deleting bean error!");
        console.log(error.message);
        setBeanId(null);
        return;
      });

      setBeanId(null);
      await getData();

    })
  };

  const brandList = brands.map((br) => {
    return (
      <View style={settingsStyles.brandBeansList} key={br.id}>
        <Text style={settingsStyles.listText}>{br.name}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 15 }}>
          <TouchableOpacity onPress={() => editBrand(br.id)}>
            <FontAwesome name="pencil" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteBrand(br.id)}>
            <FontAwesome name="trash" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>

        </View>
      </View>
    )
  });

  const beanList = beans.map((be) => {
    return (
      <View style={settingsStyles.brandBeansList} key={be.id}>
        <Text style={settingsStyles.listText}>{be.name}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 15 }}>
          <TouchableOpacity onPress={() => editBean(be.id)}>
            <FontAwesome name="pencil" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteBean(be.id)}>
            <FontAwesome name="trash" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>

        </View>
      </View>
    )
  });

  const brandModal = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={settingsStyles.modalWindow}>
          <TouchableOpacity onPress={() => setBrandManage(null)}>
            <AntDesign name="closesquare" size={24} color={Colors.SECONDARY} style={settingsStyles.closeBtn} />
          </TouchableOpacity>
          <Text style={globalStyles.titleText}>コーヒーブランドの管理</Text>
          <View style={settingsStyles.newAddContainer}>
            <TextInput placeholder='新しく追加したいブランド名を入力' style={settingsStyles.newAddInput} maxLength={11} />
            <TouchableOpacity style={globalStyles.smallBtn}>
              <Text style={globalStyles.smallBtnText}>追加</Text>
            </TouchableOpacity>

          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {brandList}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  const beanModal = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={settingsStyles.modalWindow}>
          <TouchableOpacity onPress={() => setBrandManage(null)}>
            <AntDesign name="closesquare" size={24} color={Colors.SECONDARY} style={settingsStyles.closeBtn} />
          </TouchableOpacity>
          <Text style={globalStyles.titleText}>コーヒー豆の管理</Text>
          <View style={settingsStyles.newAddContainer}>
            <TextInput placeholder='新しく追加したいコーヒー豆の産地を入力' style={settingsStyles.newAddInput} maxLength={11} />
            <TouchableOpacity style={globalStyles.smallBtn}>
              <Text style={globalStyles.smallBtnText}>追加</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {beanList}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  const editModal = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <Text style={globalStyles.titleText}>編集</Text>
          <TouchableOpacity style={globalStyles.smallBtn}>
            <Text style={globalStyles.smallBtnText}>編集を保存</Text>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.smallCancelBtn}>
            <Text style={globalStyles.smallCancelBtnText}>キャンセル</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )


  return (
    <View style={globalStyles.container}>
      <Header title={'設定'} />
      <View style={settingsStyles.contentsContainer}>
        <TouchableOpacity style={settingsStyles.manageBtn} onPress={() => setBrandManage("brand")}>
          <Text style={settingsStyles.btnText}>コーヒーブランドの管理</Text>
        </TouchableOpacity>

        <TouchableOpacity style={settingsStyles.manageBtn} onPress={() => setBrandManage("bean")}>
          <Text style={settingsStyles.btnText}>コーヒー豆の管理</Text>
        </TouchableOpacity>

        <TouchableOpacity style={settingsStyles.manageBtn}>
          <Text style={settingsStyles.btnText}>!! 全データの削除 !!</Text>
        </TouchableOpacity>
        {brandManage == "brand" && brandModal}
        {brandManage == "bean" && beanModal}
      </View>


      <TextInput placeholder='new brand name' value={brand} onChangeText={setBrand} style={{ padding: 10, borderRadius: 10, borderWidth: 1, borderColor: Colors.PRIMARY }} />
      <TouchableOpacity style={{ backgroundColor: "red", padding: 20 }} onPress={createBrand}>
        <Text>Add New Coffee Brand</Text>
      </TouchableOpacity>
      {brandList}
      <TextInput placeholder='new bean name' value={bean} onChangeText={setBean} style={{ padding: 10, borderRadius: 10, borderWidth: 1, borderColor: Colors.PRIMARY }} />
      <TouchableOpacity style={{ backgroundColor: "pink", padding: 20 }} onPress={createBean}>
        <Text>Add New Coffee Bean</Text>
      </TouchableOpacity>
      {beanList}
    </View>
  )
}
