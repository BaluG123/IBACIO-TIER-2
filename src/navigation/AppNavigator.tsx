import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import SplashScreen from '../screens/SplashScreen';
import EssayPracticeScreen from '../screens/EssayPracticeScreen';
import EssayTopicScreen from '../screens/EssayTopicScreen';
import EssayWriteScreen from '../screens/EssayWriteScreen';
import ComprehensionPracticeScreen from '../screens/ComprehensionPracticeScreen';
import PassageDetailScreen from '../screens/PassageDetailScreen';
import LongAnswerPracticeScreen from '../screens/LongAnswerPracticeScreen';
import LongAnswerDetailScreen from '../screens/LongAnswerDetailScreen';
import LongAnswerWriteScreen from '../screens/LongAnswerWriteScreen';
import DailyPromptDetailScreen from '../screens/DailyPromptDetailScreen';
import MockDescriptiveScreen from '../screens/MockDescriptiveScreen';
import MockResultScreen from '../screens/MockResultScreen';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  EssayPractice: undefined;
  EssayTopic: {topicId: string};
  EssayWrite: {
    topicId?: string;
    title?: string;
    outline?: string;
    wordTargetMin?: number;
    wordTargetMax?: number;
    suggestedMinutes?: number;
    fromDaily?: boolean;
  };
  ComprehensionPractice: undefined;
  PassageDetail: {passageId: string};
  LongAnswerPractice: undefined;
  LongAnswerDetail: {questionId: string};
  LongAnswerWrite: {
    questionId?: string;
    question?: string;
    modelAnswer?: string;
    wordTargetMin?: number;
    wordTargetMax?: number;
    suggestedMinutes?: number;
    fromDaily?: boolean;
  };
  DailyPromptDetail: {dateKey: string};
  MockDescriptive: {mockId: string};
  MockResult: {
    mockId: string;
    essayText?: string;
    rcAnswers?: Record<string, string>;
    laqAnswers?: Record<string, string>;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {backgroundColor: '#111827'},
        headerTintColor: '#fff',
        contentStyle: {backgroundColor: '#0b1220'},
      }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EssayPractice"
        component={EssayPracticeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EssayTopic"
        component={EssayTopicScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EssayWrite"
        component={EssayWriteScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ComprehensionPractice"
        component={ComprehensionPracticeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PassageDetail"
        component={PassageDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LongAnswerPractice"
        component={LongAnswerPracticeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LongAnswerDetail"
        component={LongAnswerDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LongAnswerWrite"
        component={LongAnswerWriteScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DailyPromptDetail"
        component={DailyPromptDetailScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MockDescriptive"
        component={MockDescriptiveScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MockResult"
        component={MockResultScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
