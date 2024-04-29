import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';
import { Coffee, CoffeeBean, CoffeeBrand, Record } from '../types';

type CoffeeContextValue = {

}

const defaultContextValue: CoffeeContextValue = {


}


const CoffeeContext = createContext<CoffeeContextValue>(defaultContextValue);


export const CoffeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [brands, setBrands] = useState<CoffeeBrand[]>([]);
  const [beans, setBeans] = useState<CoffeeBean[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {

  }, [])



  const value: CoffeeContextValue = {};
  return
  <CoffeeContext.Provider value={value}>{children}</CoffeeContext.Provider>;
}
