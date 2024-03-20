export type RootStackParamList = {
  Home: undefined;
  MyZukan: undefined;
  History: undefined;
  Analytics: undefined;
  Test: undefined;
}


export type User = {
  id:number;
  name:string;
  userEmail:string;
}

export type Coffee = {
  id: number;
  name: string;
  photo: string;
  favorite: boolean;
  drinkCount: number;
  comment: string;
  roast: number;
  body: number;
  sweetness: number;
  fruity: number;
  bitter: number;
  aroma: number;
  brand: string;
  beans: CoffeeBean[];
  // brands: CoffeeBrand;
  // CoffeeBeans: CoffeeBean[];
}

export type CoffeeBrand = {
  id: number;
  name:string;
}

export type CoffeeBean = {
  id: number;
  name: string;
}

export type Record = {
  id: number;
  startDate: number;
  endDate: number;
  gram: number;
  cost: number;
  grindSize: number;
  coffeeId: number;
}

export type Review = {
  id: number;
  rating: number;
  comment: string;
  date: number;
  recordId: number;
}
