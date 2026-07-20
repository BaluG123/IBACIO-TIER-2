import React, {createContext, useCallback, useContext, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  Modal,
  Animated,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import DailyWritingScreen from '../screens/DailyWritingScreen';
import PracticeHubScreen from '../screens/PracticeHubScreen';
import DescriptiveMocksScreen from '../screens/DescriptiveMocksScreen';
import ModelAnswersScreen from '../screens/ModelAnswersScreen';
import PreviousYearPapersScreen from '../screens/PreviousYearPapersScreen';
import AboutScreen from '../screens/AboutScreen';
import {WHATSAPP_SUPPORT_PHONE} from '../config/support';
import {TIER1_PLAY_STORE_URL, TIER2_PLAY_STORE_URL} from '../config/playStore';

type DrawerCtx = {
  openDrawer: () => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerCtx>({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function useAppDrawer() {
  return useContext(DrawerContext);
}

type MenuItem = {
  name: string;
  labelKey: string;
  icon: string;
};

const MENU: MenuItem[] = [
  {name: 'HomeDrawer', labelKey: 'home', icon: 'home'},
  {name: 'DailyPromptsDrawer', labelKey: 'daily_prompts', icon: 'calendar-edit'},
  {name: 'PracticeDrawer', labelKey: 'practice_hub', icon: 'pencil-box-multiple'},
  {name: 'MockTestsDrawer', labelKey: 'mock_tests', icon: 'clipboard-text'},
  {name: 'ModelAnswersDrawer', labelKey: 'model_answers', icon: 'lightbulb-on'},
  {name: 'PreviousYearPapers', labelKey: 'previous_year_papers', icon: 'file-document'},
  {name: 'About', labelKey: 'about', icon: 'information'},
];

const Stack = createNativeStackNavigator();

function SideMenu({
  visible,
  onClose,
  activeRoute,
  navigateTo,
}: {
  visible: boolean;
  onClose: () => void;
  activeRoute: string;
  navigateTo: (name: string) => void;
}) {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(-wp('78%'))).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slide, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      slide.setValue(-wp('78%'));
    }
  }, [visible, slide]);

  const handleWhatsAppSupport = () => {
    const phoneNumber = WHATSAPP_SUPPORT_PHONE;
    const message = t('whatsapp_help_message');
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message,
    )}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
        return Linking.openURL(
          `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        );
      })
      .catch(() => {});
  };

  const handleCheckForUpdate = () => {
    Linking.openURL(TIER2_PLAY_STORE_URL).catch(() => {});
  };

  const openTier1PlayStore = () => {
    Linking.openURL(TIER1_PLAY_STORE_URL).catch(() => {});
  };

  const go = (name: string) => {
    onClose();
    setTimeout(() => navigateTo(name), 60);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.drawerPanel,
            {paddingTop: insets.top, transform: [{translateX: slide}]},
          ]}>
          <ScrollView contentContainerStyle={{paddingBottom: insets.bottom + hp('2%')}}>
            <View style={styles.drawerHeader}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/homlogo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appTitle}>IB ACIO Tier-2</Text>
              <Text style={styles.appSubtitle}>{t('exam_preparation')}</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>v1.0</Text>
              </View>
            </View>

            <View style={styles.drawerItems}>
              {MENU.map(item => {
                const active = activeRoute === item.name;
                return (
                  <TouchableOpacity
                    key={item.name}
                    style={[styles.menuItem, active && styles.menuItemActive]}
                    onPress={() => go(item.name)}
                    activeOpacity={0.75}>
                    <Icon
                      name={item.icon}
                      size={wp('5.5%')}
                      color={active ? '#3b82f6' : '#9ca3af'}
                    />
                    <Text
                      style={[styles.menuLabel, active && styles.menuLabelActive]}>
                      {t(item.labelKey)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.drawerFooter}>
              <TouchableOpacity style={styles.tier1Button} onPress={openTier1PlayStore}>
                <Icon name="google-play" size={wp('6%')} color="#60a5fa" />
                <View style={styles.updateTextContainer}>
                  <Text style={styles.updateTitle}>{t('tier1_drawer_title')}</Text>
                  <Text style={styles.updateSubtitle}>{t('tier1_drawer_sub')}</Text>
                </View>
                <Icon name="open-in-new" size={wp('5%')} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.updateButton} onPress={handleCheckForUpdate}>
                <Icon name="update" size={wp('6%')} color="#3b82f6" />
                <View style={styles.updateTextContainer}>
                  <Text style={styles.updateTitle}>{t('check_for_update')}</Text>
                  <Text style={styles.updateSubtitle}>{t('get_latest_version')}</Text>
                </View>
                <Icon name="chevron-right" size={wp('5%')} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.supportButton} onPress={handleWhatsAppSupport}>
                <Icon name="whatsapp" size={wp('6%')} color="#25D366" />
                <View style={styles.supportTextContainer}>
                  <Text style={styles.supportTitle}>{t('need_help')}</Text>
                  <Text style={styles.supportSubtitle}>{t('chat_whatsapp')}</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Icon name="account-group" size={wp('5%')} color="#10b981" />
                  <Text style={styles.statText}>{t('users_count')}</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="star" size={wp('5%')} color="#fbbf24" />
                  <Text style={styles.statText}>{t('rating')}</Text>
                </View>
              </View>

              <Text style={styles.footerText}>{t('made_with_love')}</Text>
              <Text style={styles.copyrightText}>© 2026 IB ACIO Tier-2 Prep</Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

function NavigationCapture({
  onReady,
}: {
  onReady: (navigate: (name: string) => void) => void;
}) {
  const navigation = useNavigation<any>();
  React.useEffect(() => {
    onReady((name: string) => {
      // Reset to target so back stack stays clean for main tabs
      navigation.navigate(name);
    });
  }, [navigation, onReady]);
  return null;
}

function HomeWithNavCapture({
  onNavigateReady,
  ...props
}: {
  onNavigateReady: (navigate: (name: string) => void) => void;
  [key: string]: unknown;
}) {
  return (
    <>
      <NavigationCapture onReady={onNavigateReady} />
      <HomeScreen {...(props as any)} />
    </>
  );
}

function MainStack({
  onRouteChange,
  onNavigateReady,
}: {
  onRouteChange: (name: string) => void;
  onNavigateReady: (navigate: (name: string) => void) => void;
}) {
  const {t} = useTranslation();
  const HomeScreenBound = useCallback(
    (props: any) => (
      <HomeWithNavCapture {...props} onNavigateReady={onNavigateReady} />
    ),
    [onNavigateReady],
  );

  return (
    <Stack.Navigator
      initialRouteName="HomeDrawer"
      screenOptions={{
        headerStyle: {backgroundColor: '#111827'},
        headerTintColor: '#fff',
        headerShadowVisible: false,
        contentStyle: {backgroundColor: '#0b1220'},
      }}
      screenListeners={{
        state: e => {
          const state = e.data.state;
          const route = state?.routes?.[state.index || 0];
          if (route?.name) {
            onRouteChange(route.name);
          }
        },
      }}>
      <Stack.Screen
        name="HomeDrawer"
        component={HomeScreenBound}
        options={{headerShown: false, title: t('home')}}
      />
      <Stack.Screen
        name="DailyPromptsDrawer"
        component={DailyWritingScreen}
        options={{headerShown: false, title: t('daily_prompts')}}
      />
      <Stack.Screen
        name="PracticeDrawer"
        component={PracticeHubScreen}
        options={{headerShown: false, title: t('practice_hub')}}
      />
      <Stack.Screen
        name="MockTestsDrawer"
        component={DescriptiveMocksScreen}
        options={{headerShown: false, title: t('mock_tests')}}
      />
      <Stack.Screen
        name="ModelAnswersDrawer"
        component={ModelAnswersScreen}
        options={{headerShown: false, title: t('model_answers')}}
      />
      <Stack.Screen
        name="PreviousYearPapers"
        component={PreviousYearPapersScreen}
        options={{title: t('previous_year_papers')}}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{title: t('about')}}
      />
    </Stack.Navigator>
  );
}

/** Custom side menu — no react-native-reanimated (avoids Worklets native crashes on RN 0.86). */
export default function DrawerNavigator() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('HomeDrawer');
  const navigateRef = useRef<(name: string) => void>(() => {});

  const openDrawer = useCallback(() => setMenuOpen(true), []);
  const closeDrawer = useCallback(() => setMenuOpen(false), []);
  const ctx = useMemo(() => ({openDrawer, closeDrawer}), [openDrawer, closeDrawer]);
  const onNavigateReady = useCallback((navigate: (name: string) => void) => {
    navigateRef.current = navigate;
  }, []);

  return (
    <DrawerContext.Provider value={ctx}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <MainStack
        onRouteChange={setActiveRoute}
        onNavigateReady={onNavigateReady}
      />
      <SideMenu
        visible={menuOpen}
        onClose={closeDrawer}
        activeRoute={activeRoute}
        navigateTo={name => navigateRef.current(name)}
      />
    </DrawerContext.Provider>
  );
}

const styles = StyleSheet.create({
  modalRoot: {flex: 1, flexDirection: 'row'},
  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.55)'},
  drawerPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: wp('78%'),
    backgroundColor: '#0b1220',
    borderRightWidth: 1,
    borderRightColor: '#1f2937',
  },
  drawerHeader: {
    padding: wp('5%'),
    paddingBottom: hp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  logoContainer: {
    width: wp('24%'),
    height: wp('24%'),
    borderRadius: wp('12%'),
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
    borderWidth: 2,
    borderColor: '#3b82f6',
    overflow: 'hidden',
  },
  logoImage: {width: wp('16%'), height: wp('16%')},
  appTitle: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#fff',
    marginBottom: hp('0.5%'),
  },
  appSubtitle: {
    fontSize: wp('3.5%'),
    color: '#9ca3af',
    marginBottom: hp('1%'),
  },
  versionBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('3%'),
  },
  versionText: {color: '#fff', fontSize: wp('3%'), fontWeight: '600'},
  drawerItems: {paddingTop: hp('2%'), paddingHorizontal: wp('3%')},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  menuItemActive: {backgroundColor: '#1e3a8a'},
  menuLabel: {color: '#9ca3af', fontSize: wp('4%'), fontWeight: '600', flex: 1},
  menuLabelActive: {color: '#3b82f6'},
  drawerFooter: {
    padding: wp('5%'),
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    marginTop: hp('2%'),
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1.5,
    borderColor: '#3b82f6',
  },
  tier1Button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1.5%'),
    borderWidth: 1.5,
    borderColor: '#1d4ed8',
  },
  updateTextContainer: {marginLeft: wp('3%'), flex: 1},
  updateTitle: {color: '#fff', fontSize: wp('4%'), fontWeight: '700'},
  updateSubtitle: {
    color: '#9ca3af',
    fontSize: wp('3%'),
    marginTop: hp('0.3%'),
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#25D366',
  },
  supportTextContainer: {marginLeft: wp('3%'), flex: 1},
  supportTitle: {color: '#fff', fontSize: wp('4%'), fontWeight: '600'},
  supportSubtitle: {color: '#9ca3af', fontSize: wp('3%')},
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('2%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#111827',
    borderRadius: wp('2%'),
  },
  statItem: {flexDirection: 'row', alignItems: 'center', gap: wp('2%')},
  statText: {color: '#fff', fontSize: wp('3.5%'), fontWeight: '600'},
  footerText: {
    color: '#9ca3af',
    fontSize: wp('3%'),
    textAlign: 'center',
    marginBottom: hp('0.5%'),
  },
  copyrightText: {
    color: '#6b7280',
    fontSize: wp('2.5%'),
    textAlign: 'center',
  },
});
