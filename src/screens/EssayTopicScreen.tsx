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
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {getLocalized, localizeLabel} from '../utils/localize';

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

const DEFAULT_STRUCTURE = [
  'Introduction (context + thesis)',
  'Body (2–3 analytical paragraphs with facts)',
  'Conclusion (balanced way forward)',
];

export default function EssayTopicScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const [showOutline, setShowOutline] = useState(false);
  const lang = i18n.language;

  const topic = useMemo(
    () => ALL_TOPICS.find(x => x.id === route.params?.topicId),
    [route.params?.topicId],
  );

  if (!topic) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{color: '#fff'}}>{t('topic_not_found')}</Text>
      </View>
    );
  }

  const title = getLocalized<string>(topic, 'title', lang);
  const difficulty = getLocalized<string>(topic, 'difficulty', lang);
  const hints = getLocalized<string[]>(topic, 'hints', lang) || [];
  const structure =
    getLocalized<string[]>(topic, 'structure', lang) || DEFAULT_STRUCTURE;
  const outline = getLocalized<string>(topic, 'outline', lang);

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t('essay_writing')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('4%'),
        }}>
        <Text style={styles.cat}>{localizeLabel(topic.category, lang)}</Text>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Icon name="speedometer" size={wp('4%')} color="#fbbf24" />
            <Text style={styles.metaText}>
              {t('difficulty')}: {localizeLabel(difficulty, lang)}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Icon name="counter" size={wp('4%')} color="#60a5fa" />
            <Text style={styles.metaText}>
              {topic.wordTargetMin}–{topic.wordTargetMax} {t('word_count')}
            </Text>
          </View>
          <View style={styles.metaChip}>
            <Icon name="timer-outline" size={wp('4%')} color="#10b981" />
            <Text style={styles.metaText}>
              {topic.suggestedMinutes} {t('min_label')}
            </Text>
          </View>
        </View>

        <Text style={styles.section}>{t('hints')}</Text>
        <View style={styles.card}>
          {hints.map((h, i) => (
            <Text key={i} style={styles.hint}>
              • {h}
            </Text>
          ))}
        </View>

        <Text style={styles.section}>{t('suggested_structure')}</Text>
        <View style={styles.card}>
          {structure.map((s, i) => (
            <Text key={i} style={styles.hint}>
              {i + 1}. {s}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          style={styles.cta}
          onPress={() =>
            navigation.navigate('EssayWrite', {
              topicId: topic.id,
              wordTargetMin: topic.wordTargetMin,
              wordTargetMax: topic.wordTargetMax,
              suggestedMinutes: topic.suggestedMinutes,
            })
          }>
          <Icon name="pencil" size={wp('5%')} color="#fff" />
          <Text style={styles.ctaText}>{t('start_writing')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondary}
          onPress={() => setShowOutline(!showOutline)}>
          <Text style={styles.secondaryText}>
            {showOutline ? t('hide_model') : t('view_outline')}
          </Text>
        </TouchableOpacity>
        {showOutline && (
          <View style={styles.card}>
            <Text style={styles.outline}>{outline}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0b1220'},
  center: {alignItems: 'center', justifyContent: 'center'},
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
  headerTitle: {flex: 1, fontSize: wp('5%'), fontWeight: '800', color: '#fff'},
  cat: {
    color: '#38bdf8',
    fontSize: wp('3.2%'),
    fontWeight: '700',
    marginBottom: hp('0.8%'),
  },
  title: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: '800',
    lineHeight: wp('7%'),
    marginBottom: hp('2%'),
  },
  metaRow: {flexDirection: 'row', flexWrap: 'wrap', gap: wp('2%')},
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    backgroundColor: '#111827',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  metaText: {color: '#e5e7eb', fontSize: wp('3.2%')},
  section: {
    color: '#9ca3af',
    fontWeight: '700',
    fontSize: wp('3.5%'),
    marginTop: hp('2.5%'),
    marginBottom: hp('1%'),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  hint: {
    color: '#e5e7eb',
    fontSize: wp('3.6%'),
    lineHeight: wp('5.4%'),
    marginBottom: hp('0.6%'),
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
    backgroundColor: '#3b82f6',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    marginTop: hp('3%'),
  },
  ctaText: {color: '#fff', fontWeight: '800', fontSize: wp('4%')},
  secondary: {alignItems: 'center', paddingVertical: hp('1.5%')},
  secondaryText: {color: '#60a5fa', fontWeight: '700', fontSize: wp('3.6%')},
  outline: {color: '#e5e7eb', fontSize: wp('3.6%'), lineHeight: wp('5.4%')},
});
