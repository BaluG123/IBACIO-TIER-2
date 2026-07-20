import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {getLocalized} from '../utils/localize';

type Passage = {
  id: string;
  title: string;
  theme?: string;
  passage: string;
  questions: Array<{id: string; q: string; model: string}>;
  suggestedMinutes?: number;
};

const data = require('../assets/comprehension/passages.json');
const PASSAGES: Passage[] = data.passages || [];

export default function ComprehensionPracticeScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const lang = i18n.language;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={[styles.header, {paddingTop: insets.top + hp('1%')}]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>{t('comprehension')}</Text>
          <Text style={styles.headerSub}>
            {t('passages_meta', {count: PASSAGES.length})}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('3%'),
        }}>
        {PASSAGES.map(p => {
          const theme =
            getLocalized<string>(p, 'theme', lang) || t('comprehension');
          const title = getLocalized<string>(p, 'title', lang);
          const qs = (p.questions || []).length;
          const min = p.suggestedMinutes || 12;

          return (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('PassageDetail', {passageId: p.id})
              }>
              <View style={styles.iconWrap}>
                <Icon
                  name="book-open-page-variant"
                  size={wp('7%')}
                  color="#f472b6"
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.theme}>{theme}</Text>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.meta}>
                  {t('qs_min_meta', {qs, min})}
                </Text>
              </View>
              <Icon name="chevron-right" size={wp('5.5%')} color="#6b7280" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0b1220'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('1.5%'),
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    gap: wp('3%'),
  },
  backBtn: {
    padding: wp('2%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
  },
  headerTitle: {fontSize: wp('5%'), fontWeight: '800', color: '#fff'},
  headerSub: {fontSize: wp('3%'), color: '#9ca3af', marginTop: hp('0.2%')},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.2%'),
    borderLeftWidth: 4,
    borderLeftColor: '#f472b6',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  iconWrap: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    backgroundColor: '#f472b620',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  theme: {color: '#f472b6', fontSize: wp('3%'), fontWeight: '700'},
  title: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '700',
    marginTop: hp('0.3%'),
  },
  meta: {color: '#9ca3af', fontSize: wp('3.2%'), marginTop: hp('0.5%')},
});
