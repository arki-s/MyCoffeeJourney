import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Coffee, CoffeeBean, CoffeeBrand, User } from '../types';
import { useSQLiteContext } from 'expo-sqlite/next';
import { globalStyles } from '../Styles/globalStyles';
import Header from './Header';

export default function DBTest() {
  const [users, setUsers] = useState<User[]>([]);
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);

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
      console.log("rsp", rsp);
      // setCoffees(rsp);
    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

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

  async function insertCoffeedataBasic() {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `
          INSERT INTO coffeeBrand (name) VALUES ("小川珈琲");
          `
      ).catch((error) => {
        console.log("creating 1 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBrand (name) VALUES ("TULLY'S COFFEE");
        `
      ).catch((error) => {
        console.log("creating 2 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBrand (name) VALUES ("AGF");
        `
      ).catch((error) => {
        console.log("creating 3 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBrand (name) VALUES ("KALDI");
        `
      ).catch((error) => {
        console.log("creating 4 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBrand (name) VALUES ("無印良品");
        `
      ).catch((error) => {
        console.log("creating 5 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBean (name) VALUES ("Columbia");
        `
      ).catch((error) => {
        console.log("creating 6 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBean (name) VALUES ("Brazil");
        `
      ).catch((error) => {
        console.log("creating 7 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBean (name) VALUES ("Indonesia");
        `
      ).catch((error) => {
        console.log("creating 8 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBean (name) VALUES ("Ethiopia");
        `
      ).catch((error) => {
        console.log("creating 9 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBean (name) VALUES ("Guatemala");
        `
      ).catch((error) => {
        console.log("creating 10 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBean (name) VALUES ("Peru");
        `
      ).catch((error) => {
        console.log("creating 11 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        INSERT INTO coffeeBean (name) VALUES ("Vietnam");
        `
      ).catch((error) => {
        console.log("creating 12 error!");
        console.log(error.message);
        return;
      });

      console.log("successfully created coffee brand & bean!")

      await getData();
    })
  }

  async function insertCoffee() {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `INSERT INTO coffee (name, roast, body, sweetness, fruity, bitter, aroma, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        ["マイルドカルディ", 2, 3, 3, 3, 3, 2, 3]
      ).catch((error) => {
        console.log("creating coffee1 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
        [1, 1]
      ).catch((error) => {
        console.log("creating inclusion1-1 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
        [1, 2]
      ).catch((error) => {
        console.log("creating inclusion1-2 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `INSERT INTO coffee (name, roast, body, sweetness, fruity, bitter, aroma, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        ["マンデリンフレンチ", 4, 4, 1, 1, 4, 4, 4]
      ).catch((error) => {
        console.log("creating coffee2 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `INSERT INTO inclusion (coffee_id, bean_id) VALUES (?, ?);`,
        [2, 3]
      ).catch((error) => {
        console.log("creating inclusion2-1 error!");
        console.log(error.message);
        return;
      });

      console.log("successfully created 2 sample coffee")

      await getData();
    })
  }

  async function dropTables() {

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        DROP TABLE coffee;
        `,
      ).catch((error) => {
        console.log("drop table1 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        DROP TABLE coffeeBrand;
        `,
      ).catch((error) => {
        console.log("drop table2 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        DROP TABLE coffeeBean;
        `,
      ).catch((error) => {
        console.log("drop table3 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        DROP TABLE inclusion;
        `,
      ).catch((error) => {
        console.log("drop table4 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        DROP TABLE record;
        `,
      ).catch((error) => {
        console.log("drop table5 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        DROP TABLE review;
        `,
      ).catch((error) => {
        console.log("drop table6 error!");
        console.log(error.message);
        return;
      });



      console.log("successfully dropped all table!")

      await getData();
    })
  }

  async function dropCoffeeTables() {

    db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        DROP TABLE coffee;
        `,
      ).catch((error) => {
        console.log("drop table1 error!");
        console.log(error.message);
        return;
      });

      await db.runAsync(
        `
        DROP TABLE inclusion;
        `,
      ).catch((error) => {
        console.log("drop table4 error!");
        console.log(error.message);
        return;
      });

      console.log("successfully dropped coffee and inclusion table!")

      await getData();
    })
  }




  const coffee = coffees.map((c) => {
    return (
      <View>
        <Text>{c.name}</Text>
      </View>
    )
  })

  return (
    <View style={globalStyles.container}>
      <Header title={'テスト用のページ'} />
      {coffee}
      <TouchableOpacity onPress={insertCoffeedataBasic} style={{ padding: 15, backgroundColor: "yellow" }}>
        <Text>CREATE COFFEE BRAND AND BEAN!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={insertCoffee} style={{ padding: 15, backgroundColor: "red" }}>
        <Text>INSERT 2 SAMPLsE COFFEE!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={dropTables} style={{ padding: 15, backgroundColor: "gray" }}>
        <Text>DROP ALL TABLE!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={dropCoffeeTables} style={{ padding: 15, backgroundColor: "gray" }}>
        <Text>DROP COFFEE TABLE!</Text>
      </TouchableOpacity>
    </View>
  )
}
