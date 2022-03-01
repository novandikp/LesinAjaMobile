import React, {useContext} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  HomeAdmin,
  // Les,
  ListLes,
  ListMaster,
  ListTutor,
  ListWalmur,
  Laporan,
  RiwayatPembayaran,
  KonfirmasiPembayaran,
} from '@screens';
import {AdminDrawerParamList} from './RouteTypes';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Title} from 'react-native-paper';
import {dimens} from '@constants';
import {AuthContext} from '@context/AuthContext';

const DrawerContainer = createDrawerNavigator<AdminDrawerParamList>();

export const AdminDrawer = () => {
  return (
    <DrawerContainer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#000',
        drawerActiveBackgroundColor: '#FCD34D',
        headerShown: false,
      }}>
      <DrawerContainer.Screen
        name="HomeAdmin"
        component={HomeAdmin}
        options={{
          drawerIcon: () => <MaterialCommunityIcons name="home" size={26} />,
          drawerLabel: 'Beranda Admin',
        }}
      />
      <DrawerContainer.Screen
        name="ListMaster"
        component={ListMaster}
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons name="database" size={26} />
          ),
          drawerLabel: 'Daftar Master',
        }}
      />
      <DrawerContainer.Screen
        name="ListTutor"
        component={ListTutor}
        options={{
          drawerIcon: () => <MaterialCommunityIcons name="teach" size={26} />,
          drawerLabel: 'Daftar Tutor',
        }}
      />
      <DrawerContainer.Screen
        name="ListWalmur"
        component={ListWalmur}
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons name="account-child" size={26} />
          ),
          drawerLabel: 'Daftar Wali Murid',
        }}
      />
      <DrawerContainer.Screen
        name="ListLes"
        component={ListLes}
        options={{
          drawerIcon: () => <MaterialCommunityIcons name="school" size={26} />,
          drawerLabel: 'Daftar Les',
        }}
      />
      <DrawerContainer.Screen
        name="KonfirmasiPembayaran"
        component={KonfirmasiPembayaran}
        options={{
          drawerIcon: () => <MaterialCommunityIcons name="check" size={26} />,
        }}
      />
      <DrawerContainer.Screen
        name="RiwayatPembayaran"
        component={RiwayatPembayaran}
        options={{
          drawerIcon: () => <MaterialCommunityIcons name="wallet" size={26} />,
        }}
      />
      <DrawerContainer.Screen
        name="Laporan"
        component={Laporan}
        options={{
          drawerIcon: () => (
            <MaterialCommunityIcons name="file-document" size={26} />
          ),
        }}
      />
    </DrawerContainer.Navigator>
  );
};

const CustomDrawerContent = (props: any) => {
  const {logout} = useContext(AuthContext);

  return (
    <>
      <DrawerContentScrollView {...props}>
        <Title
          style={{marginLeft: dimens.small_10, marginBottom: dimens.small_10}}>
          Halo Admin
        </Title>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <DrawerItem
        label="Keluar"
        onPress={logout}
        icon={() => <MaterialCommunityIcons name="logout" size={26} />}
      />
    </>
  );
};
