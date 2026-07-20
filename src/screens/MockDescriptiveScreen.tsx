import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {formatTimer, timerColor, countWords} from '../utils/timer';
import {getLocalized} from '../utils/localize';

type MockPaper = {
  id: string;
  title: string;
  durationMinutes: number;
  essayTopicId: string;
  comprehensionId: string;
  longAnswerIds: string[];
  instructions: string[];
};

const mocksData = require('../assets/mocks/papers.json');
const essaysData = require('../assets/essays/topics.json');
const passagesData = require('../assets/comprehension/passages.json');
const laqData = require('../assets/long-answers/questions.json');

const MOCKS: MockPaper[] = mocksData.mocks || [];
type Section = 'essay' | 'rc' | 'laq';

export default function MockDescriptiveScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const lang = i18n.language;

  const mock = useMemo(
    () => MOCKS.find(m => m.id === route.params?.mockId),
    [route.params?.mockId],
  );

  const essay = useMemo(
    () =>
      (essaysData.topics || []).find(
        (x: any) => x.id === mock?.essayTopicId,
      ),
    [mock],
  );
  const passage = useMemo(
    () =>
      (passagesData.passages || []).find(
        (x: any) => x.id === mock?.comprehensionId,
      ),
    [mock],
  );
  const laqs = useMemo(
    () =>
      (laqData.questions || []).filter((x: any) =>
        (mock?.longAnswerIds || []).includes(x.id),
      ),
    [mock],
  );

  const totalSeconds = (mock?.durationMinutes || 60) * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [section, setSection] = useState<Section>('essay');
  const [essayText, setEssayText] = useState('');
  const [rcAnswers, setRcAnswers] = useState<Record<string, string>>({});
  const [laqAnswers, setLaqAnswers] = useState<Record<string, string>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!mock) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{color: '#fff'}}>{t('mock_not_found')}</Text>
      </View>
    );
  }

  const finish = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    navigation.replace('MockResult', {
      mockId: mock.id,
      essayText,
      rcAnswers,
      laqAnswers,
    });
  };

  const confirmFinish = () => {
    Alert.alert(t('finish_mock'), '', [
      {text: t('go_back'), style: 'cancel'},
      {text: t('finish_mock'), onPress: finish},
    ]);
  };

  const mockTitle = getLocalized<string>(mock, 'title', lang);
  const essayTitle = getLocalized<string>(essay, 'title', lang);
  const passageTitle = getLocalized<string>(passage, 'title', lang);
  const passageText = getLocalized<string>(passage, 'passage', lang);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={[styles.header, {paddingTop: insets.top + hp('1%')}]}>
        <TouchableOpacity style={styles.backBtn} onPress={confirmFinish}>
          <Icon name="close" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {mockTitle}
          </Text>
        </View>
        <Text
          style={{
            color: timerColor(remaining, totalSeconds),
            fontWeight: '800',
            fontSize: wp('4%'),
          }}>
          {formatTimer(remaining)}
        </Text>
      </View>

      <View style={styles.tabs}>
        {(
          [
            ['essay', t('section_essay')],
            ['rc', t('section_rc')],
            ['laq', t('section_laq')],
          ] as const
        ).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, section === key && styles.tabActive]}
            onPress={() => setSection(key)}>
            <Text
              style={[
                styles.tabText,
                section === key && styles.tabTextActive,
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('4%'),
        }}>
        {section === 'essay' && (
          <View>
            <Text style={styles.prompt}>
              {essayTitle || t('section_essay')}
            </Text>
            <Text style={styles.meta}>
              20 {t('marks')} · {countWords(essayText)} {t('word_count')}
            </Text>
            <TextInput
              style={styles.inputTall}
              multiline
              placeholder={t('placeholder_mock_essay')}
              placeholderTextColor="#6b7280"
              value={essayText}
              onChangeText={setEssayText}
              textAlignVertical="top"
            />
          </View>
        )}

        {section === 'rc' && (
          <View>
            <Text style={styles.prompt}>
              {passageTitle || t('section_rc')}
            </Text>
            <Text style={styles.passage}>{passageText}</Text>
            {(passage?.questions || []).map((q: any, i: number) => (
              <View key={q.id || i} style={styles.qBlock}>
                <Text style={styles.qText}>
                  Q{i + 1}. {getLocalized<string>(q, 'q', lang)}
                </Text>
                <TextInput
                  style={styles.inputShort}
                  multiline
                  placeholder={t('placeholder_answer')}
                  placeholderTextColor="#6b7280"
                  value={rcAnswers[q.id] || ''}
                  onChangeText={val =>
                    setRcAnswers(prev => ({...prev, [q.id]: val}))
                  }
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>
        )}

        {section === 'laq' && (
          <View>
            {laqs.map((la: any) => (
              <View key={la.id} style={styles.qBlock}>
                <Text style={styles.prompt}>
                  {getLocalized<string>(la, 'question', lang)}
                </Text>
                <Text style={styles.meta}>
                  10 {t('marks')} · {countWords(laqAnswers[la.id] || '')}{' '}
                  {t('word_count')}
                </Text>
                <TextInput
                  style={styles.inputShort}
                  multiline
                  placeholder={t('placeholder_mock_laq')}
                  placeholderTextColor="#6b7280"
                  value={laqAnswers[la.id] || ''}
                  onChangeText={val =>
                    setLaqAnswers(prev => ({...prev, [la.id]: val}))
                  }
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.finishBtn} onPress={confirmFinish}>
          <Text style={styles.finishText}>{t('finish_mock')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    gap: wp('2%'),
  },
  backBtn: {
    padding: wp('2%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
  },
  headerTitle: {fontSize: wp('4%'), fontWeight: '800', color: '#fff'},
  tabs: {
    flexDirection: 'row',
    padding: wp('3%'),
    gap: wp('2%'),
    backgroundColor: '#0b1220',
  },
  tab: {
    flex: 1,
    paddingVertical: hp('1.2%'),
    borderRadius: wp('2%'),
    backgroundColor: '#111827',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  tabActive: {backgroundColor: '#1e3a8a', borderColor: '#3b82f6'},
  tabText: {color: '#9ca3af', fontWeight: '700', fontSize: wp('3.2%')},
  tabTextActive: {color: '#fff'},
  prompt: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '800',
    lineHeight: wp('5.6%'),
    marginBottom: hp('0.8%'),
  },
  meta: {color: '#9ca3af', fontSize: wp('3.2%'), marginBottom: hp('1%')},
  passage: {
    color: '#e5e7eb',
    fontSize: wp('3.5%'),
    lineHeight: wp('5.2%'),
    marginBottom: hp('1.5%'),
  },
  inputTall: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#fff',
    padding: wp('4%'),
    minHeight: hp('35%'),
    fontSize: wp('3.7%'),
    textAlignVertical: 'top',
  },
  inputShort: {
    backgroundColor: '#0b1220',
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#fff',
    padding: wp('3%'),
    minHeight: hp('12%'),
    fontSize: wp('3.5%'),
    textAlignVertical: 'top',
  },
  qBlock: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  qText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp('3.6%'),
    marginBottom: hp('1%'),
  },
  finishBtn: {
    backgroundColor: '#10b981',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  finishText: {color: '#fff', fontWeight: '800', fontSize: wp('4%')},
});
