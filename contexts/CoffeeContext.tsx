import { View, Text } from 'react-native'
import React, { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee, CoffeeBean, CoffeeBrand, Record, Review } from '../types';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';


type CoffeeContextValue = {
  coffees: Coffee[] | null;
  setCoffees: Dispatch<SetStateAction<Coffee[] | null>>;
  brands: CoffeeBrand[] | null;
  setBrands: Dispatch<SetStateAction<CoffeeBrand[] | null>>;
  beans: CoffeeBean[] | null;
  setBeans: Dispatch<SetStateAction<CoffeeBean[] | null>>;
  records: Record[] | null;
  setRecords: Dispatch<SetStateAction<Record[] | null>>;
  reviews: Review[] | null;
  setReviews: Dispatch<SetStateAction<Review[] | null>>;
}

const defaultContextValue: CoffeeContextValue = {
  coffees: null,
  setCoffees: () => { },
  brands: null,
  setBrands: () => { },
  beans: null,
  setBeans: () => { },
  records: null,
  setRecords: () => { },
  reviews: null,
  setReviews: () => { }

}

export const CoffeeContext = createContext<CoffeeContextValue>(defaultContextValue);

export const CoffeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coffees, setCoffees] = useState<Coffee[] | null>([]);
  const [brands, setBrands] = useState<CoffeeBrand[] | null>([]);
  const [beans, setBeans] = useState<CoffeeBean[] | null>([]);
  const [records, setRecords] = useState<Record[] | null>([]);
  const [reviews, setReviews] = useState<Review[] | null>([]);

  // const db = SQLite.openDatabase('MyCoffeeJourney.db');
  const db = useSQLiteContext();

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []),
  );

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
    ;`).then((rsp) => {
      // console.log("rsp", rsp);
      setCoffees(() => {
        return rsp;
      })

    }).catch((error) => {
      console.log("reading coffee error!");
      console.log(error.message);
    });

    db.getAllAsync<CoffeeBrand>(`
      SELECT * FROM coffeeBrand;`).then((rsp) => {
      // console.log("rsp", rsp);
      // setBrands(rsp);
      setBrands(() => {
        return rsp;
      })
    }).catch((error) => {
      console.log("reading coffee brand error!");
      console.log(error.message);
    });

    db.getAllAsync<CoffeeBean>(`
      SELECT * FROM coffeeBean;`).then((rsp) => {
      // console.log("rsp", rsp);
      // setBeans(rsp);
      setBeans(() => {
        return rsp;
      })
    }).catch((error) => {
      console.log("reading coffee bean error!");
      console.log(error.message);
    });

    db.getAllAsync<Record>(`
      SELECT record.*, coffee.name AS coffeeName, coffeeBrand.name AS brandName, review.rating AS rating, review.comment AS comment, coffee.id AS coffeeId, review.id AS reviewId
      FROM record
      JOIN coffee ON coffee.id = record.coffee_id
      JOIN coffeeBrand ON coffeeBrand.id = coffee.brand_id
      JOIN review ON review.record_id = record.id
      ORDER BY record.endDate DESC;
      `).then((rsp) => {
      // console.log(rsp);
      // setRecords(rsp);
      setRecords(() => {
        return rsp;
      })
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
      console.log("reviews", rsp);
      // setReviews(rsp);
      setReviews(() => {
        return rsp;
      })
    }).catch((error) => {
      console.log("reviews error!");
      console.log(error.message);
    })
  }


  const value: CoffeeContextValue = { coffees, setCoffees, brands, setBrands, beans, setBeans, records, setRecords, reviews, setReviews };
  return <CoffeeContext.Provider value={value}>{children}</CoffeeContext.Provider>;
}
