import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const footerStyles = StyleSheet.create({
  footerContainer:{
    width:"100%",
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    backgroundColor:Colors.PRIMARY_LIGHT,
    paddingTop:10,
  },
  title:{
    marginTop:3,
    color:Colors.SECONDARY_LIGHT,
    fontSize:10,
  },
  iconImg:{
    height:25,
    width:25,
    objectFit:'contain',
  },
  iconContainer:{
    width:'20%',
    alignItems:'center',
    marginBottom:15,
  },
})
