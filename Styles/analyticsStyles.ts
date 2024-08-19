import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const analyticsStyles = StyleSheet.create({
  statsContainer : {
    width:'90%',
    // paddingVertical:10,
    paddingHorizontal:14,
    borderRadius:10,
    backgroundColor:Colors.PRIMARY,
    borderWidth:3,
    borderColor:Colors.SECONDARY_LIGHT,
    // alignItems:'center',
    // justifyContent:'center',
    marginTop:15,
    alignSelf:'center',
  },

  statsSubContainer:{
    paddingVertical:10,
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
  },

  statsGramContainer:{
    paddingVertical:10
  },

  statsText:{
    fontFamily:'yusei',
    fontSize:22,
    color:Colors.SECONDARY_LIGHT,
  },


})
