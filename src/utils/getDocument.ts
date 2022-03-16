import DocumentPicker from 'react-native-document-picker';
import {Platform, PermissionsAndroid, Alert, ToastAndroid} from 'react-native';
import {
  downloadFile,
  DownloadDirectoryPath,
  DocumentDirectoryPath,
  PicturesDirectoryPath,
} from 'react-native-fs';
// const RNFS = require('react-native-fs');
export const getSingleDocument = async () => {
  try {
    const [res]: any = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });

    return res;
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

    return res;
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
  /* FIXME:
 `new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
 .WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.
 WARN  EventEmitter.removeListener('keyboardDidShow', ...): Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`*/
  // let result = await checkPersimisson();
  // if (result === true) {
  let url;
  let dir;
  if (Uri.includes('.pdf')) {
    url = 'http://45.76.149.250:8081/cv/' + Uri;
    dir = DocumentDirectoryPath + '/' + Uri;
  } else {
    url = 'http://45.76.149.250:8081/bukti/' + Uri;
    dir = PicturesDirectoryPath + '/' + Uri;
  }
  console.log(DownloadDirectoryPath);
  console.log(url);
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
        console.log('file telah diunduh');
        ToastAndroid.show('File telah diunduh', ToastAndroid.SHORT);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
// };
