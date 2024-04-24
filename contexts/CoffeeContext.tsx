import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite/next';

type CoffeeContextValue = {

}

const defaultContextValue: CoffeeContextValue = {


}


const CoffeeContext = createContext<CoffeeContextValue>(defaultContextValue);


export const CoffeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


  const value: CoffeeContextValue = {};
  return
  <CoffeeContext.Provider value={value}>{children}</CoffeeContext.Provider>;
}
