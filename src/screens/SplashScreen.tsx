import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

export default function SplashScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Animated.View
        style={[
          styles.centerContent,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/homlogo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.brand}>IB ACIO</Text>
          <Text style={styles.fullForm}>{t('splash_full_form')}</Text>
          <Text style={styles.tagline}>{t('splash_tagline')}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('8%'),
  },
  logoContainer: {
    marginBottom: hp('4%'),
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: wp('8%'),
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3b82f640',
    shadowColor: '#3b82f6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoImage: {
    width: wp('28%'),
    height: wp('28%'),
    borderRadius: wp('2%'),
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: hp('5%'),
  },
  brand: {
    fontSize: wp('10%'),
    fontWeight: '900',
    color: '#fff',
    marginBottom: hp('1.5%'),
    textAlign: 'center',
    letterSpacing: 2,
  },
  fullForm: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: hp('3%'),
    marginBottom: hp('2%'),
  },
  tagline: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#60a5fa',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
