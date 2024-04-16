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
  }
})
