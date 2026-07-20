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
import {saveDraft, loadDraft, markEssayComplete} from '../utils/storage';

const CHECKLIST_KEYS = [
  'intro_clarity',
  'facts_used',
  'balance',
  'conclusion_quality',
  'language_quality',
] as const;

export default function EssayWriteScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const topicId = route.params?.topicId || 'essay_unknown';
  const title = route.params?.title || 'Essay';
  const outline = route.params?.outline || '';
  const wordMin = route.params?.wordTargetMin || 400;
  const wordMax = route.params?.wordTargetMax || 500;
  const minutes = route.params?.suggestedMinutes || 28;
  const totalSeconds = minutes * 60;

  const [text, setText] = useState('');
  const [remaining, setRemaining] = useState(totalSeconds);
  const [submitted, setSubmitted] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [draftNote, setDraftNote] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadDraft(`essay_${topicId}`).then(draft => {
      if (draft) {
        setText(draft);
        setDraftNote(t('draft_restored'));
      }
    });
  }, [topicId, t]);

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
        saveDraft(`essay_${topicId}`, text);
        setDraftNote(t('save_draft'));
      }
    }, 8000);
    return () => clearInterval(id);
  }, [text, topicId, t]);

  const words = countWords(text);

  const onSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('', t('empty_draft'));
      return;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    await markEssayComplete(topicId);
    await saveDraft(`essay_${topicId}`, text);
    setSubmitted(true);
  };

  const toggleCheck = (key: string) => {
    setChecks(prev => ({...prev, [key]: !prev[key]}));
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
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.headerSub}>
            {t('target_words')}: {wordMin}–{wordMax}
          </Text>
        </View>
        <View style={styles.timerChip}>
          <Icon
            name="timer-outline"
            size={wp('4.5%')}
            color={timerColor(remaining, totalSeconds)}
          />
          <Text
            style={[
              styles.timerText,
              {color: timerColor(remaining, totalSeconds)},
            ]}>
            {formatTimer(remaining)}
          </Text>
        </View>
      </View>

      {!submitted ? (
        <View style={styles.writeWrap}>
          <View style={styles.statsBar}>
            <View style={styles.statPill}>
              <Icon name="format-letter-case" size={wp('4%')} color="#60a5fa" />
              <Text style={styles.stat}>
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
                  styles.stat,
                  {color: timerColor(remaining, totalSeconds)},
                ]}>
                {formatTimer(remaining)}
              </Text>
            </View>
            {!!draftNote && (
              <Text style={styles.draftNote} numberOfLines={1}>
                {draftNote}
              </Text>
            )}
            {remaining === 0 && (
              <Text style={styles.timeUp}>{t('time_up')}</Text>
            )}
          </View>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Write your essay here..."
            placeholderTextColor="#6b7280"
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={onSubmit}
            activeOpacity={0.85}>
            <Text style={styles.submitText}>{t('submit_review')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: wp('4%'),
            paddingBottom: insets.bottom + hp('4%'),
          }}>
          <Text style={styles.section}>{t('model_outline')}</Text>
          <View style={styles.card}>
            <Text style={styles.body}>{outline || '—'}</Text>
          </View>

          <Text style={styles.section}>{t('self_eval')}</Text>
          <View style={styles.card}>
            {CHECKLIST_KEYS.map(key => (
              <TouchableOpacity
                key={key}
                style={styles.checkRow}
                onPress={() => toggleCheck(key)}>
                <Icon
                  name={checks[key] ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={wp('6%')}
                  color={checks[key] ? '#10b981' : '#9ca3af'}
                />
                <Text style={styles.checkText}>{t(key)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => navigation.navigate('EssayPractice')}>
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
  headerTitle: {fontSize: wp('4%'), fontWeight: '800', color: '#fff'},
  headerSub: {fontSize: wp('3%'), color: '#9ca3af', marginTop: hp('0.2%')},
  timerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1.5%'),
    backgroundColor: '#0b1220',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  timerText: {fontWeight: '800', fontSize: wp('3.8%')},
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
  stat: {color: '#fff', fontWeight: '800', fontSize: wp('3.5%')},
  draftNote: {color: '#10b981', fontSize: wp('3%'), flexShrink: 1},
  timeUp: {color: '#ef4444', fontWeight: '700', fontSize: wp('3.2%')},
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
    minHeight: hp('40%'),
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
    marginTop: hp('1%'),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: hp('1.5%'),
  },
  body: {color: '#e5e7eb', fontSize: wp('3.6%'), lineHeight: wp('5.4%')},
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    paddingVertical: hp('1%'),
  },
  checkText: {color: '#e5e7eb', fontSize: wp('3.8%'), flex: 1},
});
