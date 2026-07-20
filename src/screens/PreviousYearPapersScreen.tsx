import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WebView} from 'react-native-webview';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Paper = {
  id: number;
  year: number;
  title: string;
  date: string;
  note: string;
  duration: string;
  url: string;
  icon: string;
  color: string;
};

export default function PreviousYearPapersScreen() {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(false);

  // Tier-2 descriptive — most years Coming Soon; a few Drive /preview placeholders
  const papers: Paper[] = [
    {
      id: 1,
      year: 2024,
      title: 'IB ACIO Tier-2 Descriptive 2024',
      date: '2024 cycle',
      note: 'Essay + RC + LAQs',
      duration: '60 minutes',
      url: '',
      icon: 'file-document',
      color: '#3b82f6',
    },
    {
      id: 2,
      year: 2023,
      title: 'IB ACIO Tier-2 Descriptive 2023',
      date: '2023 cycle',
      note: 'Descriptive paper',
      duration: '60 minutes',
      url: '',
      icon: 'file-document',
      color: '#10b981',
    },
    {
      id: 3,
      year: 2021,
      title: 'IB ACIO Related Paper 2021',
      date: 'Reference (Tier-1 style)',
      note: 'Placeholder Drive link',
      duration: '60 minutes',
      url: 'https://drive.google.com/file/d/1nOTUdyIcOFgZNtpk5KtvDQv_NDztLD77/preview',
      icon: 'file-document',
      color: '#ef4444',
    },
    {
      id: 4,
      year: 2020,
      title: 'IB ACIO Tier-2 Descriptive 2020',
      date: '2020 cycle',
      note: 'Descriptive paper',
      duration: '60 minutes',
      url: '',
      icon: 'file-document',
      color: '#a78bfa',
    },
    {
      id: 5,
      year: 2014,
      title: 'IB ACIO Related Paper 2014',
      date: 'Reference placeholder',
      note: 'Not official Tier-2 PDF',
      duration: '60 minutes',
      url: 'https://drive.google.com/file/d/1tG6XZ2cVcyzmeAK26KsBbAtlOYP7FgY0/preview',
      icon: 'file-document',
      color: '#f472b6',
    },
    {
      id: 6,
      year: 2013,
      title: 'IB ACIO Related Paper 2013',
      date: 'Reference placeholder',
      note: 'Not official Tier-2 PDF',
      duration: '60 minutes',
      url: 'https://drive.google.com/file/d/1B4jHrq-hXR9IsnNvuzElvLTFFOCFcxkv/preview',
      icon: 'file-document',
      color: '#38bdf8',
    },
    {
      id: 7,
      year: 2012,
      title: 'IB ACIO Tier-2 Descriptive 2012',
      date: '2012 cycle',
      note: 'Coming soon — Tier-2 descriptive',
      duration: '60 minutes',
      url: '',
      icon: 'file-document',
      color: '#22c55e',
    },
  ];

  const handlePaperPress = (paper: Paper) => {
    if (!paper.url) {
      return;
    }
    setSelectedPaper(paper);
  };

  const closePDFViewer = () => {
    setSelectedPaper(null);
    setLoading(false);
  };

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
          <Icon
            name="file-document-multiple"
            size={wp('12%')}
            color="#3b82f6"
          />
          <Text style={styles.headerTitle}>{t('previous_year_papers')}</Text>
          <Text style={styles.headerSubtitle}>{t('pyp_subtitle')}</Text>
        </View>

        <View style={styles.papersContainer}>
          {papers.map(paper => (
            <TouchableOpacity
              key={paper.id}
              style={[styles.paperCard, {borderLeftColor: paper.color}]}
              onPress={() => handlePaperPress(paper)}
              activeOpacity={0.7}>
              <View style={styles.paperHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: paper.color + '20'},
                  ]}>
                  <Icon name={paper.icon} size={wp('8%')} color={paper.color} />
                </View>
                <View style={styles.paperInfo}>
                  <Text style={styles.paperTitle}>{paper.title}</Text>
                  <Text style={styles.paperDate}>{paper.date}</Text>
                </View>
                {!paper.url && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>{t('will_add_soon')}</Text>
                  </View>
                )}
              </View>

              <View style={styles.paperDetails}>
                <View style={styles.detailItem}>
                  <Icon name="text-box-outline" size={wp('4%')} color="#9ca3af" />
                  <Text style={styles.detailText}>{paper.note}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="clock-outline" size={wp('4%')} color="#9ca3af" />
                  <Text style={styles.detailText}>{paper.duration}</Text>
                </View>
              </View>

              {paper.url ? (
                <View style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>{t('view_paper')}</Text>
                  <Icon name="arrow-right" size={wp('4%')} color="#3b82f6" />
                </View>
              ) : (
                <View style={styles.unavailableButton}>
                  <Icon name="clock-outline" size={wp('4%')} color="#9ca3af" />
                  <Text style={styles.unavailableText}>{t('coming_soon')}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Icon name="information" size={wp('5%')} color="#3b82f6" />
          <Text style={styles.noteText}>{t('pyp_note')}</Text>
        </View>
      </ScrollView>

      <Modal
        visible={selectedPaper !== null}
        animationType="slide"
        onRequestClose={closePDFViewer}>
        <View style={[styles.modalContainer, {paddingTop: insets.top}]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={closePDFViewer}>
              <Icon name="close" size={wp('6%')} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedPaper?.title}</Text>
            <View style={{width: wp('10%')}} />
          </View>

          {selectedPaper?.url ? (
            <>
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text style={styles.loadingText}>{t('loading_pdf')}</Text>
                </View>
              )}
              <WebView
                source={{uri: selectedPaper.url}}
                style={styles.webview}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  Alert.alert(
                    'Error',
                    'Failed to load PDF. Please check your internet connection.',
                  );
                }}
              />
            </>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0b1220'},
  content: {paddingHorizontal: wp('4%')},
  headerSection: {
    alignItems: 'center',
    marginBottom: hp('3%'),
    paddingVertical: hp('2%'),
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: '700',
    color: '#fff',
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  headerSubtitle: {
    fontSize: wp('3.5%'),
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  papersContainer: {marginBottom: hp('2%')},
  paperCard: {
    backgroundColor: '#111827',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderLeftWidth: 4,
  },
  paperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  iconContainer: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('3%'),
  },
  paperInfo: {flex: 1},
  paperTitle: {
    fontSize: wp('4.2%'),
    fontWeight: '700',
    color: '#fff',
    marginBottom: hp('0.5%'),
  },
  paperDate: {fontSize: wp('3.5%'), color: '#9ca3af'},
  comingSoonBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('1.5%'),
  },
  comingSoonText: {color: '#fff', fontSize: wp('2.8%'), fontWeight: '600'},
  paperDetails: {
    flexDirection: 'row',
    marginBottom: hp('1.5%'),
    gap: wp('4%'),
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
  },
  detailText: {color: '#9ca3af', fontSize: wp('3.3%')},
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a8a',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    gap: wp('2%'),
  },
  viewButtonText: {color: '#3b82f6', fontSize: wp('4%'), fontWeight: '600'},
  unavailableButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('2%'),
    gap: wp('2%'),
  },
  unavailableText: {color: '#9ca3af', fontSize: wp('3.5%')},
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#1e3a8a',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    gap: wp('3%'),
  },
  noteText: {
    flex: 1,
    color: '#bfdbfe',
    fontSize: wp('3.5%'),
    lineHeight: wp('5%'),
  },
  modalContainer: {flex: 1, backgroundColor: '#0b1220'},
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('4%'),
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  closeButton: {padding: wp('2%')},
  modalTitle: {
    flex: 1,
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  webview: {flex: 1, backgroundColor: '#fff'},
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1220',
    zIndex: 1,
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: wp('4%'),
    marginTop: hp('2%'),
  },
});
