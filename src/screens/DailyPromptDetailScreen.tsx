import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {
  fetchDailyEdition,
  getLocalizedEdition,
  getDomainColor,
  DailyEdition,
} from '../services/dailyPromptService';

export default function DailyPromptDetailScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const dateKey = route.params?.dateKey as string;

  const [edition, setEdition] = useState<DailyEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEssayModel, setShowEssayModel] = useState(false);
  const [showLaqModels, setShowLaqModels] = useState(false);
  const [showRcModels, setShowRcModels] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await fetchDailyEdition(dateKey);
      setEdition(getLocalizedEdition(raw, i18n.language));
    } catch (e) {
      console.warn(e);
      setEdition(null);
    } finally {
      setLoading(false);
    }
  }, [dateKey, i18n.language]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!edition?.essayTopic) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <Icon name="desk" size={wp('14%')} color="#374151" />
        <Text style={styles.emptyTitle}>{t('no_prompt_title')}</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>{t('go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={[styles.header, {paddingTop: insets.top + hp('1%')}]}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {edition.editionTitle}
          </Text>
          <Text style={styles.headerSub}>{dateKey}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('4%'),
        }}>
        {!!edition.tipOfDay && (
          <View style={styles.tipCard}>
            <Icon name="lightbulb-on" size={wp('5%')} color="#fbbf24" />
            <View style={{flex: 1}}>
              <Text style={styles.tipLabel}>{t('tip_of_day')}</Text>
              <Text style={styles.body}>{edition.tipOfDay}</Text>
            </View>
          </View>
        )}

        <Text style={styles.section}>{t('essay_section')}</Text>
        <View style={[styles.card, {borderLeftColor: '#38bdf8'}]}>
          <Text style={styles.meta}>{edition.essayTopic.category}</Text>
          <Text style={styles.title}>{edition.essayTopic.title}</Text>
          {(edition.essayTopic.hints || []).map((h, i) => (
            <Text key={i} style={styles.hint}>
              • {h}
            </Text>
          ))}
          <TouchableOpacity
            style={styles.cta}
            onPress={() =>
              navigation.navigate('EssayWrite', {
                topicId: `daily_${dateKey}`,
                title: edition.essayTopic.title,
                outline: edition.essayTopic.modelOutline,
                wordTargetMin: 400,
                wordTargetMax: 500,
                suggestedMinutes: 28,
                fromDaily: true,
              })
            }>
            <Text style={styles.ctaText}>{t('start_writing')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setShowEssayModel(!showEssayModel)}>
            <Text style={styles.secondaryText}>
              {showEssayModel ? t('hide_model') : t('view_outline')}
            </Text>
          </TouchableOpacity>
          {showEssayModel && (
            <Text style={styles.model}>{edition.essayTopic.modelOutline}</Text>
          )}
        </View>

        <Text style={styles.section}>{t('laq_section')}</Text>
        {(edition.longAnswers || []).map(la => (
          <View
            key={la.id}
            style={[
              styles.card,
              {borderLeftColor: getDomainColor(la.domain)},
            ]}>
            <Text
              style={[styles.meta, {color: getDomainColor(la.domain)}]}>
              {la.domain} · 10 {t('marks')}
            </Text>
            <Text style={styles.title}>{la.question}</Text>
            <TouchableOpacity
              style={styles.cta}
              onPress={() =>
                navigation.navigate('LongAnswerWrite', {
                  questionId: `daily_${dateKey}_${la.id}`,
                  question: la.question,
                  modelAnswer: la.modelAnswer,
                  wordTargetMin: 150,
                  wordTargetMax: 200,
                  suggestedMinutes: 12,
                  fromDaily: true,
                })
              }>
              <Text style={styles.ctaText}>{t('write_answer')}</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.secondary}
          onPress={() => setShowLaqModels(!showLaqModels)}>
          <Text style={styles.secondaryText}>
            {showLaqModels ? t('hide_answers') : t('reveal_answers')}
          </Text>
        </TouchableOpacity>
        {showLaqModels &&
          (edition.longAnswers || []).map(la => (
            <View key={`m_${la.id}`} style={styles.modelBox}>
              <Text style={styles.modelTitle}>{la.question}</Text>
              <Text style={styles.modelLabel}>{t('key_points')}</Text>
              {(la.keyPoints || []).map((kp, i) => (
                <Text key={i} style={styles.hint}>
                  • {kp}
                </Text>
              ))}
              <Text style={styles.modelLabel}>{t('model_answer')}</Text>
              <Text style={styles.model}>{la.modelAnswer}</Text>
            </View>
          ))}

        <Text style={styles.section}>{t('rc_section')}</Text>
        <View style={[styles.card, {borderLeftColor: '#f472b6'}]}>
          <Text style={styles.body}>{edition.comprehension.passage}</Text>
          {(edition.comprehension.questions || []).map((q, i) => (
            <View key={i} style={styles.qBlock}>
              <Text style={styles.qText}>
                Q{i + 1}. {q.q}
              </Text>
              {showRcModels && (
                <Text style={styles.model}>
                  {t('model_answer')}: {q.model}
                </Text>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={styles.secondary}
            onPress={() => setShowRcModels(!showRcModels)}>
            <Text style={styles.secondaryText}>
              {showRcModels ? t('hide_answers') : t('reveal_answers')}
            </Text>
          </TouchableOpacity>
        </View>
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
  backIcon: {
    padding: wp('2%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
  },
  headerTitle: {fontSize: wp('4.5%'), fontWeight: '800', color: '#fff'},
  headerSub: {fontSize: wp('3%'), color: '#9ca3af', marginTop: hp('0.2%')},
  tipCard: {
    flexDirection: 'row',
    gap: wp('3%'),
    backgroundColor: '#111827',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#fbbf2430',
    marginBottom: hp('2%'),
  },
  tipLabel: {
    color: '#fbbf24',
    fontSize: wp('3.2%'),
    fontWeight: '700',
    marginBottom: hp('0.4%'),
  },
  section: {
    fontSize: wp('3.5%'),
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: hp('1%'),
    marginTop: hp('1%'),
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  meta: {
    color: '#60a5fa',
    fontSize: wp('3%'),
    fontWeight: '700',
    marginBottom: hp('0.5%'),
  },
  title: {
    color: '#fff',
    fontSize: wp('4.2%'),
    fontWeight: '800',
    lineHeight: wp('5.8%'),
    marginBottom: hp('1%'),
  },
  body: {color: '#e5e7eb', fontSize: wp('3.6%'), lineHeight: wp('5.4%')},
  hint: {
    color: '#9ca3af',
    fontSize: wp('3.4%'),
    marginBottom: hp('0.4%'),
    lineHeight: wp('5%'),
  },
  cta: {
    backgroundColor: '#3b82f6',
    paddingVertical: hp('1.4%'),
    borderRadius: wp('2.5%'),
    alignItems: 'center',
    marginTop: hp('1.5%'),
  },
  ctaText: {color: '#fff', fontWeight: '700', fontSize: wp('3.8%')},
  secondary: {
    paddingVertical: hp('1.2%'),
    alignItems: 'center',
    marginTop: hp('0.8%'),
  },
  secondaryText: {color: '#60a5fa', fontWeight: '700', fontSize: wp('3.5%')},
  model: {
    color: '#e5e7eb',
    fontSize: wp('3.5%'),
    lineHeight: wp('5.2%'),
    marginTop: hp('1%'),
  },
  modelBox: {
    backgroundColor: '#111827',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  modelTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: wp('3.6%'),
    marginBottom: hp('1%'),
  },
  modelLabel: {
    color: '#14b8a6',
    fontWeight: '700',
    fontSize: wp('3.2%'),
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  qBlock: {
    marginTop: hp('1.5%'),
    paddingTop: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  qText: {color: '#fff', fontSize: wp('3.6%'), fontWeight: '600'},
  emptyTitle: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginTop: hp('2%'),
  },
  backBtn: {
    marginTop: hp('3%'),
    backgroundColor: '#1f2937',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2.5%'),
  },
  backBtnText: {color: '#fff', fontWeight: '600'},
});
