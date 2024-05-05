import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const recordIndexStyles = StyleSheet.create({
  recordContainer:{
    width:'90%',
    padding:10,
    borderRadius:10,
    backgroundColor:Colors.PRIMARY,
    borderWidth:3,
    borderColor:Colors.SECONDARY_LIGHT,
    justifyContent:'center',
    marginBottom:10,
    alignSelf:'center',
  },

  recordText:{
    color:Colors.SECONDARY_LIGHT,
    fontFamily:'yusei',
    fontSize:18,
  },

  recordTextSmall:{
    color:Colors.SECONDARY_LIGHT,
    fontFamily:'yusei',
    fontSize:14,
  }


})
