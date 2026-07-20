import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
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
import {formatTimer, timerColor} from '../utils/timer';

type Passage = {
  id: string;
  title: string;
  passage: string;
  questions: Array<{id: string; q: string; model: string}>;
  suggestedMinutes?: number;
  wordGuide?: string;
};

const data = require('../assets/comprehension/passages.json');
const PASSAGES: Passage[] = data.passages || [];

export default function PassageDetailScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const passage = useMemo(
    () => PASSAGES.find(p => p.id === route.params?.passageId),
    [route.params?.passageId],
  );

  const totalSeconds = (passage?.suggestedMinutes || 12) * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showModels, setShowModels] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  if (!passage) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{color: '#fff'}}>Passage not found</Text>
      </View>
    );
  }

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
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {passage.title}
          </Text>
        </View>
        <View style={styles.timerChip}>
          <Text
            style={{
              color: timerColor(remaining, totalSeconds),
              fontWeight: '800',
            }}>
            {formatTimer(remaining)}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('4%'),
        }}>
        <View style={styles.passageCard}>
          <Text style={styles.passage}>{passage.passage}</Text>
          {!!passage.wordGuide && (
            <Text style={styles.guide}>{passage.wordGuide}</Text>
          )}
        </View>

        {(passage.questions || []).map((q, i) => (
          <View key={q.id || i} style={styles.qCard}>
            <Text style={styles.qText}>
              Q{i + 1}. {q.q}
            </Text>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Your answer..."
              placeholderTextColor="#6b7280"
              value={answers[q.id] || ''}
              onChangeText={val =>
                setAnswers(prev => ({...prev, [q.id]: val}))
              }
              textAlignVertical="top"
            />
            {showModels && (
              <Text style={styles.model}>
                {t('model_answer')}: {q.model}
              </Text>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.revealBtn}
          onPress={() => setShowModels(!showModels)}>
          <Text style={styles.revealText}>
            {showModels ? t('hide_answers') : t('reveal_answers')}
          </Text>
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
  headerTitle: {fontSize: wp('4.2%'), fontWeight: '800', color: '#fff'},
  timerChip: {
    backgroundColor: '#0b1220',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  passageCard: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: hp('2%'),
  },
  passage: {
    color: '#e5e7eb',
    fontSize: wp('3.7%'),
    lineHeight: wp('5.6%'),
  },
  guide: {
    color: '#9ca3af',
    fontSize: wp('3.2%'),
    marginTop: hp('1.5%'),
    fontStyle: 'italic',
  },
  qCard: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  qText: {
    color: '#fff',
    fontSize: wp('3.7%'),
    fontWeight: '700',
    marginBottom: hp('1%'),
  },
  input: {
    backgroundColor: '#0b1220',
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#fff',
    padding: wp('3%'),
    minHeight: hp('10%'),
    fontSize: wp('3.5%'),
  },
  model: {
    color: '#14b8a6',
    fontSize: wp('3.4%'),
    marginTop: hp('1%'),
    lineHeight: wp('5%'),
  },
  revealBtn: {
    backgroundColor: '#1e3a8a',
    paddingVertical: hp('1.6%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  revealText: {color: '#60a5fa', fontWeight: '700', fontSize: wp('3.8%')},
});
