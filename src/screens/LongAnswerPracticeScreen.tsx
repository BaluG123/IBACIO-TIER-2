import React, {useMemo, useState} from 'react';
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
import {getDomainColor} from '../services/dailyPromptService';

type LAQ = {
  id: string;
  domain: string;
  question: string;
  keyPoints: string[];
  modelAnswer: string;
  wordTargetMin: number;
  wordTargetMax: number;
  suggestedMinutes: number;
  marks: number;
};

const data = require('../assets/long-answers/questions.json');
const QUESTIONS: LAQ[] = data.questions || [];

export default function LongAnswerPracticeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [domain, setDomain] = useState('All');
  const [pair, setPair] = useState<LAQ[] | null>(null);

  const domains = useMemo(() => {
    const set = new Set(QUESTIONS.map(q => q.domain));
    return ['All', ...Array.from(set)];
  }, []);

  const filtered = QUESTIONS.filter(
    q => domain === 'All' || q.domain === domain,
  );

  const pickTodaysPair = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setPair(shuffled.slice(0, 2));
  };

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
          <Text style={styles.headerTitle}>{t('long_answers')}</Text>
          <Text style={styles.headerSub}>{QUESTIONS.length}+ questions</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.pairBtn} onPress={pickTodaysPair}>
        <Icon name="shuffle-variant" size={wp('6%')} color="#fff" />
        <View style={{flex: 1}}>
          <Text style={styles.pairTitle}>{t('todays_pair')}</Text>
          <Text style={styles.pairDesc}>{t('todays_pair_desc')}</Text>
        </View>
      </TouchableOpacity>

      {pair && (
        <View style={styles.pairBox}>
          {pair.map(q => (
            <TouchableOpacity
              key={q.id}
              style={[
                styles.card,
                {borderLeftColor: getDomainColor(q.domain)},
              ]}
              onPress={() =>
                navigation.navigate('LongAnswerDetail', {questionId: q.id})
              }>
              <Text style={styles.domain}>{q.domain}</Text>
              <Text style={styles.q}>{q.question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}>
          {domains.map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.chip, domain === d && styles.chipActive]}
              onPress={() => setDomain(d)}
              activeOpacity={0.85}>
              <Text
                style={[
                  styles.chipText,
                  domain === d && styles.chipTextActive,
                ]}
                numberOfLines={1}>
                {d === 'All' ? t('domain') : d}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('3%'),
        }}>
        {filtered.map(q => (
          <TouchableOpacity
            key={q.id}
            style={[styles.card, {borderLeftColor: getDomainColor(q.domain)}]}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('LongAnswerDetail', {questionId: q.id})
            }>
            <View style={styles.row}>
              <Text style={[styles.domain, {color: getDomainColor(q.domain)}]}>
                {q.domain}
              </Text>
              <Text style={styles.marks}>
                {q.marks} {t('marks')}
              </Text>
            </View>
            <Text style={styles.q}>{q.question}</Text>
            <Text style={styles.meta}>
              {q.wordTargetMin}–{q.wordTargetMax} words · {q.suggestedMinutes}{' '}
              min
            </Text>
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
    gap: wp('3%'),
  },
  backBtn: {
    padding: wp('2%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
  },
  headerTitle: {fontSize: wp('5%'), fontWeight: '800', color: '#fff'},
  headerSub: {fontSize: wp('3%'), color: '#9ca3af', marginTop: hp('0.2%')},
  pairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    margin: wp('4%'),
    marginBottom: hp('1%'),
    backgroundColor: '#5b21b6',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  pairTitle: {color: '#fff', fontWeight: '800', fontSize: wp('4%')},
  pairDesc: {color: '#ddd6fe', fontSize: wp('3.1%'), marginTop: hp('0.3%')},
  pairBox: {paddingHorizontal: wp('4%')},
  filterBar: {
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    paddingVertical: hp('1.2%'),
    marginBottom: hp('0.5%'),
  },
  chipsRow: {
    paddingHorizontal: wp('4%'),
    gap: wp('2.5%'),
    alignItems: 'center',
    paddingRight: wp('6%'),
  },
  chip: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.1%'),
    borderRadius: wp('5%'),
    backgroundColor: '#0b1220',
    borderWidth: 1.5,
    borderColor: '#374151',
    minHeight: hp('4.5%'),
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#a78bfa',
  },
  chipText: {
    color: '#e5e7eb',
    fontSize: wp('3.4%'),
    fontWeight: '700',
  },
  chipTextActive: {color: '#fff'},
  card: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.2%'),
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.5%'),
  },
  domain: {color: '#a78bfa', fontSize: wp('3%'), fontWeight: '700'},
  marks: {color: '#9ca3af', fontSize: wp('3%')},
  q: {
    color: '#fff',
    fontSize: wp('3.9%'),
    fontWeight: '700',
    lineHeight: wp('5.5%'),
  },
  meta: {color: '#9ca3af', fontSize: wp('3.1%'), marginTop: hp('0.8%')},
});
