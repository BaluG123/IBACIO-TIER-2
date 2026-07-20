import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import {useAppDrawer} from '../navigation/DrawerNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  fetchManifest,
  fetchDailyEdition,
  formatDateKey,
  getLocalizedEdition,
  getDomainColor,
  DailyEdition,
} from '../services/dailyPromptService';
import {parseDateKey} from '../utils/timer';

const LOCALE_EN = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const LOCALE_HI = {
  monthNames: [
    'जनवरी',
    'फ़रवरी',
    'मार्च',
    'अप्रैल',
    'मई',
    'जून',
    'जुलाई',
    'अगस्त',
    'सितंबर',
    'अक्टूबर',
    'नवंबर',
    'दिसंबर',
  ],
  monthNamesShort: [
    'जन',
    'फ़र',
    'मार्च',
    'अप्रै',
    'मई',
    'जून',
    'जुल',
    'अग',
    'सित',
    'अक्ट',
    'नव',
    'दिस',
  ],
  dayNames: [
    'रविवार',
    'सोमवार',
    'मंगलवार',
    'बुधवार',
    'गुरुवार',
    'शुक्रवार',
    'शनिवार',
  ],
  dayNamesShort: ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
};

function formatDisplayDate(dateKey: string, lang: string) {
  const date = parseDateKey(dateKey);
  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN';
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

LocaleConfig.locales.en = LOCALE_EN;
LocaleConfig.locales.hi = LOCALE_HI;

export default function DailyWritingScreen() {
  const {t, i18n} = useTranslation();
  const navigation = useNavigation<any>();
  const {openDrawer} = useAppDrawer();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const todayKey = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(
    route.params?.selectedDate || todayKey,
  );
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [edition, setEdition] = useState<DailyEdition | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [calendarExpanded, setCalendarExpanded] = useState(false);

  useEffect(() => {
    LocaleConfig.defaultLocale = i18n.language === 'hi' ? 'hi' : 'en';
  }, [i18n.language]);

  useEffect(() => {
    if (route.params?.selectedDate) {
      setSelectedDate(route.params.selectedDate);
    }
  }, [route.params?.selectedDate]);

  const loadData = useCallback(
    async (dateKey: string, isRefresh = false) => {
      if (!isRefresh) {
        setLoading(true);
      }
      try {
        const manifest = await fetchManifest(isRefresh);
        setAvailableDates(manifest.dates || []);
        const raw = await fetchDailyEdition(dateKey, isRefresh);
        setEdition(getLocalizedEdition(raw, i18n.language));
      } catch (e) {
        console.error('Daily writing load error', e);
        setEdition(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [i18n.language],
  );

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData(selectedDate, true);
    }, [selectedDate, loadData]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData(selectedDate, true);
  };

  const buildMarkedDates = () => {
    const marked: Record<string, any> = {};
    availableDates.forEach(d => {
      marked[d] = {marked: true, dotColor: '#10b981'};
    });
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: '#1d4ed8',
      selectedTextColor: '#ffffff',
    };
    return marked;
  };

  const isToday = selectedDate === todayKey;
  const hasEdition = !!edition?.essayTopic;

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
          onPress={() => openDrawer()}
          activeOpacity={0.7}>
          <Icon name="menu" size={wp('6%')} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('daily_prompts')}</Text>
          <Text style={styles.headerSubtitle}>{t('daily_prompts_subtitle')}</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={onRefresh}
          activeOpacity={0.7}>
          <Icon name="refresh" size={wp('5.5%')} color="#60a5fa" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#60a5fa"
          />
        }
        contentContainerStyle={{paddingBottom: insets.bottom + hp('3%')}}>
        <View style={[styles.dateBanner, isToday && styles.dateBannerToday]}>
          <View style={styles.dateBannerLeft}>
            {isToday && (
              <View style={styles.todayPill}>
                <View style={styles.liveDot} />
                <Text style={styles.todayPillText}>{t('today')}</Text>
              </View>
            )}
            <Text style={styles.dateBannerText}>
              {formatDisplayDate(selectedDate, i18n.language)}
            </Text>
            {!loading && hasEdition && (
              <Text style={styles.editionTitle}>{edition?.editionTitle}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.calendarToggle}
            onPress={() => setCalendarExpanded(!calendarExpanded)}>
            <Icon
              name={calendarExpanded ? 'calendar-remove' : 'calendar-month'}
              size={wp('6%')}
              color="#60a5fa"
            />
          </TouchableOpacity>
        </View>

        {calendarExpanded && (
          <View style={styles.calendarBox}>
            <Calendar
              current={selectedDate}
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={buildMarkedDates()}
              maxDate={todayKey}
              enableSwipeMonths
              theme={{
                backgroundColor: '#111827',
                calendarBackground: '#111827',
                textSectionTitleColor: '#9ca3af',
                selectedDayBackgroundColor: '#1d4ed8',
                selectedDayTextColor: '#fff',
                todayTextColor: '#60a5fa',
                dayTextColor: '#e5e7eb',
                textDisabledColor: '#4b5563',
                monthTextColor: '#fff',
                arrowColor: '#60a5fa',
                textDayFontWeight: '600',
                textMonthFontWeight: '800',
                textDayHeaderFontWeight: '700',
                textDayFontSize: wp('3.5%'),
                textMonthFontSize: wp('4.5%'),
              }}
            />
            <Text style={styles.calendarHint}>{t('calendar_hint')}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#60a5fa" />
            <Text style={styles.loadingText}>{t('loading_prompts')}</Text>
          </View>
        ) : !hasEdition ? (
          <View style={styles.emptyBox}>
            <Icon name="desk" size={wp('14%')} color="#374151" />
            <Text style={styles.emptyTitle}>{t('no_prompt_title')}</Text>
            <Text style={styles.emptyDesc}>{t('no_prompt_desc')}</Text>
            <Text style={styles.checkBack}>{t('check_back')}</Text>
          </View>
        ) : (
          <View style={styles.feedContainer}>
            {!!edition?.tipOfDay && (
              <View style={styles.tipCard}>
                <Icon name="lightbulb-on" size={wp('5%')} color="#fbbf24" />
                <View style={{flex: 1}}>
                  <Text style={styles.tipLabel}>{t('tip_of_day')}</Text>
                  <Text style={styles.tipText}>{edition.tipOfDay}</Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionLabel}>{t('essay_section')}</Text>
            <TouchableOpacity
              style={[styles.topicCard, {borderLeftColor: '#38bdf8'}]}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('DailyPromptDetail', {
                  dateKey: selectedDate,
                })
              }>
              <Text style={styles.topicCategory}>
                {edition?.essayTopic?.category}
              </Text>
              <Text style={styles.topicTitle}>
                {edition?.essayTopic?.title}
              </Text>
              <View style={styles.openRow}>
                <Text style={styles.openText}>{t('continue')}</Text>
                <Icon name="arrow-right" size={wp('4.5%')} color="#60a5fa" />
              </View>
            </TouchableOpacity>

            <Text style={styles.sectionLabel}>{t('laq_section')}</Text>
            {(edition?.longAnswers || []).slice(0, 2).map(la => (
              <View
                key={la.id}
                style={[
                  styles.topicCard,
                  {borderLeftColor: getDomainColor(la.domain)},
                ]}>
                <Text
                  style={[
                    styles.topicCategory,
                    {color: getDomainColor(la.domain)},
                  ]}>
                  {la.domain}
                </Text>
                <Text style={styles.topicTitle}>{la.question}</Text>
              </View>
            ))}

            <Text style={styles.sectionLabel}>{t('rc_section')}</Text>
            <View style={[styles.topicCard, {borderLeftColor: '#f472b6'}]}>
              <Text style={styles.topicTitle} numberOfLines={4}>
                {edition?.comprehension?.passage}
              </Text>
              <Text style={styles.rcMeta}>
                {(edition?.comprehension?.questions || []).length} Qs
              </Text>
            </View>

            <TouchableOpacity
              style={styles.fullBtn}
              onPress={() =>
                navigation.navigate('DailyPromptDetail', {
                  dateKey: selectedDate,
                })
              }>
              <Text style={styles.fullBtnText}>{t('start_practice')}</Text>
              <Icon name="chevron-right" size={wp('5%')} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
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
  },
  menuBtn: {
    padding: wp('2%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#374151',
  },
  headerCenter: {flex: 1, marginHorizontal: wp('3%')},
  headerTitle: {fontSize: wp('5%'), fontWeight: '800', color: '#fff'},
  headerSubtitle: {
    fontSize: wp('3.2%'),
    color: '#9ca3af',
    marginTop: hp('0.2%'),
  },
  refreshBtn: {
    padding: wp('2.5%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#374151',
  },
  dateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: wp('4%'),
    marginBottom: hp('1%'),
    padding: wp('4%'),
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  dateBannerToday: {
    borderColor: '#1d4ed860',
    backgroundColor: '#1e3a8a20',
  },
  dateBannerLeft: {flex: 1},
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ef444420',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('0.8%'),
    borderWidth: 1,
    borderColor: '#ef444440',
  },
  liveDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#ef4444',
    marginRight: wp('1.5%'),
  },
  todayPillText: {
    color: '#fca5a5',
    fontSize: wp('3%'),
    fontWeight: '800',
    letterSpacing: 1,
  },
  dateBannerText: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#fff',
    lineHeight: wp('5.5%'),
  },
  editionTitle: {
    fontSize: wp('3.2%'),
    color: '#9ca3af',
    marginTop: hp('0.5%'),
  },
  calendarToggle: {
    padding: wp('3%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#374151',
  },
  calendarBox: {
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  calendarHint: {
    color: '#6b7280',
    fontSize: wp('3%'),
    textAlign: 'center',
    paddingBottom: hp('1.5%'),
    paddingHorizontal: wp('4%'),
  },
  loadingBox: {alignItems: 'center', paddingVertical: hp('8%')},
  loadingText: {
    color: '#9ca3af',
    marginTop: hp('2%'),
    fontSize: wp('3.8%'),
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: hp('8%'),
    paddingHorizontal: wp('8%'),
  },
  emptyTitle: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: '700',
    marginTop: hp('2%'),
  },
  emptyDesc: {
    color: '#9ca3af',
    fontSize: wp('3.6%'),
    textAlign: 'center',
    marginTop: hp('1%'),
    lineHeight: wp('5.5%'),
  },
  checkBack: {
    color: '#60a5fa',
    fontSize: wp('3.8%'),
    fontWeight: '700',
    marginTop: hp('2%'),
  },
  feedContainer: {paddingHorizontal: wp('4%')},
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
  tipText: {color: '#e5e7eb', fontSize: wp('3.5%'), lineHeight: wp('5%')},
  sectionLabel: {
    fontSize: wp('3.5%'),
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: hp('1%'),
    marginTop: hp('0.5%'),
  },
  topicCard: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  topicCategory: {
    color: '#60a5fa',
    fontSize: wp('3%'),
    fontWeight: '700',
    marginBottom: hp('0.5%'),
  },
  topicTitle: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '700',
    lineHeight: wp('5.5%'),
  },
  openRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1.2%'),
    gap: wp('1%'),
  },
  openText: {color: '#60a5fa', fontWeight: '700', fontSize: wp('3.5%')},
  rcMeta: {color: '#9ca3af', marginTop: hp('1%'), fontSize: wp('3.2%')},
  fullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    marginTop: hp('1%'),
    gap: wp('2%'),
  },
  fullBtnText: {color: '#fff', fontSize: wp('4%'), fontWeight: '700'},
});
