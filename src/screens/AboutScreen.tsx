import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  StatusBar,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WHATSAPP_SUPPORT_PHONE} from '../config/support';

export default function AboutScreen() {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();

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
        const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          message,
        )}`;
        return Linking.openURL(webUrl);
      })
      .catch(err => console.error('Error opening WhatsApp:', err));
  };

  const features = [
    {
      icon: 'fountain-pen-tip',
      title: t('feature_1_title'),
      description: t('feature_1_desc'),
      color: '#38bdf8',
    },
    {
      icon: 'book-open-page-variant',
      title: t('feature_2_title'),
      description: t('feature_2_desc'),
      color: '#f472b6',
    },
    {
      icon: 'text-box-outline',
      title: t('feature_3_title'),
      description: t('feature_3_desc'),
      color: '#a78bfa',
    },
    {
      icon: 'calendar-edit',
      title: t('feature_4_title'),
      description: t('feature_4_desc'),
      color: '#10b981',
    },
    {
      icon: 'clipboard-text',
      title: t('feature_5_title'),
      description: t('feature_5_desc'),
      color: '#3b82f6',
    },
    {
      icon: 'lightbulb-on-outline',
      title: t('feature_6_title'),
      description: t('feature_6_desc'),
      color: '#14b8a6',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + hp('2%'),
            paddingBottom: insets.bottom + hp('2%'),
          },
        ]}>
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/homlogo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appTitle}>IB ACIO Tier-2</Text>
          <Text style={styles.appSubtitle}>{t('exam_prep_app')}</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>{t('version_label')}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Icon name="account-group" size={wp('8%')} color="#10b981" />
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>{t('active_users')}</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="star" size={wp('8%')} color="#fbbf24" />
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>{t('rating_label')}</Text>
          </View>
          <View style={styles.statCard}>
            <Icon name="notebook-outline" size={wp('8%')} color="#3b82f6" />
            <Text style={styles.statNumber}>30+</Text>
            <Text style={styles.statLabel}>{t('topics_label')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('features_title')}</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View
                style={[
                  styles.featureIcon,
                  {backgroundColor: feature.color + '20'},
                ]}>
                <Icon
                  name={feature.icon}
                  size={wp('6%')}
                  color={feature.color}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('contact_support')}</Text>
          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleWhatsAppSupport}>
            <View style={styles.contactIcon}>
              <Icon name="whatsapp" size={wp('8%')} color="#25D366" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>{t('whatsapp_support')}</Text>
              <Text style={styles.contactSubtext}>{t('tap_to_chat')}</Text>
            </View>
            <Icon name="chevron-right" size={wp('6%')} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('our_mission')}</Text>
          <View style={styles.missionCard}>
            <Text style={styles.missionText}>{t('mission_text')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('whats_new')}</Text>
          <View style={styles.changelogCard}>
            {[1, 2, 3, 4, 5].map(n => (
              <View key={n} style={styles.changelogItem}>
                <Icon name="check-circle" size={wp('5%')} color="#10b981" />
                <Text style={styles.changelogText}>
                  {t(`changelog_${n}` as any)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('made_with_love')}</Text>
          <Text style={styles.copyrightText}>{t('copyright')}</Text>
          <Text style={styles.disclaimerText}>{t('disclaimer')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0b1220'},
  content: {paddingHorizontal: wp('4%')},
  headerSection: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
    marginBottom: hp('2%'),
  },
  logoContainer: {
    width: wp('28%'),
    height: wp('28%'),
    borderRadius: wp('14%'),
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2%'),
    borderWidth: 3,
    borderColor: '#3b82f6',
    overflow: 'hidden',
  },
  logoImage: {width: wp('18%'), height: wp('18%')},
  appTitle: {
    fontSize: wp('7%'),
    fontWeight: '700',
    color: '#fff',
    marginBottom: hp('0.5%'),
  },
  appSubtitle: {
    fontSize: wp('4%'),
    color: '#9ca3af',
    marginBottom: hp('1%'),
  },
  versionBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('4%'),
  },
  versionText: {color: '#fff', fontSize: wp('3.5%'), fontWeight: '600'},
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    marginHorizontal: wp('1%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  statNumber: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#fff',
    marginTop: hp('1%'),
  },
  statLabel: {fontSize: wp('3%'), color: '#9ca3af', marginTop: hp('0.5%')},
  section: {marginBottom: hp('3%')},
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: '700',
    color: '#fff',
    marginBottom: hp('1.5%'),
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  featureIcon: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  featureContent: {flex: 1, justifyContent: 'center'},
  featureTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#fff',
    marginBottom: hp('0.3%'),
  },
  featureDescription: {fontSize: wp('3.2%'), color: '#9ca3af'},
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 2,
    borderColor: '#25D366',
  },
  contactIcon: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('3%'),
    backgroundColor: '#25D36620',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  contactContent: {flex: 1},
  contactTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#fff',
    marginBottom: hp('0.3%'),
  },
  contactText: {
    fontSize: wp('4%'),
    color: '#25D366',
    fontWeight: '600',
    marginBottom: hp('0.3%'),
  },
  contactSubtext: {fontSize: wp('3%'), color: '#9ca3af'},
  missionCard: {
    backgroundColor: '#111827',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  missionText: {fontSize: wp('3.8%'), color: '#9ca3af', lineHeight: wp('6%')},
  changelogCard: {
    backgroundColor: '#111827',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  changelogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  changelogText: {
    flex: 1,
    fontSize: wp('3.8%'),
    color: '#9ca3af',
    marginLeft: wp('3%'),
  },
  footer: {
    alignItems: 'center',
    paddingVertical: hp('3%'),
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    marginTop: hp('2%'),
  },
  footerText: {
    fontSize: wp('3.5%'),
    color: '#9ca3af',
    marginBottom: hp('0.5%'),
  },
  copyrightText: {
    fontSize: wp('3%'),
    color: '#6b7280',
    marginBottom: hp('1%'),
  },
  disclaimerText: {
    fontSize: wp('2.8%'),
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
    lineHeight: wp('4.5%'),
  },
});
