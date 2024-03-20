import { StyleSheet } from "react-native";
import Colors from "./Colors";


export default StyleSheet.create({
  container:{
    width:'100%',
    height:'17%',
    backgroundColor:Colors.PRIMARY,
    justifyContent:'center',
  },

  contentContainer:{
    marginTop:25,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    gap:13,
    alignItems:'center',
  },

  headerImg:{
    height:50,
    width:50,
    objectFit:'contain',
  },

  textTitle:{
    fontSize:28,
    fontFamily:'yusei',
    color:Colors.SECONDARY_LIGHT,
  },

  text:{
    fontSize:20,
    fontFamily:'yusei',
    color:Colors.SECONDARY_LIGHT,
    textAlign:'center',
  },

})
