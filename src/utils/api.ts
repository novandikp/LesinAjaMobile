import {CancelToken, create} from 'apisauce';
import {
  setLocalStorage,
  clearLocalStorage,
  getLocalStorage,
} from './localStorage';
import {lsKey} from '@constants';

// apisauce instance with base url
const api = create({
  baseURL: 'http://45.76.149.250:8081/',
});

// for cancel request
const source = CancelToken.source();

type ApiGetFuncType = {
  url: string;
  params?: object;
};
type ApiPostFuncType = {
  url: string;
  payload: object;
  isLogin?: boolean;
};
type ApiPostReturnType = {
  success: boolean;
  data: any;
};

// Post data to api
export const apiPost = async ({
  url,
  payload,
  isLogin,
}: ApiPostFuncType): Promise<ApiPostReturnType> => {
  try {
    const loginToken = await getLocalStorage(lsKey.userToken);
    const {ok, data} = await api.post(url, payload, {
      headers: {Authorization: loginToken},
      cancelToken: source.token,
    });
    // If success
    if (ok) {
      if (isLogin) {
        setLocalStorage(lsKey.userToken, data.data.token);
      }
      return {success: true, data: data.data};
    }

    return {success: false, data: null};
  } catch (error) {
    return {success: false, data: null};
  }
};

// Get data from api
export const apiGet = async ({
  url,
  params,
}: ApiGetFuncType): Promise<ApiPostReturnType> => {
  try {
    const loginToken = await getLocalStorage(lsKey.userToken);

    const {ok, data} = await api.get(url, params, {
      headers: {Authorization: loginToken},
      cancelToken: source.token,
    });

    // If success
    if (ok) {
      return {success: true, data: data.data};
    }

    return {success: false, data: null};
  } catch (error) {
    return {success: false, data: null};
  }
};

// Delete data
export const apiDelete = async ({
  url,
  params,
}: ApiGetFuncType): Promise<ApiPostReturnType> => {
  try {
    const loginToken = await getLocalStorage(lsKey.userToken);

    const {ok, data} = await api.delete(url, params, {
      headers: {Authorization: loginToken},
      cancelToken: source.token,
    });

    // If success
    if (ok) {
      return {success: true, data: data.data};
    }

    return {success: false, data: null};
  } catch (error) {
    return {success: false, data: null};
  }
};

// Cancel any request
export const cancelApiRequest = () => {
  source.cancel();
};

// const apiPost = async ({url, data}) => {
//   // const context = useContext(AuthContext);
//   const loginToken = await getLocalStorage('loginToken');

//   // * Response dari post yang akan di-return oleh function ini
//   const response = await apiInstance
//     .post(url, data, {
//       transformRequest: [
//         reqData => {
//           reqData.token = loginToken;
//           reqData.device = 'android';
//           // console.log({reqData});

//           return reqData;
//         },
//         ...apisauce.defaults.transformRequest,
//       ],
//     })
//     .catch(error => {
//       // * Jika error maka return error message
//       return {error_message: 'Gagal mengambil data'};
//     });

//   // console.log(response);

//   // * Jika response tidak sesuai, tampilkan errornya
//   const {error_message, code, success_message} = response.data.system;
//   if (error_message) {
//     if (code == 999) {
//       navigate('DrawerSettings', {
//         screen: 'Maintenance',
//         params: {error_message},
//       });

//       return {error_message};
//     }

//     if (code == 120 || code == 129) {
//       // * Jika token invalid
//       clearLocalStorage();
//       Alert.alert(
//         'Waktu login telah habis',
//         'Setelah klik "Ok", mohon buka kembali aplikasi dan login ulang',
//         [{text: 'Ok', onPress: BackHandler.exitApp}],
//       );

//       return {error_message};
//     }

//     // * Jika isNoAlert = true, tidak menampilkan alert
//     if (!isNoAlert) {
//       Alert.alert('Kesalahan', error_message, [{text: 'Ok'}]);
//     }

//     return {error_message};
//   } else {
//     // console.log('Pesan Sukses:', success_message);

//     // * Jika data merupakan array, maka buat menjadi object
//     // Agar bisa dimasukkan key success_message
//     // success_message sendiri untuk mengecek apakah action terkait API berhasil
//     let finalResponse;
//     if (Array.isArray(response.data.data)) {
//       finalResponse = {arrData: response.data.data, success_message};
//       // console.log({finalResponse});
//     } else finalResponse = {...response.data.data, success_message};

//     return finalResponse;
//   }
// };

// * Untuk login biasa
// const apiLogin = async data => {
//   // * Response dari post, yang akan di-return oleh function ini
//   const response = await apiInstance
//     .post('authentication/login', data)
//     .catch(error => {
//       consoleDebugError(error);

//       return null;
//     });

//   const {error_message, token} = response.data.system;

//   if (error_message) {
//     Alert.alert('Kesalahan', error_message, [{text: 'Ok'}]);

//     return null;
//   } else {
//     console.log('token:', token);
//     await setLocalStorage('loginToken', token);

//     return response.data.data.companylist;
//   }
// };

// * Untuk Quick Login (login dari url khusus)
// const apiQuickLogin = async data => {
//   // * Response dari post, yang akan di-return oleh function ini
//   const response = await apiInstance
//     .post('authentication/quickLogin', data)
//     .catch(error => {
//       consoleDebugError(error);

//       return {error_message: 'Gagal mengambil data'};
//     });

//   const {error_message, success_message, token, code} = response.data.system;
//   if (error_message) {
//     Alert.alert('Kesalahan', error_message, [{text: 'Ok'}]);
//     console.log('Kode error: ' + code);
//     console.log('Pesan error: ' + error_message);
//     console.log('Data dikirim: ', {url: 'authentication/quickLogin', data});

//     return {error_message};
//   } else {
//     console.log('token:', token);
//     await setLocalStorage('loginToken', token);

//     return {...response.data.data, success_message};
//   }
// };

// export {apiPost, apiLogin, apiQuickLogin};
