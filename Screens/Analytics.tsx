import { View, Text, ImageBackground } from 'react-native'
import React, { useContext } from 'react'
import { globalStyles } from '../Styles/globalStyles'
import Header from './Header'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import { analyticsStyles } from '../Styles/analyticsStyles';
import { useSQLiteContext } from 'expo-sqlite/next'
import { CoffeeContext } from '../contexts/CoffeeContext'

export default function Analytics({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const { coffees, brands, beans, records } = useContext(CoffeeContext);

  const db = useSQLiteContext();

  const recordsWithEndDate: any[] = records ? records.filter(rc => rc.endDate) : [];
  const recordCount: number = recordsWithEndDate.length;

  let totalGram = 0;

  if (recordsWithEndDate.length > 0) {
    recordsWithEndDate.map((rc) => {
      totalGram += rc.gram;
    })
  }

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require('../assets/texture.jpg')} style={globalStyles.imgBackground}>
        <Header title={'分析'} />
        <View style={analyticsStyles.statsContainer}>
          <View style={analyticsStyles.statsSubContainer}>
            <Text style={analyticsStyles.statsText}>図鑑コーヒー数: </Text>
            <Text style={analyticsStyles.statsText}>{coffees ? coffees.length : 0}</Text>
          </View>
          <View style={analyticsStyles.statsSubContainer}>
            <Text style={analyticsStyles.statsText}>コーヒー豆数: </Text>
            <Text style={analyticsStyles.statsText}>{beans ? beans.length : 0}</Text>
          </View>
          <View style={analyticsStyles.statsSubContainer}>
            <Text style={analyticsStyles.statsText}>コーヒーブランド数: </Text>
            <Text style={analyticsStyles.statsText}>{brands ? brands.length : 0}</Text>
          </View>
          <View style={analyticsStyles.statsSubContainer}>
            <Text style={analyticsStyles.statsText}>コーヒーを飲んだ回数: </Text>
            <Text style={analyticsStyles.statsText}>{recordCount}</Text>
          </View>

          <View style={analyticsStyles.statsGramContainer}>
            <Text style={analyticsStyles.statsText}>飲んだコーヒー総グラム: </Text>
            <Text style={[analyticsStyles.statsText, { textAlign: 'right' }]}>{totalGram.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}g</Text>
          </View>

        </View>
      </ImageBackground>
    </View>
  )
}
