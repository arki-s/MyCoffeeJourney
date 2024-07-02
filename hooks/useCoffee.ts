import React, { useContext } from 'react'
import { CoffeeContext } from '../contexts/CoffeeContext'

export default function useCoffee() {
  const {coffees, setCoffees, brands, setBrands, beans, setBeans } = useContext(CoffeeContext);

  return {
    coffees, setCoffees, brands, setBrands, beans, setBeans
  };
}
