import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const coffeeDetailsStyles = StyleSheet.create({
  coffeeImg:{
    borderRadius:99,
    backgroundColor:Colors.PRIMARY,
    height:150,
    width:150,
    objectFit:'contain',
    borderWidth:5,
    borderColor:Colors.SECONDARY,
    alignSelf:'center',
    marginVertical:10,
  },

  coffeeTitleText:{
    fontFamily:'yusei',
    color:Colors.PRIMARY,
    textAlign:'center',
    fontSize:24,
  },

  cameraIcon:{
    position:'absolute',
    bottom:10,
    right:120,
  },

  imageContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    gap:25,
  },


})
