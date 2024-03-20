import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const coffeeIndexStyles = StyleSheet.create({
  searchInput:{
    height:40,
    width:'80%',
    padding:3,
    borderRadius:5,
    borderWidth:1,
    borderColor:Colors.SECONDARY,
    margin:10,
    alignSelf:'center',
  },

  addBtn:{
    position:'absolute',
    bottom:10,
    right:10,
  }

})
