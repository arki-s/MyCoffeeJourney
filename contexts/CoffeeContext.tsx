import { View, Text } from 'react-native'
import React, { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee, CoffeeBean, CoffeeBrand, Record, Review } from '../types';
import * as SQLite from 'expo-sqlite';


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

const CoffeeContext = createContext<CoffeeContextValue>(defaultContextValue);

export const CoffeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const db = SQLite.openDatabase('MyCoffeeJourney.db');

  // useEffect(() => {

  // }, [])

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


  }




  const value: CoffeeContextValue = { coffees, setCoffees, brands, setBrands, beans, setBeans, records, setRecords, reviews, setReviews };
  return <CoffeeContext.Provider value={value}>{children}</CoffeeContext.Provider>;
}
