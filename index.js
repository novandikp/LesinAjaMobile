/**
 * @format
 */

import NotificationManager from '@utils/notificationManager';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

NotificationManager.getInstance();
AppRegistry.registerComponent(appName, () => App);