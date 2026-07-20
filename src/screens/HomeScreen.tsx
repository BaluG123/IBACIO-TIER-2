import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  Linking,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchManifest,
  fetchDailyEdition,
  formatDateKey,
  getLocalizedEdition,
} from '../services/dailyPromptService';
import {LAST_SEEN_KEY} from '../config/dailyPrompts';
import {getWritingStreak} from '../utils/storage';
import {TIER1_PLAY_STORE_URL} from '../config/playStore';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const {openDrawer} = useAppDrawer();
  const insets = useSafeAreaInsets();
  const {t, i18n} = useTranslation();
  const [langDropdownVisible, setLangDropdownVisible] = useState(false);
  const [languageSwitching, setLanguageSwitching] = useState(false);
  const [hasNewPrompt, setHasNewPrompt] = useState(false);
  const [todayTitle, setTodayTitle] = useState('');
  const [streak, setStreak] = useState(0);

  const todayKey = formatDateKey(new Date());

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const newsPulseAnim = useRef(new Animated.Value(1)).current;
  const newsGlowAnim = useRef(new Animated.Value(0.4)).current;
  const iconBounceAnim = useRef(new Animated.Value(0)).current;
  const badgeBlinkAnim = useRef(new Animated.Value(1)).current;
  const shimmerSlideAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(newsPulseAnim, {
            toValue: 1.02,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(newsPulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(newsGlowAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(newsGlowAnim, {
            toValue: 0.35,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(iconBounceAnim, {
            toValue: -6,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(iconBounceAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.delay(1800),
        ]),
        Animated.sequence([
          Animated.timing(badgeBlinkAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(badgeBlinkAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(shimmerSlideAnim, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerSlideAnim, {
            toValue: -1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.delay(800),
        ]),
      ]),
    ).start();
  }, [
    newsPulseAnim,
    newsGlowAnim,
    iconBounceAnim,
    badgeBlinkAnim,
    shimmerSlideAnim,
  ]);

  const loadPreview = useCallback(async () => {
    try {
      const [manifest, lastSeen, edition, streakVal] = await Promise.all([
        fetchManifest(),
        AsyncStorage.getItem(LAST_SEEN_KEY),
        fetchDailyEdition(todayKey),
        getWritingStreak(),
      ]);
      setStreak(streakVal);
      const localized = getLocalizedEdition(edition, i18n.language);
      const dates = manifest?.dates || [];
      const hasToday = dates.includes(todayKey) || !!localized?.essayTopic;
      setHasNewPrompt(hasToday && lastSeen !== todayKey);
      setTodayTitle(localized?.essayTopic?.title || '');
    } catch (e) {
      console.warn('Daily prompt preview failed', e);
    }
  }, [todayKey, i18n.language]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  useEffect(() => {
    if (languageSwitching) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      shimmerAnim.setValue(0);
    }
  }, [languageSwitching, shimmerAnim]);

  const sections = [
    {
      key: 'EssayPractice',
      title: t('essay_writing'),
      icon: 'fountain-pen-tip',
      color: '#38bdf8',
      count: t('essay_count'),
    },
    {
      key: 'ComprehensionPractice',
      title: t('comprehension'),
      icon: 'book-open-page-variant',
      color: '#f472b6',
      count: t('comprehension_count'),
    },
    {
      key: 'LongAnswerPractice',
      title: t('long_answers'),
      icon: 'text-box-outline',
      color: '#a78bfa',
      count: t('long_answers_count'),
    },
    {
      key: 'DailyPromptsDrawer',
      title: t('daily_prompt_card'),
      icon: 'calendar-edit',
      color: '#10b981',
      count: t('daily_prompt_count'),
    },
    {
      key: 'MockTestsDrawer',
      title: t('full_mock'),
      icon: 'clipboard-text-outline',
      color: '#3b82f6',
      count: t('full_mock_count'),
    },
    {
      key: 'ModelAnswersDrawer',
      title: t('model_card'),
      icon: 'lightbulb-on-outline',
      color: '#14b8a6',
      count: t('model_card_count'),
    },
  ];

  const openDailyPrompt = async () => {
    await AsyncStorage.setItem(LAST_SEEN_KEY, todayKey);
    setHasNewPrompt(false);
    navigation.navigate('DailyPromptsDrawer');
  };

  const changeLanguage = async (lng: string) => {
    setLanguageSwitching(true);
    setLangDropdownVisible(false);
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(async () => {
      await AsyncStorage.setItem('app_language', lng);
      await i18n.changeLanguage(lng);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setLanguageSwitching(false));
    }, 300);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {languageSwitching && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <Icon name="translate" size={wp('12%')} color="#60a5fa" />
            <Text style={styles.loadingText}>{t('switching_language')}</Text>
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingBarFill,
                  {
                    opacity: shimmerAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.5, 1, 0.5],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </View>
      )}

      <Animated.View style={{flex: 1, opacity: fadeAnim}}>
        <View
          style={[styles.headerWrapper, {paddingTop: insets.top + hp('1%')}]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => openDrawer()}>
              <Icon name="menu" size={wp('7%')} color="#fff" />
            </TouchableOpacity>
            <View style={styles.logoWrap}>
              <Image
                source={require('../assets/homlogo.png')}
                style={styles.logo}
              />
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.title}>{t('app_title')}</Text>
              <Text style={styles.subtitle}>{t('app_subtitle')}</Text>
            </View>
            <View style={styles.langContainer}>
              <TouchableOpacity
                style={styles.langBtn}
                onPress={() => setLangDropdownVisible(!langDropdownVisible)}>
                <Icon name="earth" size={wp('5.5%')} color="#60a5fa" />
                <Text style={styles.langText}>
                  {i18n.language === 'en' ? 'EN' : 'हिं'}
                </Text>
                <Icon
                  name={langDropdownVisible ? 'chevron-up' : 'chevron-down'}
                  size={wp('4.5%')}
                  color="#9ca3af"
                />
              </TouchableOpacity>
              {langDropdownVisible && (
                <View style={styles.langDropdown}>
                  <TouchableOpacity
                    style={styles.langOption}
                    onPress={() => changeLanguage('en')}>
                    <Icon
                      name="alpha-e-circle"
                      size={wp('5%')}
                      color={i18n.language === 'en' ? '#60a5fa' : '#9ca3af'}
                    />
                    <Text
                      style={[
                        styles.langOptionText,
                        i18n.language === 'en' && styles.langOptionSelected,
                      ]}>
                      {t('english')}
                    </Text>
                    {i18n.language === 'en' && (
                      <Icon name="check-circle" size={wp('4.5%')} color="#60a5fa" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.langOption, {borderBottomWidth: 0}]}
                    onPress={() => changeLanguage('hi')}>
                    <Icon
                      name="alpha-h-circle"
                      size={wp('5%')}
                      color={i18n.language === 'hi' ? '#60a5fa' : '#9ca3af'}
                    />
                    <Text
                      style={[
                        styles.langOptionText,
                        i18n.language === 'hi' && styles.langOptionSelected,
                      ]}>
                      {t('hindi')}
                    </Text>
                    {i18n.language === 'hi' && (
                      <Icon name="check-circle" size={wp('4.5%')} color="#60a5fa" />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            {paddingBottom: insets.bottom + hp('4%')},
          ]}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[styles.welcomeCard, {transform: [{scale: pulseAnim}]}]}>
            <View style={styles.welcomeTextWrap}>
              <Text style={styles.welcomeGreeting}>{t('welcome_greeting')}</Text>
              <Text style={styles.welcomeText}>{t('welcome_text')}</Text>
            </View>
            <Icon
              name="rocket-launch"
              size={wp('12%')}
              color="#60a5fa"
              style={{opacity: 0.8}}
            />
          </Animated.View>

          <View style={styles.examStrip}>
            <Icon name="clipboard-check-outline" size={wp('5%')} color="#60a5fa" />
            <Text style={styles.examStripText}>{t('exam_strip')}</Text>
          </View>

          {streak > 0 && (
            <View style={styles.streakRow}>
              <Icon name="fire" size={wp('5%')} color="#f59e0b" />
              <Text style={styles.streakText}>
                {t('streak_label', {count: streak})}
              </Text>
            </View>
          )}

          <TouchableOpacity activeOpacity={0.9} onPress={openDailyPrompt}>
            <Animated.View style={{transform: [{scale: newsPulseAnim}]}}>
              <View style={styles.dailyCard}>
                <Animated.View
                  pointerEvents="none"
                  style={[styles.newsGlowOverlay, {opacity: newsGlowAnim}]}
                />
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.newsShimmer,
                    {
                      transform: [
                        {
                          translateX: shimmerSlideAnim.interpolate({
                            inputRange: [-1, 1],
                            outputRange: [-wp('80%'), wp('80%')],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                <View style={styles.dailyLeft}>
                  <Animated.View
                    style={[
                      styles.dailyIconWrap,
                      {transform: [{translateY: iconBounceAnim}]},
                    ]}>
                    <Icon name="calendar-edit" size={wp('10%')} color="#34d399" />
                    {hasNewPrompt && (
                      <Animated.View
                        style={[styles.newDot, {opacity: badgeBlinkAnim}]}
                      />
                    )}
                  </Animated.View>
                  <View style={styles.dailyTextWrap}>
                    <View style={styles.dailyTitleRow}>
                      <Text style={styles.dailyTitle}>
                        {t('daily_prompt_card')}
                      </Text>
                      {hasNewPrompt && (
                        <Animated.View
                          style={[styles.newBadge, {opacity: badgeBlinkAnim}]}>
                          <Text style={styles.newBadgeText}>{t('new_badge')}</Text>
                        </Animated.View>
                      )}
                    </View>
                    <Text style={styles.dailyDesc} numberOfLines={2}>
                      {todayTitle || t('daily_prompts_subtitle')}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={wp('6%')} color="#34d399" />
              </View>
            </Animated.View>
          </TouchableOpacity>

          <Text style={styles.sectionHeader}>{t('practice_header')}</Text>

          <View style={styles.grid}>
            {sections.map(item => (
              <TouchableOpacity
                key={item.key}
                style={[styles.card, {borderLeftColor: item.color}]}
                activeOpacity={0.85}
                onPress={() => {
                  if (item.key === 'DailyPromptsDrawer') {
                    openDailyPrompt();
                  } else {
                    navigation.navigate(item.key);
                  }
                }}>
                <View
                  style={[
                    styles.iconWrap,
                    {backgroundColor: item.color + '15'},
                  ]}>
                  <Icon name={item.icon} size={wp('7%')} color={item.color} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.count}</Text>
                </View>
                <Icon name="chevron-right" size={wp('5.5%')} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.tier1Card}
            activeOpacity={0.88}
            onPress={() => Linking.openURL(TIER1_PLAY_STORE_URL).catch(() => {})}>
            <View style={styles.tier1IconWrap}>
              <Icon name="google-play" size={wp('8%')} color="#60a5fa" />
            </View>
            <View style={styles.tier1TextWrap}>
              <Text style={styles.tier1Title}>{t('tier1_card_title')}</Text>
              <Text style={styles.tier1Desc}>{t('tier1_card_desc')}</Text>
              <Text style={styles.tier1Cta}>{t('tier1_card_cta')}</Text>
            </View>
            <Icon name="open-in-new" size={wp('5%')} color="#60a5fa" />
          </TouchableOpacity>

          <View style={styles.footer}>
            <Icon name="heart" size={wp('5%')} color="#10b981" />
            <Text style={styles.footerText}>{t('footer_text')}</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0b1220'},
  scroll: {flex: 1},
  content: {flexGrow: 1, paddingHorizontal: wp('4%')},
  headerWrapper: {
    backgroundColor: '#0b1220',
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp('1%'),
  },
  menuButton: {padding: wp('2%'), marginRight: wp('2%')},
  logoWrap: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  logo: {width: wp('8%'), height: wp('8%'), borderRadius: wp('2%')},
  headerTitleContainer: {flex: 1, justifyContent: 'center', minWidth: 0},
  title: {fontSize: wp('5.5%'), fontWeight: '800', color: '#fff'},
  subtitle: {
    fontSize: wp('3.5%'),
    color: '#9ca3af',
    marginTop: hp('0.2%'),
  },
  langContainer: {position: 'relative', zIndex: 9999, marginLeft: wp('2%')},
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('1%'),
    backgroundColor: '#111827',
    borderRadius: wp('2.5%'),
    borderWidth: 1.5,
    borderColor: '#1f2937',
    gap: wp('1.5%'),
  },
  langText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    fontWeight: '700',
    minWidth: wp('6%'),
    textAlign: 'center',
  },
  langDropdown: {
    position: 'absolute',
    top: '110%',
    right: 0,
    backgroundColor: '#1f2937',
    borderRadius: wp('2.5%'),
    borderWidth: 1.5,
    borderColor: '#374151',
    width: wp('36%'),
    elevation: 999,
    zIndex: 9999,
    overflow: 'hidden',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('3.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    gap: wp('2.5%'),
  },
  langOptionText: {
    flex: 1,
    color: '#d1d5db',
    fontSize: wp('3.8%'),
    fontWeight: '500',
  },
  langOptionSelected: {color: '#60a5fa', fontWeight: '700'},
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
    borderRadius: wp('4%'),
    marginTop: hp('2%'),
    marginBottom: hp('1.5%'),
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  welcomeTextWrap: {flex: 1, paddingRight: wp('4%')},
  welcomeGreeting: {
    fontSize: wp('4.5%'),
    fontWeight: '700',
    color: '#fff',
    marginBottom: hp('0.5%'),
  },
  welcomeText: {
    fontSize: wp('3.5%'),
    color: '#bfdbfe',
    lineHeight: wp('5%'),
  },
  examStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: wp('3.5%'),
    borderRadius: wp('2.5%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: wp('2%'),
  },
  examStripText: {
    flex: 1,
    color: '#e5e7eb',
    fontSize: wp('3.3%'),
    fontWeight: '600',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    gap: wp('2%'),
  },
  streakText: {color: '#fbbf24', fontSize: wp('3.5%'), fontWeight: '600'},
  dailyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064e3b',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2.5%'),
    borderWidth: 1.5,
    borderColor: '#10b981',
    overflow: 'hidden',
  },
  newsGlowOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#10b98130',
  },
  newsShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: wp('30%'),
    backgroundColor: '#ffffff18',
  },
  dailyLeft: {flex: 1, flexDirection: 'row', alignItems: 'center'},
  dailyIconWrap: {marginRight: wp('3%'), position: 'relative'},
  newDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('1.5%'),
    backgroundColor: '#ef4444',
  },
  dailyTextWrap: {flex: 1},
  dailyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('2%'),
    marginBottom: hp('0.4%'),
  },
  dailyTitle: {fontSize: wp('4.2%'), fontWeight: '800', color: '#fff'},
  newBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.2%'),
    borderRadius: wp('1.5%'),
  },
  newBadgeText: {
    color: '#fff',
    fontSize: wp('2.5%'),
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dailyDesc: {fontSize: wp('3.2%'), color: '#a7f3d0'},
  sectionHeader: {
    fontSize: wp('4%'),
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: hp('1.5%'),
    letterSpacing: 0.5,
  },
  grid: {width: '100%'},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1.2%'),
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  iconWrap: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  cardContent: {flex: 1},
  cardTitle: {fontSize: wp('4%'), fontWeight: '700', color: '#fff'},
  cardSubtitle: {
    fontSize: wp('3.2%'),
    color: '#9ca3af',
    marginTop: hp('0.3%'),
  },
  tier1Card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    marginTop: hp('2.5%'),
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    borderWidth: 1.5,
    borderColor: '#1d4ed8',
    padding: wp('4%'),
  },
  tier1IconWrap: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    backgroundColor: '#1e3a8a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tier1TextWrap: {flex: 1},
  tier1Title: {
    color: '#fff',
    fontWeight: '800',
    fontSize: wp('3.8%'),
    marginBottom: hp('0.3%'),
  },
  tier1Desc: {
    color: '#9ca3af',
    fontSize: wp('3.1%'),
    lineHeight: wp('4.4%'),
    marginBottom: hp('0.6%'),
  },
  tier1Cta: {
    color: '#60a5fa',
    fontWeight: '700',
    fontSize: wp('3.2%'),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
    gap: wp('2%'),
    paddingVertical: hp('2%'),
  },
  footerText: {
    color: '#9ca3af',
    fontSize: wp('3.3%'),
    textAlign: 'center',
    flexShrink: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0b1220cc',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    backgroundColor: '#111827',
    padding: wp('8%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f2937',
    width: wp('70%'),
  },
  loadingText: {
    color: '#e5e7eb',
    fontSize: wp('4%'),
    marginTop: hp('2%'),
    fontWeight: '600',
  },
  loadingBar: {
    width: '100%',
    height: hp('0.8%'),
    backgroundColor: '#1f2937',
    borderRadius: wp('1%'),
    marginTop: hp('2%'),
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    width: '60%',
    backgroundColor: '#3b82f6',
    borderRadius: wp('1%'),
  },
});
