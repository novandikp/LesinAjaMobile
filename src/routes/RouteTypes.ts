import {StudentType} from '@constants';
import {NavigatorScreenParams} from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Les: undefined;
  Settings: undefined;
  LesTutor: undefined;
  InfoPerpanjang: undefined;
  Latihan: undefined;
  Lowongan: undefined;
};

export type AdminDrawerParamList = {
  HomeAdmin: undefined;
  ListTutor: undefined;
  ListWalmur: undefined;
  ListMaster: undefined;
  ListLes: undefined;
  Laporan: undefined;
  PembayaranTutor: undefined;
  KonfirmasiPembayaran: undefined;
  ListStudentAdmin: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  AdminDrawer: NavigatorScreenParams<AdminDrawerParamList>;
  Account: undefined;
  AccountTutor: undefined;
  HistoryPembayaran: undefined;
  RiwayatPembayaran: undefined;
  Les: undefined;
  InputLaporan: undefined;
  LoginAdmin: undefined;
  LoginGeneral: undefined;
  ListStudents: undefined;
  InfoPerpanjang: undefined;
  EditStudent: undefined | {item: StudentType};
  AddLes: undefined;
  DetailLes: undefined;
  DetailTutor: undefined;
  Latihan: undefined;
  Soal: undefined;
  DetailPresensi: undefined;
  DetailLowongan: undefined;
  DetailLesTutor: undefined;
  DetailWalmur: undefined;
  DetailListMaster: undefined;
  EditListMaster: undefined;
  EditListLes: undefined;
};
