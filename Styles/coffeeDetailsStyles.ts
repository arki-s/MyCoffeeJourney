import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const coffeeDetailsStyles = StyleSheet.create({
  coffeeImg:{
    borderRadius:99,
    backgroundColor:Colors.PRIMARY,
    height:150,
    width:150,
    objectFit:'contain',
    borderWidth:5,
    borderColor:Colors.SECONDARY,
    alignSelf:'center',
    marginVertical:10,
  },

  coffeeTitleText:{
    fontFamily:'yusei',
    color:Colors.PRIMARY,
    textAlign:'center',
    fontSize:24,
  },

  cameraIcon:{
    position:'absolute',
    bottom:10,
    right:120,
  },

  imageContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',
    gap:25,
  },

  countContainer:{
    paddingHorizontal:"20%",
    flexDirection:'row',
    justifyContent:'space-between',
  },

  countText:{
    fontFamily:'yusei',
    fontSize:18,
  },

  reviewText:{
    textAlign:'center',
    fontFamily:'yusei',
    fontSize:16,
  },

  smallStar:{
    paddingTop:4,
    fontFamily:'yusei',
    fontSize:12,
  },

  reviewContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    gap:10,
  },

  commentText:{
    fontFamily:'yusei',
    fontSize:18,
    marginVertical: 7,
    marginHorizontal: 20
   },

   buttonContainer:{
    marginVertical:15,
    marginRight:15,
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-end',
    gap:10
   }



})
