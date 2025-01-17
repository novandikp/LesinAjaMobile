import React, {FC, useContext, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {dimens} from '@constants';
import {Icon} from 'react-native-elements';
import {Card, Dialog, Paragraph, Portal} from 'react-native-paper';
import {AuthContext} from '@context/AuthContext';
import {Button, Subheading, Text, Title} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {LogoLesinAja} from '@assets';
import {Picker} from '@react-native-picker/picker';

import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Gap, StandardDialog} from '@components';
import Modal from 'react-native-modal';

type ScreenProps = StackScreenProps<AppStackParamList, 'LoginGeneral'>;
// Login screen for Parent and Tutor
export const LoginGeneral: FC<ScreenProps> = ({navigation: {navigate}}) => {
  const [showChooseRole, setShowChooseRole] = useState(false);
  // refrensi
  const [showRefrensi, setShowRefrensi] = useState(false);
  const [refrensi, setRefrensi] = useState<string>('-');

  const {login, register, setUserRole, logout} = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  // When user presses sign in with google
  const onPressLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      // scopes, serverAuthCode, idToken, user
      const userInfo = await GoogleSignin.signIn();
      // Try to login
      const {isRegistered} = await login(userInfo);
      if (!isRegistered) {
        setShowRefrensi(true);
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available or outdated');
      } else {
        console.log(error);
        // some other error happened
      }
    }
  };

  // If user is not registerd, choose role
  const onChooseRole = async (role: 1 | 2, chooseRefrensi: string) => {
    setShowChooseRole(false);
    const {isRegistered} = await register(role, chooseRefrensi);
    if (isRegistered) {
      setUserRole(role === 1 ? 'tutor' : 'parent', true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      {/* Choose role */}
      <StandardDialog
        visible={showChooseRole}
        title="Selamat datang di Lesin Aja!"
        description="Apakah Anda seorang wali murid atau tutor?"
        action1Text="Wali Murid"
        onPressAction1={() => {
          onChooseRole(2, refrensi);
        }}
        action2Text="Tutor"
        onPressAction2={() => {
          onChooseRole(1, refrensi);
        }}
      />
      <Portal>
        <Dialog visible={showRefrensi}>
          <Dialog.Title>
            Mohon isi Formulir Pendaftaran terlebih dahaulu
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph>Tahu LesinAja Darimana? </Paragraph>
            <Picker
              style={{flex: 2}}
              mode="dropdown"
              selectedValue={refrensi}
              dropdownIconColor={'grey'}
              dropdownIconRippleColor={'grey'}
              itemStyle={{height: 10, backgroundColor: 'white'}}
              onValueChange={itemValue => setRefrensi(itemValue)}>
              <Picker.Item label="Silahkan pilih" value="-" />

              <Picker.Item label="Google" value="Google" />
              <Picker.Item label="Tiktok" value="Tiktok" />
              <Picker.Item label="Instagram" value="Instagram" />
              <Picker.Item label="Facebook" value="Facebook" />
              <Picker.Item label="Youtube" value="Youtube" />
              <Picker.Item label="Teman" value="Teman" />
            </Picker>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                if (refrensi != '-') {
                  setShowRefrensi(false);
                  setShowChooseRole(true);
                }
              }}>
              Kirim
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: dimens.standard}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Gap y={70} />
          {/* Logo */}
          <Image
            source={LogoLesinAja}
            style={{width: 300, height: 120, resizeMode: 'contain'}}
          />
          <Title style={{marginTop: dimens.medium}}>Selamat Datang!</Title>
          <Subheading style={{marginTop: dimens.small}}>
            Masuk dengan akun Google untuk melanjutkan.
          </Subheading>
        </View>

        <View
          style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
          <GoogleSigninButton
            style={{height: 48, width: '90%'}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={onPressLogin}
            disabled={false}
          />
          <Gap y={30} />

          <Text style={{marginTop: dimens.medium}}>atau</Text>
          <Button
            labelStyle={{fontSize: dimens.standard}}
            onPress={() => {
              navigate('LoginAdmin');
            }}>
            Masuk sebagai Admin
          </Button>
          <Gap y={50} />
        </View>
      </ScrollView>

      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}>
          {/* <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              alignItems: 'center',
              alignContent: 'center',
              borderRadius: 20,
              maxHeight: 250,
              maxWidth: 500,
            }}> */}
          {/* <View style={{paddingTop: 10}}>
            
          </View>*/}
          <Card
            style={{
              borderRadius: 25,
              minHeight: 100,
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <View>
                <Icon name="cancel" solid={true} size={100} />
              </View>
              <Text style={{fontSize: 24, paddingTop: 10, paddingBottom: 10}}>
                Token Tidak Valid
              </Text>
            </View>
          </Card>
          {/* </View> */}
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
});
