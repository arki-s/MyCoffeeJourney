import { View, Text, Image } from 'react-native'
import React from 'react'
import { globalStyles } from '../Styles/globalStyles'
import headerStyles from '../Styles/headerStyles'

export default function Header({ title }: { title: string }) {
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.contentContainer}>
        <Image source={require('../assets/cup.png')} style={headerStyles.headerImg} />
        <Text style={headerStyles.textTitle}>My Coffee Journey</Text>
      </View>
      <Text style={headerStyles.text}>{title}</Text>
    </View>
  )
}
