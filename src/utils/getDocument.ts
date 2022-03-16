import DocumentPicker from 'react-native-document-picker';
import {Platform, PermissionsAndroid, Alert, ToastAndroid} from 'react-native';
import {downloadFile, DownloadDirectoryPath} from 'react-native-fs';
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
const checkPersimisson = async () => {
  if (Platform.OS === 'ios') {
    // getDownload(Uri);
    return true;
  } else {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      if (granted['android.permission.READ_EXTERNAL_STORAGE'] == 'granted') {
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   // Once user grant the permission start downloading
        console.log('Storage Permission Granted.');
        return true;
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
export const getDownload = async (Uri: string) => {
  {/*
 `new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.
 WARN  `new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.
 WARN  EventEmitter.removeListener('keyboardDidShow', ...): 
 Method has been deprecated. Please instead use `remove()` on the subscription returned by `EventEmitter.addListener`.*/

  let result = await checkPersimisson();
  // public.image" | "image/*" | ".jpeg .jpg .png"
  // console.log(Uri.includes('.pdf'));
  // const ext=Uri.indexOf(".pdf")
  // const ext = url.indexOf(".jpg") !== -1 ? ".jpg" : ".pdf";
  if (result === true) {
    let url;
    if (Uri.includes('.pdf')) {
      url = 'http://45.76.149.250:8081/cv/' + Uri;
    } else {
      url = 'http://45.76.149.250:8081/bukti/' + Uri;
    }
    //
    await downloadFile({
      fromUrl: url,
      toFile: DownloadDirectoryPath + '/' + Uri,
      background: true,
      discretionary: true,
      readTimeout: 600 * 1000,
      connectionTimeout: 1000 * 10,
    })
      .promise.then(status => {
        if (status.statusCode == 200) {
          ToastAndroid.show('File telah diunduh', ToastAndroid.SHORT);
        }
      })
      .catch((err: any) => {
        console.log(err);
        return false;
      });
  } else {
    console.log('result==false');
    return false;
  }
};
