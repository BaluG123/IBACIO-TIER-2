import React, {useCallback, useState} from 'react';
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
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useAppDrawer} from '../navigation/DrawerNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {getMockHistory, MockSelfScore} from '../utils/storage';

type MockPaper = {
  id: string;
  title: string;
  title_hi?: string;
  durationMinutes: number;
  totalMarks: number;
  essayTopicId: string;
  comprehensionId: string;
  longAnswerIds: string[];
  instructions: string[];
};

const data = require('../assets/mocks/papers.json');
const MOCKS: MockPaper[] = data.mocks || [];

export default function DescriptiveMocksScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const {openDrawer} = useAppDrawer();
  const insets = useSafeAreaInsets();
  const [history, setHistory] = useState<MockSelfScore[]>([]);

  useFocusEffect(
    useCallback(() => {
      getMockHistory().then(setHistory);
    }, []),
  );

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
          onPress={() => openDrawer()}>
          <Icon name="menu" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>{t('mock_tests')}</Text>
          <Text style={styles.headerSub}>{t('full_mock_count')}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('3%'),
        }}>
        {MOCKS.map((mock, idx) => (
          <View key={mock.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>#{idx + 1}</Text>
              </View>
              <Text style={styles.title}>
                {i18n.language === 'hi' && mock.title_hi
                  ? mock.title_hi
                  : mock.title}
              </Text>
            </View>
            <Text style={styles.meta}>
              {mock.durationMinutes} min · {mock.totalMarks} {t('marks')} · Essay
              + RC + 2 LAQs
            </Text>
            {(mock.instructions || []).slice(0, 2).map((ins, i) => (
              <Text key={i} style={styles.ins}>
                • {ins}
              </Text>
            ))}
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() =>
                navigation.navigate('MockDescriptive', {mockId: mock.id})
              }>
              <Icon name="play" size={wp('5%')} color="#fff" />
              <Text style={styles.startText}>{t('start_mock')}</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.section}>{t('mock_history')}</Text>
        {history.length === 0 ? (
          <Text style={styles.empty}>{t('no_history')}</Text>
        ) : (
          history.map(h => (
            <View key={h.id} style={styles.histCard}>
              <Text style={styles.histTitle}>
                {h.mockId} · {h.total}/50
              </Text>
              <Text style={styles.histMeta}>
                Essay {h.essay}/20 · RC {h.rc}/10 · LAQ {h.laq}/20
              </Text>
            </View>
          ))
        )}
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
  menuBtn: {
    padding: wp('2%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
  },
  headerTitle: {fontSize: wp('5%'), fontWeight: '800', color: '#fff'},
  headerSub: {fontSize: wp('3%'), color: '#9ca3af', marginTop: hp('0.2%')},
  card: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.8%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  cardTop: {flexDirection: 'row', alignItems: 'center', gap: wp('3%')},
  badge: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
  },
  badgeText: {color: '#60a5fa', fontWeight: '800', fontSize: wp('3.2%')},
  title: {
    flex: 1,
    color: '#fff',
    fontSize: wp('4.2%'),
    fontWeight: '800',
  },
  meta: {
    color: '#9ca3af',
    fontSize: wp('3.2%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  ins: {
    color: '#e5e7eb',
    fontSize: wp('3.3%'),
    marginBottom: hp('0.4%'),
    lineHeight: wp('4.8%'),
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
    backgroundColor: '#3b82f6',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2.5%'),
    marginTop: hp('1.5%'),
  },
  startText: {color: '#fff', fontWeight: '800', fontSize: wp('3.8%')},
  section: {
    color: '#9ca3af',
    fontWeight: '700',
    fontSize: wp('3.5%'),
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {color: '#6b7280', fontSize: wp('3.4%'), lineHeight: wp('5%')},
  histCard: {
    backgroundColor: '#111827',
    borderRadius: wp('2.5%'),
    padding: wp('3.5%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  histTitle: {color: '#fff', fontWeight: '700', fontSize: wp('3.8%')},
  histMeta: {color: '#9ca3af', fontSize: wp('3.2%'), marginTop: hp('0.4%')},
});
