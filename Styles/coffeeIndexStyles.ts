import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const coffeeIndexStyles = StyleSheet.create({
  searchInput:{
    height:40,
    width:'80%',
    padding:3,
    borderRadius:5,
    borderWidth:3,
    borderColor:Colors.SECONDARY,
    margin:15,
    alignSelf:'center',
    fontFamily:'yusei',
    backgroundColor:Colors.SECONDARY_LIGHT,
  },

  addBtn:{
    position:'absolute',
    bottom:10,
    right:10,
    backgroundColor:Colors.SECONDARY_LIGHT,
    borderRadius:99,
  },

  coffeeContainer:{
    width:'90%',
    height:64,
    padding:5,
    borderRadius:10,
    backgroundColor:Colors.PRIMARY,
    borderWidth:3,
    borderColor:Colors.SECONDARY_LIGHT,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10,
    alignSelf:'center',
  },

  brandText:{
    fontFamily:'yusei',
    textAlign:'center',
    fontSize:14,
    color:Colors.SECONDARY_LIGHT,
   },

  coffeeText:{
   fontFamily:'yusei',
   textAlign:'center',
   fontSize:20,
   color:Colors.SECONDARY_LIGHT,
  },

  sliderContainer:{
    display:'flex',
    flexDirection:'row',
    gap:10,
    justifyContent:'space-between',
    paddingHorizontal:20,
    alignItems:'center',
  },



})
