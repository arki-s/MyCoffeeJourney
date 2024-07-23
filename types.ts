export type RootStackParamList = {
  Home: undefined;
  MyZukan: undefined;
  CoffeeDetails: {id: number | undefined};
  History: undefined;
  Analytics: undefined;
  Settings: undefined;
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
  brand_id: number;
  beans: string;
  reviews: Review[];
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
  endDate: number | null;
  gram: number;
  cost: number;
  grindSize: number;
  coffeeId:number;
  coffeeName: string;
  brandName:string;
  rating:number | null;
  comment:string | null;
  reviewId: number | null;
}

export type Review = {
  coffee_id: number;
  record_id: number;
  rating: number;
  comment: string;
  date: number | null;
}
