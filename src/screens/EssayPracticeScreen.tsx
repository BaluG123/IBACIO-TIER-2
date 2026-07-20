import React, {useMemo, useState, useCallback} from 'react';
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
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {getEssayProgress} from '../utils/storage';

type EssayTopic = {
  id: string;
  category: string;
  title: string;
  difficulty: string;
  hints: string[];
  outline: string;
  wordTargetMin: number;
  wordTargetMax: number;
  suggestedMinutes: number;
  structure?: string[];
};

const topicsData = require('../assets/essays/topics.json');
const ALL_TOPICS: EssayTopic[] = topicsData.topics || [];

function unlockedCount(completed: number) {
  return 10 + Math.floor(completed / 3) * 5;
}

export default function EssayPracticeScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<string>('All');
  const [progress, setProgress] = useState<Record<string, {completed: boolean}>>(
    {},
  );

  const loadProgress = useCallback(async () => {
    const p = await getEssayProgress();
    setProgress(p);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress]),
  );

  const categories = useMemo(() => {
    const set = new Set(ALL_TOPICS.map(tpc => tpc.category));
    return ['All', ...Array.from(set)];
  }, []);

  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const unlockLimit = unlockedCount(completedCount);

  const filtered = ALL_TOPICS.filter(
    tpc => category === 'All' || tpc.category === category,
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
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>{t('essay_writing')}</Text>
          <Text style={styles.headerSub}>
            {completedCount} done · {unlockLimit} unlocked · {t('unlock_hint')}
          </Text>
        </View>
      </View>

      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipActive]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.85}>
              <Text
                style={[
                  styles.chipText,
                  category === cat && styles.chipTextActive,
                ]}
                numberOfLines={1}>
                {cat === 'All' ? t('categories') : cat}
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
        {filtered.map(topic => {
          const globalIndex = ALL_TOPICS.findIndex(x => x.id === topic.id);
          const locked = globalIndex >= unlockLimit;
          const done = !!progress[topic.id]?.completed;

          return (
            <TouchableOpacity
              key={topic.id}
              style={[
                styles.card,
                locked && styles.cardLocked,
                {borderLeftColor: done ? '#10b981' : '#38bdf8'},
              ]}
              disabled={locked}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('EssayTopic', {topicId: topic.id})
              }>
              <View style={styles.cardTop}>
                <Text style={styles.cat}>{topic.category}</Text>
                {done ? (
                  <Icon name="check-circle" size={wp('5%')} color="#10b981" />
                ) : locked ? (
                  <Icon name="lock" size={wp('5%')} color="#6b7280" />
                ) : (
                  <Text style={styles.diff}>{topic.difficulty}</Text>
                )}
              </View>
              <Text style={styles.title}>{topic.title}</Text>
              <Text style={styles.meta}>
                {topic.wordTargetMin}–{topic.wordTargetMax} {t('word_count')} ·{' '}
                {topic.suggestedMinutes} min
              </Text>
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
  headerSub: {
    fontSize: wp('3%'),
    color: '#9ca3af',
    marginTop: hp('0.3%'),
  },
  filterBar: {
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    paddingVertical: hp('1.2%'),
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
    backgroundColor: '#2563eb',
    borderColor: '#60a5fa',
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
  cardLocked: {opacity: 0.55},
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('0.6%'),
  },
  cat: {color: '#38bdf8', fontSize: wp('3%'), fontWeight: '700'},
  diff: {color: '#fbbf24', fontSize: wp('3%'), fontWeight: '600'},
  title: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '700',
    lineHeight: wp('5.5%'),
  },
  meta: {color: '#9ca3af', fontSize: wp('3.2%'), marginTop: hp('0.8%')},
});
