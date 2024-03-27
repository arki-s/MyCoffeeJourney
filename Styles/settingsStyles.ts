import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const settingsStyles = StyleSheet.create({
  contentsContainer:{
    alignItems:'center',
  },

  manageBtn:{
    borderRadius:10,
    width:'90%',
    height:60,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:Colors.SECONDARY_LIGHT,
    borderWidth:4,
    borderColor:Colors.SECONDARY,
    marginVertical:10,
  },

  btnText:{
    fontSize:20,
    fontFamily:'yusei',
    color:Colors.PRIMARY_LIGHT,
    textAlign:'center',
  },

  modalWindow:{
    borderRadius:10,
    width:'90%',
    height:'50%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:Colors.SECONDARY_LIGHT,
    borderWidth:4,
    borderColor:Colors.SECONDARY,



  },




})
