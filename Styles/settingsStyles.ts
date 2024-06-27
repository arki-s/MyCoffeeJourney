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
    marginVertical:15,
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
    padding:20,
  },

  closeBtn:{
    position:'absolute',
    top:10,
    right:10,
  },

  newAddContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    gap:5,
    alignItems:'center',
  },

  newAddInput:{
    borderRadius:10,
    borderWidth:2,
    borderColor:Colors.SECONDARY,
    padding:5,
    marginVertical:10,
    width:'80%',
    backgroundColor:Colors.WHITE,
    fontFamily:'yusei',
  },

  listText:{
    fontFamily:'yusei',
    fontSize:14,
    color:Colors.PRIMARY,
  },

  brandBeansList:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    alignItems:'center',
    borderRadius:10,
    borderWidth:2,
    borderColor:Colors.SECONDARY,
    paddingHorizontal:7,
    paddingVertical:5,
    marginBottom:5,
    backgroundColor:Colors.WHITE,
  },

})
