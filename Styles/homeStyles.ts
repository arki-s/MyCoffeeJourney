import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const homeStyles = StyleSheet.create({
  numberInput:{
    backgroundColor:Colors.SECONDARY_LIGHT,
    padding:5,
    paddingHorizontal:10,
    borderRadius:5,
    fontFamily:'yusei',
    width:'40%',
  },

  inputContainer:{
    display:'flex',
    flexDirection:'row',
    gap:10,
    justifyContent:'space-between',
    padding:20,
  },

  recordBtn:{
    borderRadius:10,
    width:'80%',
    height:40,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:Colors.SECONDARY_LIGHT,
    borderWidth:4,
    borderColor:Colors.SECONDARY,
    marginVertical:10,
    alignSelf:'center',
  },

  btnText:{
    fontSize:20,
    fontFamily:'yusei',
    color:Colors.PRIMARY_LIGHT,
    textAlign:'center',
  },
})
