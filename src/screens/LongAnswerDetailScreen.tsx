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
import {getDomainColor} from '../services/dailyPromptService';
import {getLocalized, localizeLabel} from '../utils/localize';

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

export default function LongAnswerDetailScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const [showPoints, setShowPoints] = useState(false);
  const lang = i18n.language;

  const question = useMemo(
    () => QUESTIONS.find(q => q.id === route.params?.questionId),
    [route.params?.questionId],
  );

  if (!question) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{color: '#fff'}}>{t('question_not_found')}</Text>
      </View>
    );
  }

  const color = getDomainColor(question.domain);
  const questionText = getLocalized<string>(question, 'question', lang);
  const keyPoints = getLocalized<string[]>(question, 'keyPoints', lang) || [];
  const modelAnswer = getLocalized<string>(question, 'modelAnswer', lang);

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
        <Text style={styles.headerTitle}>{t('long_answers')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('4%'),
        }}>
        <Text style={[styles.domain, {color}]}>
          {localizeLabel(question.domain, lang)}
        </Text>
        <Text style={styles.question}>{questionText}</Text>
        <Text style={styles.meta}>
          {question.marks} {t('marks')} ·{' '}
          {t('words_min_meta', {
            minWords: question.wordTargetMin,
            maxWords: question.wordTargetMax,
            min: question.suggestedMinutes,
          })}
        </Text>

        <TouchableOpacity
          style={styles.cta}
          onPress={() =>
            navigation.navigate('LongAnswerWrite', {
              questionId: question.id,
              wordTargetMin: question.wordTargetMin,
              wordTargetMax: question.wordTargetMax,
              suggestedMinutes: question.suggestedMinutes,
            })
          }>
          <Icon name="pencil" size={wp('5%')} color="#fff" />
          <Text style={styles.ctaText}>{t('write_answer')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondary}
          onPress={() => setShowPoints(!showPoints)}>
          <Text style={styles.secondaryText}>
            {showPoints ? t('hide_model') : t('key_points')}
          </Text>
        </TouchableOpacity>

        {showPoints && (
          <View style={styles.card}>
            <Text style={styles.section}>{t('key_points')}</Text>
            {keyPoints.map((kp, i) => (
              <Text key={i} style={styles.point}>
                • {kp}
              </Text>
            ))}
            <Text style={[styles.section, {marginTop: hp('1.5%')}]}>
              {t('model_answer')}
            </Text>
            <Text style={styles.body}>{modelAnswer}</Text>
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
  headerTitle: {fontSize: wp('5%'), fontWeight: '800', color: '#fff'},
  domain: {
    fontSize: wp('3.3%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  question: {
    color: '#fff',
    fontSize: wp('4.8%'),
    fontWeight: '800',
    lineHeight: wp('6.8%'),
  },
  meta: {
    color: '#9ca3af',
    fontSize: wp('3.3%'),
    marginTop: hp('1.5%'),
    marginBottom: hp('2%'),
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
    backgroundColor: '#3b82f6',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
  },
  ctaText: {color: '#fff', fontWeight: '800', fontSize: wp('4%')},
  secondary: {alignItems: 'center', paddingVertical: hp('1.8%')},
  secondaryText: {color: '#60a5fa', fontWeight: '700', fontSize: wp('3.6%')},
  card: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  section: {
    color: '#14b8a6',
    fontWeight: '700',
    fontSize: wp('3.4%'),
    marginBottom: hp('0.8%'),
  },
  point: {
    color: '#e5e7eb',
    fontSize: wp('3.5%'),
    marginBottom: hp('0.5%'),
    lineHeight: wp('5%'),
  },
  body: {color: '#e5e7eb', fontSize: wp('3.5%'), lineHeight: wp('5.2%')},
});
