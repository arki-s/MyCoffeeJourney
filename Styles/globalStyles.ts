import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const globalStyles = StyleSheet.create({
  container:{
    flex:1,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(0, 0, 0, 0.7)',
  },

  modalBasic:{
    borderRadius:10,
    width:'90%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:Colors.SECONDARY_LIGHT,
    borderWidth:4,
    borderColor:Colors.SECONDARY,
    padding:20,
  },

  bigModalView:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor:Colors.PRIMARY,
  },

  titleText:{
    textAlign:'center',
    fontFamily:'yusei',
    fontSize:18,
  },

  smallBtn:{
    backgroundColor:Colors.SECONDARY,
    borderRadius:10,
    paddingHorizontal:7,
    paddingVertical:6,
  },

  smallBtnText:{
    fontFamily:'yusei',
    fontSize:14,
    color:Colors.SECONDARY_LIGHT,
  },

  smallCancelBtn:{
    backgroundColor:Colors.SECONDARY_LIGHT,
    borderRadius:10,
    paddingHorizontal:7,
    paddingVertical:6,
    borderWidth :1,
    borderColor:Colors.PRIMARY,
  },

  smallCancelBtnText:{
    fontFamily:'yusei',
    fontSize:14,
    color:Colors.PRIMARY,
  },





})
