import {lsKey} from '@constants';
import {apiPost, clearLocalStorage, setLocalStorage} from '@utils';
import React, {createContext, useCallback, useReducer} from 'react';
import {FC} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
// Types
type ContextType = {
  state: {
    userRole: '' | 'admin' | 'tutor' | 'parent';
    userInfo: any;
  };
  login: (userInfo: any) => Promise<{isRegistered: boolean}>;
  register: (
    posisi: number,
    refrensi: string,
  ) => Promise<{isRegistered: boolean}>;
  setUserRole: (value: string, setLs?: boolean) => Promise<void>;
  logout: () => Promise<void>;
};

// * initial Value
const initialValue: ContextType = {
  state: {
    userRole: '',
    userInfo: {},
  },
  login: async () => ({isRegistered: false}),
  register: async () => ({isRegistered: false}),
  setUserRole: async () => {},
  logout: async () => {},
};

// * Reducer
type Actions = {
  type: 'SET_USER_TOKEN' | 'SET_USER_ROLE' | 'SET_USER_INFO';
  userRole?: string;
  userInfo?: any;
};
const reducer = (state: any, action: Actions) => {
  switch (action.type) {
    case 'SET_USER_ROLE':
      return {...state, userRole: action.userRole};
    case 'SET_USER_INFO':
      return {...state, userInfo: action.userInfo};

    default:
      return state;
  }
};

export const AuthContext = createContext<ContextType>(initialValue);
export const AuthProvider: FC = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialValue.state);

  const setUserRole = useCallback(async (value: string, setLs?: boolean) => {
    if (setLs) {
      await setLocalStorage(lsKey.userRole, value);
    }
    dispatch({type: 'SET_USER_ROLE', userRole: value});
  }, []);

  const login = async (userInfo: any) => {
    const {success, data} = await apiPost({
      url: 'auth/login',
      payload: {token: userInfo.idToken},
      isLogin: true,
    });

    // If user has account, login, otherwise register
    if (success) {
      if (data.posisi) {
        setUserRole(data.posisi == 'Wali' ? 'parent' : 'tutor', true);
        return {isRegistered: true};
      }
      dispatch({type: 'SET_USER_INFO', userInfo});
    }

    return {isRegistered: false};
  };

  const register = async (posisi: number, refrensi: string) => {
    const {success, data} = await apiPost({
      url: 'auth/register',
      payload: {email: state.userInfo.user.email, posisi},
    });
    if (success) {
      setLocalStorage(lsKey.userToken, data.token);
      apiPost({
        url: 'wali/refrensi',
        payload: {refrensi: refrensi},
      });
      return {isRegistered: true, data: data};
    }

    return {isRegistered: true};
  };

  const logout = async () => {
    if (state.userRole == 'parent' || state.userRole == 'tutor') {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
    await clearLocalStorage();
    setUserRole('', false);
  };

  return (
    <AuthContext.Provider value={{state, setUserRole, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
