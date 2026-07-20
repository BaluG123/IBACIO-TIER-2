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
import {useAppDrawer} from '../navigation/DrawerNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

const MODULES = [
  {
    key: 'EssayPractice',
    titleKey: 'essay_writing',
    countKey: 'essay_count',
    icon: 'fountain-pen-tip',
    color: '#38bdf8',
  },
  {
    key: 'ComprehensionPractice',
    titleKey: 'comprehension',
    countKey: 'comprehension_count',
    icon: 'book-open-page-variant',
    color: '#f472b6',
  },
  {
    key: 'LongAnswerPractice',
    titleKey: 'long_answers',
    countKey: 'long_answers_count',
    icon: 'text-box-outline',
    color: '#a78bfa',
  },
  {
    key: 'ModelAnswersDrawer',
    titleKey: 'model_answers',
    countKey: 'model_card_count',
    icon: 'lightbulb-on-outline',
    color: '#14b8a6',
  },
] as const;

export default function PracticeHubScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const {openDrawer} = useAppDrawer();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={[styles.header, {paddingTop: insets.top + hp('1%')}]}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => openDrawer()}
          activeOpacity={0.7}>
          <Icon name="menu" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('practice_hub')}</Text>
          <Text style={styles.headerSubtitle}>{t('practice_all')}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('3%'),
        }}>
        {MODULES.map(mod => (
          <TouchableOpacity
            key={mod.key}
            style={[styles.card, {borderLeftColor: mod.color}]}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(mod.key)}>
            <View
              style={[styles.iconWrap, {backgroundColor: mod.color + '20'}]}>
              <Icon name={mod.icon} size={wp('7%')} color={mod.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{t(mod.titleKey)}</Text>
              <Text style={styles.cardSubtitle}>{t(mod.countKey)}</Text>
            </View>
            <Icon name="chevron-right" size={wp('5.5%')} color="#6b7280" />
          </TouchableOpacity>
        ))}
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
  },
  menuBtn: {
    padding: wp('2%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#374151',
  },
  headerCenter: {flex: 1, marginLeft: wp('3%')},
  headerTitle: {fontSize: wp('5%'), fontWeight: '800', color: '#fff'},
  headerSubtitle: {
    fontSize: wp('3.2%'),
    color: '#9ca3af',
    marginTop: hp('0.2%'),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  iconWrap: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  cardContent: {flex: 1},
  cardTitle: {fontSize: wp('4.2%'), fontWeight: '700', color: '#fff'},
  cardSubtitle: {
    fontSize: wp('3.2%'),
    color: '#9ca3af',
    marginTop: hp('0.3%'),
  },
});
