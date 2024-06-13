import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { footerStyles } from '../Styles/footerStyles'
import { useNavigationState } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';


export default function Footer({ navigation }: BottomTabBarProps) {

  function HandleHomePress() {
    navigation.navigate('Home');
  }

  function HandleMyZukanPress() {
    navigation.navigate('MyZukan');
  }

  function HandleHistoryPress() {
    navigation.navigate('History');
  }

  function HandleAnalyticsPress() {
    navigation.navigate('Analytics');
  }

  function HandleSettingsPress() {
    navigation.navigate('Settings');
  }

  function HandleTestPress() {
    navigation.navigate('Test');
  }


  return (
    <View style={footerStyles.footerContainer}>
      <View style={footerStyles.iconContainer}>
        <TouchableOpacity onPress={HandleHomePress}>
          <Image source={require('../assets/cup.png')} style={footerStyles.iconImg} />
          <Text style={footerStyles.title}>ホーム</Text>
        </TouchableOpacity>
      </View>

      <View style={footerStyles.iconContainer}>
        <TouchableOpacity onPress={HandleMyZukanPress}>
          <Image source={require('../assets/Bean_light.png')} style={footerStyles.iconImg} />
          <Text style={footerStyles.title}>My図鑑</Text>
        </TouchableOpacity>
      </View>

      <View style={footerStyles.iconContainer}>
        <TouchableOpacity onPress={HandleHistoryPress}>
          <Image source={require('../assets/books.png')} style={footerStyles.iconImg} />
          <Text style={footerStyles.title}>履歴</Text>
        </TouchableOpacity>
      </View>

      <View style={footerStyles.iconContainer}>
        <TouchableOpacity onPress={HandleAnalyticsPress}>
          <Image source={require('../assets/analisys.png')} style={footerStyles.iconImg} />
          <Text style={footerStyles.title}>分析</Text>
        </TouchableOpacity>
      </View>

      <View style={footerStyles.iconContainer}>
        <TouchableOpacity onPress={HandleSettingsPress}>
          <Image source={require('../assets/setting.png')} style={footerStyles.iconImg} />
          <Text style={footerStyles.title}>設定</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={footerStyles.iconContainer}>
        <TouchableOpacity onPress={HandleTestPress}>
          <Image source={require('../assets/analisys.png')} style={footerStyles.iconImg} />
          <Text style={footerStyles.title}>テスト用</Text>
        </TouchableOpacity>
      </View> */}

    </View>
  )
}
