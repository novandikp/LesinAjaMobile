import DocumentPicker from 'react-native-document-picker';
import {
  Platform,
  PermissionsAndroid,
  Alert,
  ToastAndroid,
  Linking,
} from 'react-native';
import {
  downloadFile,
  ExternalStorageDirectoryPath,
  PicturesDirectoryPath,
} from 'react-native-fs';
/* FIXME:
  `new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
  .WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.
  WARN  EventEmitter.removeListener('keyboardDidShow', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`*/
import {LogBox} from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);
// LogBox.ignoreLogs(['EventEmitter.addListeners']);
LogBox.ignoreLogs(['EventEmitter.removeListener']);

// const RNFS = require('react-native-fs');
export const getSingleDocument = async () => {
  try {
    const [res]: any = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });
    if (res.size < 2500000) {
      return res;
    }
  } catch (err: any) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};
export const getSingleDocumentPDF = async () => {
  try {
    const [res]: any = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    if (res.size < 2500000) {
      return res;
    }
  } catch (err: any) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};
export const checkPersimisson = async (Uri: string) => {
  if (Platform.OS === 'ios') {
    getDownload(Uri);
    // return true;
  } else {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      if (granted['android.permission.READ_EXTERNAL_STORAGE'] == 'granted') {
        //   // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
        getDownload(Uri);
        // return true;
      } else {
        //   // If permission denied then show alert
        Alert.alert('Storage Permission Not Granted');
        console.log('Penyimpan file tidak di ijinkan');
      }
    } catch (err) {
      // To handle permission related exception
      console.warn(err);
      return false;
    }
  }
};
const getDownload = async (Uri: string) => {
  // if (result === true) {
  let url;
  let dir = '';
  let baseURL = 'http://45.76.149.250/';
  if (Uri.includes('.pdf')) {
    url = baseURL + 'cv/' + Uri;
    dir = ExternalStorageDirectoryPath + '/Documents/' + Uri;
  } else {
    url = baseURL + 'bukti/' + Uri;
    dir = PicturesDirectoryPath + '/' + Uri;
  }
  await downloadFile({
    fromUrl: url,
    toFile: dir,
    // toFile: DocumentDirectoryPath + '/' + Uri,
    background: true,
    discretionary: true,
    readTimeout: 600 * 1000,
    connectionTimeout: 1000 * 10,
  })
    .promise.then(status => {
      if (status.statusCode == 200) {
        // TODO: PushNotification
        ToastAndroid.show('File telah diunduh', ToastAndroid.SHORT);
        ToastAndroid.show('File berada di ' + dir, ToastAndroid.LONG);
      }
    })
    .catch(async (err: any) => {
      ToastAndroid.show('Error: ' + err, ToastAndroid.SHORT);
      if (Uri.includes('.pdf')) {
        return await Linking.openURL(baseURL + 'cv/' + Uri);
      } else {
        return await Linking.openURL(baseURL + 'bukti/' + Uri);
      }
    });
};
// };
