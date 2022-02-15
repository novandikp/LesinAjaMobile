import DocumentPicker from 'react-native-document-picker';

// Pick a single files
export const getSingleDocument = async () => {
  try {
    const [res]: any = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });

    return res;
  } catch (err) {
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
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
    } else {
      throw err;
    }
  }
};
