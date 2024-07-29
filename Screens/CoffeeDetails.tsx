import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Touchable, TextInput } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Coffee, RootStackParamList, Review, Record } from '../types'
import { RouteProp } from '@react-navigation/native'
import Header from './Header'
import { useSQLiteContext } from 'expo-sqlite/next'
import { coffeeDetailsStyles } from '../Styles/coffeeDetailsStyles'
import Colors from '../Styles/Colors'
import Slider from '@react-native-community/slider';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { CoffeeContext } from '../contexts/CoffeeContext'
import DropDownPicker from 'react-native-dropdown-picker'
import { AntDesign } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite/next';


type CoffeeDetailsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CoffeeDetails'>;
  route: RouteProp<RootStackParamList, 'CoffeeDetails'>;
}

export default function CoffeeDetails({ navigation, route }: CoffeeDetailsProps) {
  const { setCoffees, brands, setBrands, beans, setBeans, setRecords, reviews, setReviews } = useContext(CoffeeContext);
  const [coffee, setCoffee] = useState<Coffee | null>(null);
  const [image, setImage] = useState(false);
  const [count, setCount] = useState(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  // const [reviews, setReviews] = useState<Review[]>([]);
  const [modalState, setModalState] = useState<"edit" | "delete" | null>(null);

  const [openBrand, setOpenBrand] = useState(false);
  const [valueBrand, setValueBrand] = useState(0);
  const [itemsBrand, setItemsBrand] = useState([]);

  const [openBean, setOpenBean] = useState(false);
  const [valueBean, setValueBean] = useState<number[]>([]);
  const [itemsBean, setItemsBean] = useState([]);

  const [coffeeName, setCoffeeName] = useState("");
  const [comment, setComment] = useState("");
  const [roast, setRoast] = useState(1.0);
  const [body, setBody] = useState(1.0);
  const [sweetness, setSweetness] = useState(1.0);
  const [fruity, setFruity] = useState(1.0);
  const [bitter, setBitter] = useState(1.0);
  const [aroma, setAroma] = useState(1.0);
  const [warningModal, setWarningModal] = useState(false);

  const db = useSQLiteContext();
  const memorizedId = useMemo(() => route.params.id, [route.params.id]);

  useEffect(() => {
    db.withExclusiveTransactionAsync(async () => {
      await getData(memorizedId);
    })

    const brandDropDown: any = [];
    brands && brands.map((brand) => {
      brandDropDown.push({ label: brand.name, value: brand.id });
    })
    setItemsBrand(brandDropDown);

    const beanDropDown: any = [];
    beans && beans.map((be) => { beanDropDown.push({ label: be.name, value: be.id }); })
    setItemsBean(beanDropDown);
  }, [db, memorizedId])

  async function getData(id: any) {
    await db.getAllAsync<Coffee>(`
    SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, coffeeBrand.id AS brand_id,GROUP_CONCAT(coffeeBean.name) AS beans, GROUP_CONCAT(coffeeBean.id) AS beans_id
    FROM coffee
    JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
    LEFT JOIN inclusion ON inclusion.coffee_id = coffee.id
    LEFT JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
    WHERE coffee.id = ${id}
    GROUP BY coffee.name
    ;`).then((rsp) => {
      // console.log("Details rsp", rsp);
      setCoffee(rsp ? rsp[0] : null);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

    await db.getAllAsync(`
      SELECT COUNT(*)
      FROM record
      WHERE coffee_id = ${memorizedId}
      AND endDate IS NOT NULL;`)
      .then((rsp: any) => {
        // console.log(rsp[0]["COUNT(*)"]);
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
      // console.log("average", rsp);
      setAverageRating(parseFloat(rsp[0]["AVG(rating)"]));
      // console.log(averageRating);
    }).catch((error) => {
      console.log("average rating error!")
      console.log(error.message);
    })

  }

  async function getDataAll() {
    db.getAllAsync<Coffee>(`
      SELECT coffee.id, coffee.name, coffee.photo, coffee.favorite, coffee.drinkCount, coffee.comment, coffee.roast, coffee.body, coffee.sweetness, coffee.fruity, coffee.bitter, coffee.aroma, coffeeBrand.name AS brand, coffeeBrand.id AS brand_id, GROUP_CONCAT(coffeeBean.name) AS beans
      FROM coffee
      JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
      JOIN inclusion ON inclusion.coffee_id = coffee.id
      JOIN coffeeBean ON coffeeBean.id = inclusion.bean_id
      GROUP BY coffee.name
      ;`).then((rsp) => {
      console.log(rsp);
      setCoffees(rsp);

    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

    db.getAllAsync<Record>(`
      SELECT record.*, coffee.name AS coffeeName, coffeeBrand.name AS brandName, review.rating AS rating, review.comment AS comment, coffee.id AS coffeeId, review.id AS reviewId
      FROM record
      JOIN coffee ON coffee.id = record.coffee_id
      JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
      LEFT JOIN review ON review.record_id = record.id
      ORDER BY record.endDate DESC;
      `).then((rsp) => {
      setRecords(rsp);
    }).catch((error) => {
      console.log("loading error!");
      console.log(error.message);
      return;
    })

    await db.getAllAsync(`
      SELECT review.rating AS rating, review.comment AS comment, record.endDate AS date, review.record_id AS record_id
      FROM review
      JOIN record ON record.id = review.record_id
      JOIN coffee ON coffee.id = record.coffee_id
      ORDER BY record.endDate DESC;
      `).then((rsp: any) => {
      setReviews(rsp);
    }).catch((error) => {
      console.log("reviews error!");
      console.log(error.message);
    })

  }

  async function deleteCoffee() {

    db.runAsync(
      `DELETE FROM review
       JOIN record ON review.record_id = record.id
       WHERE record.coffee_id = ${memorizedId};`,
    ).catch((error) => {
      console.log("deleting reviews error!")
      console.log(error.message);
      return;
    });

    db.runAsync(
      `DELETE FROM record WHERE coffee_id = ${memorizedId}`,
    ).catch((error) => {
      console.log("deleting records error!")
      console.log(error.message);
      return;
    });

    db.runAsync(
      `DELETE FROM inclusion WHERE coffee_id = ${memorizedId}`,
    ).catch((error) => {
      console.log("deleting inclusions error!")
      console.log(error.message);
      return;
    });

    db.runAsync(
      `DELETE FROM coffee WHERE id = ${memorizedId}`,
    ).catch((error) => {
      console.log("deleting coffee error!")
      console.log(error.message);
      return;
    });

    await getDataAll();
    console.log('successfully deleted a coffee data!');
    setModalState(null);

    navigation.navigate('MyZukan');

  }

  const filteredReviews = reviews && reviews.filter(rv => rv.coffee_id === memorizedId);
  // console.log(filteredReviews);

  const pastReviews = filteredReviews && filteredReviews.map((review) => {
    if (!review.date) return null;
    const ratingStars = review.rating ? "⭐️".repeat(review.rating) : "";
    const changeEndDate = new Date(review.date);
    const endDateDisplay = `${changeEndDate.getFullYear()}年 ${Number(changeEndDate.getMonth()) + 1}月 ${changeEndDate.getDate()}日`;
    return (
      <View key={review.record_id} style={{ marginHorizontal: 20 }}>
        <View style={coffeeDetailsStyles.reviewContainer}>
          <Text style={coffeeDetailsStyles.reviewText}>{endDateDisplay}</Text>
          <Text style={coffeeDetailsStyles.reviewText}>{ratingStars}</Text>
        </View>
        <Text style={coffeeDetailsStyles.reviewText}>{review.comment}</Text>
      </View>
    )
  })



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
      compress: 0.7,
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

  function averageStars() {
    if (!averageRating) {
      return (
        <Text style={coffeeDetailsStyles.countText}>未評価</Text>
      )
    }

    let check: number = Math.floor(averageRating);

    if (averageRating - check == 0.5) {
      return (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <Text style={coffeeDetailsStyles.countText}>{"⭐️".repeat(averageRating)}</Text><Text style={coffeeDetailsStyles.smallStar}>⭐</Text>
        </View>
      )
    }

    return (
      <Text style={coffeeDetailsStyles.countText}>{"⭐️".repeat(averageRating)}</Text>
    )

  }

  const deleteModal = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <Text style={globalStyles.titleText}>
            このコーヒー情報を削除しますか？{"\n"}一度削除すると履歴やレビューも削除され、データを元に戻すことはできなくなります。
          </Text>
          <TouchableOpacity style={[globalStyles.smallBtn, { marginVertical: 8 }]} onPress={deleteCoffee}>
            <Text style={globalStyles.smallBtnText}>削除する</Text>
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.smallCancelBtn} onPress={() => setModalState(null)}>
            <Text style={globalStyles.smallCancelBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  //重複コードのためどこかでまとめられるかも　start

  async function deleteInclusion(coffee_id: number) {
    db.runAsync(
      `DELETE FROM inclusion WHERE coffee_id = ?;`,
      [coffee_id]
    ).catch((error) => {
      console.log("deleting inclusion error!")
      console.log(error.message);
      return;
    });
  }

  async function addInclusion(coffee_id: number, bean_id: number) {

    db.runAsync(
      `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
      [coffee_id, bean_id]
    ).catch((error) => {
      console.log("editing inclusion error!")
      console.log(error.message);
      return;
    });

  }

  async function HandleSavePress() {
    if (coffeeName === "" || valueBrand === 0 || valueBean.length == 0) {
      setWarningModal(true);
      return;
    }

    try {
      if (!memorizedId) return null;
      await db.withTransactionAsync(async () => {
        const result = await db.runAsync(
          `UPDATE coffee SET name = ?, roast = ?, body = ?, sweetness = ?, fruity =?, bitter = ?, aroma = ?, comment =?, brand_id = ? WHERE id = ${memorizedId};`,
          [coffeeName, roast, body, sweetness, fruity, bitter, aroma, comment, valueBrand]
        );

        if (!result) {
          console.log("editing coffee error!");
          return;
        }

        deleteInclusion(memorizedId);

        for (let i = 0; i < valueBean.length; i++) {
          addInclusion(memorizedId, valueBean[i]);
        }

        await getData(memorizedId);
      });

      HandleCloseEditPress();
    } catch (error) {
      console.error("Error saving coffee:", error);
    }

    // db.withTransactionAsync(async () => {
    //   const result = await db.runAsync(
    //     `UPDATE coffee SET name = ?, roast = ?, body = ?, sweetness = ?, fruity =?, bitter = ?, aroma = ?, comment =? , brand_id = ?) WHERE id = ${memorizedId};`,
    //     [coffeeName, roast, body, sweetness, fruity, bitter, aroma, comment, valueBrand])

    //   if (!result) {
    //     console.log("editing coffee error!");
    //   }

    //   for (let i = 0; i < valueBean.length; i++) {
    //     addInclusion((result as SQLite.SQLiteRunResult).lastInsertRowId, valueBean[i]);
    //   }

    //   await getData(memorizedId);

    // })

    // HandleCloseEditPress;
  }

  function HandleEditPress() {
    if (!coffee) return null;

    let valueBeanArray: number[] = [];

    coffee.beans_id.split(",").map((bean) => {
      valueBeanArray.push(parseInt(bean));
    })

    setValueBrand(coffee.brand_id);
    setCoffeeName(coffee.name);
    setValueBean(valueBeanArray);
    setRoast(coffee.roast);
    setBody(coffee.body);
    setSweetness(coffee.sweetness);
    setBitter(coffee.bitter);
    setAroma(coffee.aroma);
    setComment(coffee.comment);
    setModalState("edit");
  }

  function HandleCloseEditPress() {
    if (!coffee) return null;

    setValueBrand(0);
    setCoffeeName("");
    setValueBean([]);
    setRoast(1);
    setBody(1);
    setSweetness(1);
    setBitter(1);
    setAroma(1);
    setComment("");
    setModalState(null);
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
      <View style={globalStyles.sliderContainer} key={v.name}>
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

  const warning = (
    <Modal animationType='slide' transparent={true}>
      <View style={globalStyles.modalBackdrop}>
        <View style={globalStyles.modalBasic}>
          <Text style={globalStyles.titleText}>コーヒー名の入力、コーヒーブランドとコーヒー豆の選択は必須項目です。</Text>
          <TouchableOpacity style={[globalStyles.smallBtn, { marginTop: 10 }]} onPress={() => setWarningModal(false)}>
            <Text style={globalStyles.smallBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  //重複コードのためどこかでまとめられるかも　end

  const editModal = (
    <Modal animationType='slide'>
      <View style={globalStyles.bigModalView}>
        <TouchableOpacity onPress={HandleCloseEditPress} style={globalStyles.closeModalBtn} >
          <AntDesign name="closesquare" size={28} color={Colors.SECONDARY_LIGHT} />
        </TouchableOpacity>
        <Text style={[globalStyles.titleTextLight, { marginBottom: 10 }]}>コーヒー情報の編集</Text>

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

        <TextInput placeholder='コメントを入力' maxLength={200} numberOfLines={4} multiline={true}
          value={comment} onChangeText={(text) => setComment(text)}
          style={[globalStyles.coffeeNameInput, { height: 100, marginTop: 10 }]} />


        <TouchableOpacity onPress={HandleSavePress} style={[globalStyles.smallBtn, { alignSelf: 'center', marginVertical: 20 }]} >
          <Text style={globalStyles.titleTextLight}>保存する</Text>
        </TouchableOpacity>

        {warningModal && warning}
      </View>
    </Modal>

  );

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

        <View style={coffeeDetailsStyles.countContainer}>
          <Text style={coffeeDetailsStyles.countText}>評価平均 :</Text><Text style={coffeeDetailsStyles.countText}>{averageStars()}</Text>
        </View>
        <View style={coffeeDetailsStyles.countContainer}>
          <Text style={coffeeDetailsStyles.countText}>飲んだ回数 :</Text><Text style={coffeeDetailsStyles.countText}>{count} 回</Text>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={[globalStyles.titleText, { fontSize: 14 }]}>コーヒー豆産地</Text>
          <Text style={globalStyles.titleText}>{coffee?.beans}</Text>
        </View>

        {tasteSliders}

        <Text style={coffeeDetailsStyles.commentText}>{coffee?.comment}</Text>


        <Text style={[globalStyles.titleText, { marginVertical: 7, fontSize: 16 }]}>最新レビュー(5件まで)</Text>
        {pastReviews}

        <View style={coffeeDetailsStyles.buttonContainer}>
          <TouchableOpacity onPress={HandleEditPress}>
            <FontAwesome name="pencil" size={22} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalState("delete")}>
            <FontAwesome name="trash-o" size={22} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>

      </ScrollView>
      {image && cameraModal}
      {modalState === "delete" && deleteModal}
      {modalState === "edit" && editModal}
    </View>
  )
}
