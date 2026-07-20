import React, {useEffect, useRef, useState} from 'react';
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
import {countWords, formatTimer, timerColor} from '../utils/timer';
import {saveDraft, loadDraft, recordWritingDay} from '../utils/storage';

export default function LongAnswerWriteScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const questionId = route.params?.questionId || 'laq_unknown';
  const question = route.params?.question || 'Long Answer';
  const modelAnswer = route.params?.modelAnswer || '';
  const wordMin = route.params?.wordTargetMin || 150;
  const wordMax = route.params?.wordTargetMax || 200;
  const minutes = route.params?.suggestedMinutes || 12;
  const totalSeconds = minutes * 60;

  const [text, setText] = useState('');
  const [remaining, setRemaining] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadDraft(`laq_${questionId}`).then(draft => {
      if (draft) {
        setText(draft);
      }
    });
  }, [questionId]);

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

  useEffect(() => {
    const id = setInterval(() => {
      if (text.trim()) {
        saveDraft(`laq_${questionId}`, text);
      }
    }, 8000);
    return () => clearInterval(id);
  }, [text, questionId]);

  const words = countWords(text);

  const onSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('', t('empty_draft'));
      return;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    await saveDraft(`laq_${questionId}`, text);
    await recordWritingDay();
    setSubmitted(true);
  };

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
          <Text style={styles.headerTitle} numberOfLines={2}>
            {question}
          </Text>
          <Text style={styles.headerSub}>
            {t('target_words')}: {wordMin}–{wordMax}
          </Text>
        </View>
        <Text
          style={{
            color: timerColor(remaining, totalSeconds),
            fontWeight: '800',
            fontSize: wp('3.8%'),
          }}>
          {formatTimer(remaining)}
        </Text>
      </View>

      {!submitted ? (
        <View style={styles.writeWrap}>
          <View style={styles.statsBar}>
            <View style={styles.statPill}>
              <Icon name="format-letter-case" size={wp('4%')} color="#a78bfa" />
              <Text style={styles.wordCount}>
                {t('word_count')}: {words}
              </Text>
            </View>
            <View style={styles.statPill}>
              <Icon
                name="timer-outline"
                size={wp('4%')}
                color={timerColor(remaining, totalSeconds)}
              />
              <Text
                style={[
                  styles.wordCount,
                  {color: timerColor(remaining, totalSeconds)},
                ]}>
                {formatTimer(remaining)}
              </Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Write your answer (150–200 words)..."
            placeholderTextColor="#6b7280"
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
            <Text style={styles.submitText}>{t('submit_review')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: wp('4%'),
            paddingBottom: insets.bottom + hp('4%'),
          }}>
          <Text style={styles.section}>{t('model_answer')}</Text>
          <View style={styles.card}>
            <Text style={styles.body}>{modelAnswer || '—'}</Text>
          </View>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => navigation.goBack()}>
            <Text style={styles.submitText}>{t('continue')}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
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
    gap: wp('2%'),
  },
  backBtn: {
    padding: wp('2%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
  },
  headerTitle: {fontSize: wp('3.6%'), fontWeight: '800', color: '#fff'},
  headerSub: {fontSize: wp('3%'), color: '#9ca3af', marginTop: hp('0.2%')},
  writeWrap: {flex: 1, padding: wp('4%')},
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: wp('2%'),
    marginBottom: hp('1.2%'),
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.2%'),
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    backgroundColor: '#0b1220',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.7%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  wordCount: {
    color: '#fff',
    fontWeight: '800',
    fontSize: wp('3.5%'),
  },
  input: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    color: '#fff',
    padding: wp('4%'),
    fontSize: wp('3.8%'),
    lineHeight: wp('5.5%'),
    minHeight: hp('35%'),
  },
  submitBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    marginTop: hp('1.5%'),
  },
  submitText: {color: '#fff', fontWeight: '800', fontSize: wp('4%')},
  section: {
    color: '#9ca3af',
    fontWeight: '700',
    fontSize: wp('3.5%'),
    marginBottom: hp('1%'),
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  body: {color: '#e5e7eb', fontSize: wp('3.6%'), lineHeight: wp('5.4%')},
});
