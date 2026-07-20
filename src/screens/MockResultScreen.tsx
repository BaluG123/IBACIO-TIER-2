import React, {useMemo, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {saveMockScore} from '../utils/storage';

function Stepper({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.stepperCard}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(Math.max(0, value - 1))}>
          <Icon name="minus" size={wp('5%')} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.stepValue}>
          {value} / {max}
        </Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(Math.min(max, value + 1))}>
          <Icon name="plus" size={wp('5%')} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MockResultScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const mockId = route.params?.mockId || 'mock';
  const [essay, setEssay] = useState(10);
  const [rc, setRc] = useState(5);
  const [laq, setLaq] = useState(10);
  const [saved, setSaved] = useState(false);

  const total = useMemo(() => essay + rc + laq, [essay, rc, laq]);
  const qualifyPct = Math.round((total / 50) * 100);

  const onSave = async () => {
    await saveMockScore({
      id: `${mockId}_${Date.now()}`,
      mockId,
      essay,
      rc,
      laq,
      total,
    });
    setSaved(true);
    Alert.alert('', t('save_score'));
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
          onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('mock_result')}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: wp('4%'),
          paddingBottom: insets.bottom + hp('4%'),
        }}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t('total_score')}</Text>
          <Text style={styles.totalValue}>{total} / 50</Text>
          <Text style={styles.pct}>{qualifyPct}%</Text>
        </View>

        <Stepper
          label={t('essay_marks')}
          value={essay}
          max={20}
          onChange={setEssay}
        />
        <Stepper label={t('rc_marks')} value={rc} max={10} onChange={setRc} />
        <Stepper
          label={t('laq_marks')}
          value={laq}
          max={20}
          onChange={setLaq}
        />

        <View style={styles.noteCard}>
          <Icon name="information" size={wp('5%')} color="#60a5fa" />
          <Text style={styles.note}>{t('qualifying_note')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.savedBtn]}
          onPress={onSave}
          disabled={saved}>
          <Text style={styles.saveText}>
            {saved ? '✓ ' : ''}
            {t('save_score')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeText}>{t('home')}</Text>
        </TouchableOpacity>
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
  totalCard: {
    backgroundColor: '#1e3a8a',
    borderRadius: wp('4%'),
    padding: wp('6%'),
    alignItems: 'center',
    marginBottom: hp('2.5%'),
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  totalLabel: {color: '#bfdbfe', fontSize: wp('3.5%'), fontWeight: '600'},
  totalValue: {
    color: '#fff',
    fontSize: wp('10%'),
    fontWeight: '900',
    marginTop: hp('0.5%'),
  },
  pct: {color: '#93c5fd', fontSize: wp('4%'), marginTop: hp('0.5%')},
  stepperCard: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.2%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  stepperLabel: {
    color: '#e5e7eb',
    fontWeight: '700',
    fontSize: wp('3.8%'),
    marginBottom: hp('1%'),
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepBtn: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {color: '#fff', fontSize: wp('5%'), fontWeight: '800'},
  noteCard: {
    flexDirection: 'row',
    gap: wp('3%'),
    backgroundColor: '#111827',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    marginTop: hp('1%'),
    marginBottom: hp('2%'),
  },
  note: {
    flex: 1,
    color: '#9ca3af',
    fontSize: wp('3.3%'),
    lineHeight: wp('5%'),
  },
  saveBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  savedBtn: {backgroundColor: '#10b981'},
  saveText: {color: '#fff', fontWeight: '800', fontSize: wp('4%')},
  homeBtn: {
    marginTop: hp('1.2%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
  },
  homeText: {color: '#60a5fa', fontWeight: '700', fontSize: wp('3.8%')},
});
