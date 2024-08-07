import { ImageBackground, StyleSheet } from 'react-native';
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
    borderColor:Colors.SECONDARY_LIGHT,
    borderWidth:12,
  },

  closeModalBtn:{
    position:'absolute',
    top:17,
    right:17,
  },

  titleText:{
    textAlign:'center',
    fontFamily:'yusei',
    fontSize:18,
  },

  titleTextLight:{
    fontFamily:'yusei',
    fontSize:22,
    textAlign:'center',
    color:Colors.SECONDARY_LIGHT,
  },

  textLight:{
    fontFamily:'yusei',
    fontSize:16,
    color:Colors.SECONDARY_LIGHT,
  },

  btnText:{
    fontSize:20,
    fontFamily:'yusei',
    color:Colors.PRIMARY_LIGHT,
    textAlign:'center',
  },

  smallBtn:{
    backgroundColor:Colors.SECONDARY,
    borderRadius:10,
    paddingHorizontal:7,
    paddingVertical:6,
  },

  smallBtnText:{
    textAlign:'center',
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
    textAlign:'center',
    fontFamily:'yusei',
    fontSize:14,
    color:Colors.PRIMARY,
  },

  sliderContainer:{
    display:'flex',
    flexDirection:'row',
    gap:10,
    justifyContent:'space-between',
    paddingHorizontal:20,
    alignItems:'center',
  },

  imgBackground:{
    width: '100%',
    height: '100%',
  },

  editIcon:{
    position:'absolute',
    top:10,
    right:10,
   },

   numberInput:{
    backgroundColor:Colors.SECONDARY_LIGHT,
    padding:5,
    paddingHorizontal:10,
    borderRadius:5,
    fontFamily:'yusei',
    width:'40%',
  },

  commentInput:{
    fontFamily:'yusei',
    backgroundColor:Colors.SECONDARY_LIGHT,
    borderRadius:5,
    width:'85%',
    height:150,
    alignSelf:'center',
    padding:10,
    marginVertical:15,
    zIndex:1,
   },

   inputContainerRecord:{
    display:'flex',
    flexDirection:'row',
    gap:10,
    justifyContent:'space-between',
    paddingVertical:10,
    paddingHorizontal:20,
    alignItems:'center',
  },

  coffeeNameInput:{
    backgroundColor:Colors.SECONDARY_LIGHT,
    borderRadius:10,
    padding:8,
    fontFamily:'yusei',
    width:'85%',
    alignSelf:'center',
  },



})
