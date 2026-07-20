import React, {useMemo} from 'react';
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
import {useAppDrawer} from '../navigation/DrawerNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {getLocalized, localizeLabel} from '../utils/localize';

const guides = require('../assets/essays/guides.json');
const topicsData = require('../assets/essays/topics.json');

export default function ModelAnswersScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const {openDrawer} = useAppDrawer();
  const insets = useSafeAreaInsets();
  const lang = i18n.language;

  const samples = useMemo(() => {
    const ids: string[] = guides.sampleEssayIds || [];
    return (topicsData.topics || []).filter((x: any) => ids.includes(x.id));
  }, []);

  const essayStructurePoints =
    getLocalized<string[]>(guides.essayStructure, 'points', lang) || [];
  const examinerLensPoints =
    getLocalized<string[]>(guides.examinerLens, 'points', lang) || [];
  const commonMistakesPoints =
    getLocalized<string[]>(guides.commonMistakes, 'points', lang) || [];
  const dos = getLocalized<string[]>(guides.dosDonts, 'dos', lang) || [];
  const donts = getLocalized<string[]>(guides.dosDonts, 'donts', lang) || [];
  const vocabWords = guides.vocab?.words || [];

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
          <Text style={styles.headerTitle}>{t('model_answers')}</Text>
          <Text style={styles.headerSub}>{t('view_tips')}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('3%'),
        }}>
        <Section
          icon="file-tree"
          color="#38bdf8"
          title={
            getLocalized<string>(guides.essayStructure, 'title', lang) ||
            t('essay_structure')
          }
          points={essayStructurePoints}
        />
        <Section
          icon="eye-check"
          color="#a78bfa"
          title={
            getLocalized<string>(guides.examinerLens, 'title', lang) ||
            t('examiner_lens')
          }
          points={examinerLensPoints}
        />
        <Section
          icon="alert-circle"
          color="#ef4444"
          title={
            getLocalized<string>(guides.commonMistakes, 'title', lang) ||
            t('common_mistakes')
          }
          points={commonMistakesPoints}
        />

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Icon name="check-decagram" size={wp('6%')} color="#10b981" />
            <Text style={styles.cardTitle}>
              {getLocalized<string>(guides.dosDonts, 'title', lang) ||
                t('dos_donts')}
            </Text>
          </View>
          <Text style={styles.subHead}>{t('dos_label')}</Text>
          {dos.map((d: string, i: number) => (
            <Text key={`d${i}`} style={styles.point}>
              ✓ {d}
            </Text>
          ))}
          <Text style={[styles.subHead, {marginTop: hp('1.5%')}]}>
            {t('donts_label')}
          </Text>
          {donts.map((d: string, i: number) => (
            <Text key={`n${i}`} style={styles.point}>
              ✗ {d}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Icon name="book-alphabet" size={wp('6%')} color="#f59e0b" />
            <Text style={styles.cardTitle}>
              {getLocalized<string>(guides.vocab, 'title', lang) ||
                t('vocabulary')}
            </Text>
          </View>
          {vocabWords.map((w: Record<string, any>, i: number) => (
            <View key={i} style={styles.vocabRow}>
              <Text style={styles.term}>
                {getLocalized<string>(w, 'term', lang)}
              </Text>
              <Text style={styles.meaning}>
                {getLocalized<string>(w, 'meaning', lang)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.section}>{t('sample_essays')}</Text>
        {samples.map((s: any) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.sampleCard, {borderLeftColor: '#14b8a6'}]}
            onPress={() =>
              navigation.navigate('EssayTopic', {topicId: s.id})
            }>
            <Text style={styles.sampleCat}>
              {localizeLabel(s.category, lang)}
            </Text>
            <Text style={styles.sampleTitle}>
              {getLocalized<string>(s, 'title', lang)}
            </Text>
            <Text style={styles.sampleOutline} numberOfLines={3}>
              {getLocalized<string>(s, 'outline', lang)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function Section({
  icon,
  color,
  title,
  points,
}: {
  icon: string;
  color: string;
  title: string;
  points: string[];
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Icon name={icon} size={wp('6%')} color={color} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {points.map((p, i) => (
        <Text key={i} style={styles.point}>
          • {p}
        </Text>
      ))}
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
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2.5%'),
    marginBottom: hp('1.2%'),
  },
  cardTitle: {color: '#fff', fontSize: wp('4.2%'), fontWeight: '800', flex: 1},
  point: {
    color: '#e5e7eb',
    fontSize: wp('3.5%'),
    lineHeight: wp('5.2%'),
    marginBottom: hp('0.6%'),
  },
  subHead: {
    color: '#14b8a6',
    fontWeight: '700',
    fontSize: wp('3.4%'),
    marginBottom: hp('0.6%'),
  },
  vocabRow: {
    marginBottom: hp('1.2%'),
    paddingBottom: hp('1.2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  term: {color: '#fbbf24', fontWeight: '800', fontSize: wp('3.6%')},
  meaning: {
    color: '#9ca3af',
    fontSize: wp('3.3%'),
    marginTop: hp('0.3%'),
  },
  section: {
    color: '#9ca3af',
    fontWeight: '700',
    fontSize: wp('3.5%'),
    marginBottom: hp('1%'),
    marginTop: hp('0.5%'),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sampleCard: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.2%'),
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  sampleCat: {color: '#14b8a6', fontSize: wp('3%'), fontWeight: '700'},
  sampleTitle: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '800',
    marginTop: hp('0.4%'),
  },
  sampleOutline: {
    color: '#9ca3af',
    fontSize: wp('3.3%'),
    marginTop: hp('0.8%'),
    lineHeight: wp('5%'),
  },
});
