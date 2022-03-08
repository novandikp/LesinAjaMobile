import React, {FC, useEffect, useState} from 'react';
import {
  ButtonFormSubmit,
  Header,
  InputChoice,
  InputText,
  SkeletonLoading,
} from '@components';
import {TextInput} from 'react-native-paper';
import {color, dimens} from '@constants';
import {Card} from 'react-native-paper';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Icon} from 'react-native-elements';
import Modal from 'react-native-modal';
import {
  SafeAreaView,
  StatusBar,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiGet, apiPostFile, getSingleDocumentPDF} from '@utils';
import {getListDaerah} from '@utils/getListData';

type FormDataType = {
  idprovinsi: string;
  idkabupaten: string;
  idkecamatan: string;
  iddesa: string;
  alamat: string;
  telp: string;
  perguruantinggi: string;
  jurusan: string;
  mapel: string;
  pernahmengajar: string;
  lokasimengajar: string;
  lamamengajar: string;
  rekening: string;
  bank: string;
  file_cv: string;
  guru: string;
  jeniskelaminguru: string;
};

type ScreenProps = StackScreenProps<AppStackParamList, 'Account'>;

export const AccountTutor: FC<ScreenProps> = () => {
  const listJenis = [
    {id: '00', name: 'Perempuan'},
    {id: '01', name: 'Pria'},
  ];
  const listBank = [
    {id: '00', name: 'BCA'},
    {id: '01', name: 'BRI'},
    {id: '02', name: 'BNI'},
  ];
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormDataType>({mode: 'onChange'});
  const [listDaerah, setListDaerah] = useState({
    provinsi: [],
    kota: [],
    kecamatan: [],
    desa: [],
  });
  const [file, setFile] = useState<any>();
  const [isModalVisible, setModalVisible] = useState(false);

  const [selectedDaerah, setSelectedDaerah] = useState({
    provinsi: '',
    kota: '',
    kecamatan: '',
    desa: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [oldData, setOldData] = useState({
    idprovinsi: '',
    idkabupaten: '',
    idkecamatan: '',
    iddesa: '',
    alamat: '',
    telp: '',
    perguruantinggi: '',
    jurusan: '',
    mapel: '',
    pernahmengajar: '',
    lokasimengajar: '',
    lamamengajar: '',
    rekening: '',
    bank: '',
    file_cv: '',
    guru: '',
    jeniskelaminguru: '',
  });
  useEffect(() => {
    const getInitialData = async () => {
      const provinsi = await getListDaerah({type: 'provinsi'});
      setListDaerah(prev => ({...prev, provinsi}));

      const OldData = await apiGet({url: '/guru/profile'});
      if (OldData.data.idprovinsi != null && OldData.data.idkecamatan != null) {
        let kota = await getListDaerah({
          type: 'kota',
          idParent: OldData.data.idprovinsi,
        });
        let kecamatan = await getListDaerah({
          type: 'kecamatan',
          idParent: OldData.data.idkabupaten,
        });
        let desa = await getListDaerah({
          type: 'desa',
          idParent: OldData.data.idkecamatan,
        });
        setListDaerah(prev => ({
          ...prev,
          kota: kota,
          kecamatan: kecamatan,
          desa: desa,
        }));
        let defaultProvinsi = await provinsi.find(
          (i: any) => i.id == OldData.data.idprovinsi,
        )?.name;
        let defaultKota = await kota.find(
          (i: any) => i.id == OldData.data.idkabupaten,
        )?.name;
        let defaultKecamatan = await kecamatan.find(
          (i: any) => i.id == OldData.data.idkecamatan,
        )?.name;
        let defaultDesa = await desa.find(
          (i: any) => i.id == OldData.data.iddesa,
        )?.name;
        await setSelectedDaerah({
          provinsi: defaultProvinsi,
          kota: defaultKota,
          kecamatan: defaultKecamatan,
          desa: defaultDesa,
        });
        setOldData(OldData.data);
      }
      setIsLoading(false);
    };

    getInitialData();
    return () => {
      // cancelApiRequest();
    };
  }, []);

  const onSubmit: SubmitHandler<FormDataType> = async data => {
    const newCV = new FormData();
    newCV.append('file_cv[0][file]', {
      name: file?.name,
      type: file?.type,
      uri: Platform.OS === 'ios' ? file?.uri.replace('file://', '') : file?.uri,
    });
    newCV.append('alamat', data.alamat);
    listDaerah.provinsi.find((i: any) =>
      i.name == data.idprovinsi ? (data.idprovinsi = i.id) : null,
    );
    listDaerah.kota.find((i: any) => {
      i.name == data.idkabupaten ? (data.idkabupaten = i.id) : null;
    });
    listDaerah.kecamatan.find((i: any) => {
      i.name == data.idkecamatan ? (data.idkecamatan = i.id) : null;
    });
    listDaerah.desa.find((i: any) => {
      i.name == data.iddesa ? (data.iddesa = i.id) : null;
    });
    newCV.append('bank', data.bank);
    newCV.append('guru', data.guru);
    newCV.append('idprovinsi', data.idprovinsi);
    newCV.append('idkabupaten', data.idkabupaten);
    newCV.append('idkecamatan', data.idkecamatan);
    newCV.append('iddesa', data.iddesa);
    newCV.append('jurusan', data.jurusan);
    newCV.append('lamamengajar', data.lamamengajar);
    newCV.append('lokasimengajar', data.lokasimengajar);
    newCV.append('mapel', data.mapel);
    newCV.append('perguruantinggi', data.perguruantinggi);
    newCV.append('pernahmengajar', data.pernahmengajar);
    newCV.append('rekening', data.rekening);
    newCV.append('telp', data.telp);
    const {success} = await apiPostFile({
      url: '/guru/profile/',
      payload: newCV,
    });
    console.log(success);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Ubah Data Akun" />

      {isLoading ? (
        <SkeletonLoading />
      ) : (
        <>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 1, padding: dimens.standard}}>
              {/* Nama */}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    autoCapitalize="words"
                    label="Nama"
                    placeholder="Masukkan nama lengkap Anda"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.guru}
                    errorMessage="Nama harus diisi"
                  />
                )}
                name="guru"
                defaultValue={oldData == null ? '' : oldData.guru}
                // defaultValue=""
              />

              {/* No telp */}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Nomor WhatsApp"
                    placeholder="Masukkan nomor WhatsApp Anda"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.telp}
                    errorMessage="Nomor WhatsApp harus diisi"
                    keyboardType="phone-pad"
                  />
                )}
                name="telp"
                defaultValue={oldData == null ? '' : oldData.telp}
              />

              {/* Provinsi */}
              {listDaerah.provinsi && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange}}) => (
                    <InputChoice
                      toNumber={false}
                      label="Domisili - Provinsi"
                      value={selectedDaerah.provinsi}
                      error={!!errors.idprovinsi}
                      errorMessage="Harap pilih provinsi tempat tinggal Anda"
                      onSelect={async item => {
                        if (onChange) {
                          const kota = await getListDaerah({
                            type: 'kota',
                            idParent: item.id,
                          });
                          setSelectedDaerah({
                            provinsi: item.name,
                            kota: '',
                            kecamatan: '',
                            desa: '',
                          });
                          setListDaerah(prev => ({...prev, kota}));
                          onChange(item.name);
                        }
                      }}
                      listData={listDaerah.provinsi}
                      keyMenuTitle="name"
                    />
                  )}
                  name="idprovinsi"
                  defaultValue={''}
                  // )}
                />
              )}

              {/* kota */}

              {listDaerah.kota && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange}}) => (
                    <InputChoice
                      toNumber={false}
                      label="Domisili - Kota"
                      value={selectedDaerah.kota}
                      error={!!errors.idkabupaten}
                      errorMessage="Harap pilih kota/kabupaten tempat tinggal Anda"
                      onSelect={async item => {
                        setSelectedDaerah({
                          provinsi: selectedDaerah.provinsi,
                          kota: item.name,
                          kecamatan: '',
                          desa: '',
                        });
                        const kecamatan = await getListDaerah({
                          type: 'kecamatan',
                          idParent: item.id,
                        });
                        setListDaerah(prev => ({...prev, kecamatan}));
                        onChange(item.name);
                      }}
                      listData={listDaerah.kota}
                      keyMenuTitle="name"
                    />
                  )}
                  name="idkabupaten"
                  defaultValue={''}

                  // }
                />
              )}
              {/* kecamatan */}

              {listDaerah.kecamatan && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange}}) => (
                    <InputChoice
                      label="Domisili - Kecamatan"
                      toNumber={false}
                      value={selectedDaerah.kecamatan}
                      error={!!errors.idkecamatan}
                      errorMessage="Harap pilih kecamatan tempat tinggal Anda"
                      onSelect={async item => {
                        setSelectedDaerah({
                          provinsi: selectedDaerah.provinsi,
                          kota: selectedDaerah.kota,
                          kecamatan: item.name,
                          desa: '',
                        });
                        onChange(item.name);
                        const desa = await getListDaerah({
                          type: 'desa',
                          idParent: item.id,
                        });
                        setListDaerah(prev => ({...prev, desa}));
                      }}
                      listData={listDaerah.kecamatan}
                      keyMenuTitle="name"
                    />
                  )}
                  name="idkecamatan"
                  defaultValue={''}
                />
              )}

              {/* desa */}

              {listDaerah.desa && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange}}) => (
                    <InputChoice
                      label="Domisili - Kelurahan"
                      toNumber={false}
                      value={selectedDaerah.desa}
                      error={!!errors.iddesa}
                      errorMessage="Harap pilih kecamatan tempat tinggal Anda"
                      onSelect={item => {
                        setSelectedDaerah({
                          provinsi: selectedDaerah.provinsi,
                          kota: selectedDaerah.kota,
                          kecamatan: selectedDaerah.kecamatan,
                          desa: item.name,
                        });
                        onChange(item.name);
                      }}
                      listData={listDaerah.desa}
                      keyMenuTitle="name"
                    />
                  )}
                  name="iddesa"
                  defaultValue={''}
                />
              )}
              {/* Alamat */}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Alamat lengkap Rumah"
                    placeholder="Contoh: jalan, RT, RW"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.alamat}
                    errorMessage="Alamat lengkap rumah harus diisi"
                  />
                )}
                name="alamat"
                defaultValue={oldData == null ? '' : oldData.alamat}
              />

              {/* Univ */}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Perguruan Tinggi"
                    placeholder="Masukkan Perguruan Tinggi Anda"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.perguruantinggi}
                    errorMessage="Perguruan harus diisi"
                  />
                )}
                name="perguruantinggi"
                defaultValue={oldData == null ? '' : oldData.perguruantinggi}
              />
              {/* JURUSAN */}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Jurusan"
                    placeholder="Masukkan Jurusan Anda"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.jurusan}
                    errorMessage="Jurusan harus diisi"
                  />
                )}
                name="jurusan"
                defaultValue={oldData == null ? '' : oldData.jurusan}
              />
              {/* Mapel */}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Mata Pelajaran"
                    placeholder="Masukkan Mapel yang Anda Kuasai"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.jurusan}
                    errorMessage="Mapel harus diisi"
                  />
                )}
                name="mapel"
                defaultValue={oldData == null ? '' : oldData.mapel}
              />
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Pernah Mengajar"
                    placeholder="Pernah Mengajar"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.pernahmengajar}
                    errorMessage="Mapel harus diisi"
                  />
                )}
                name="pernahmengajar"
                defaultValue={oldData == null ? '' : oldData.pernahmengajar}
              />
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Lokasi Mengajar"
                    placeholder="Lokasi Mengajar"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.lokasimengajar}
                    errorMessage="Lokasi mengajar harus diisi"
                  />
                )}
                name="lokasimengajar"
                defaultValue={oldData == null ? '' : oldData.lokasimengajar}
              />
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Lama Mengajar"
                    placeholder="Lama Mengajar"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.lokasimengajar}
                    errorMessage="Lama mengajar harus diisi"
                  />
                )}
                name="lamamengajar"
                defaultValue={oldData == null ? '' : oldData.lamamengajar}
              />
              {listBank && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <InputChoice
                      toNumber={false}
                      label="Bank Rekening"
                      value={value}
                      error={!!errors.idprovinsi}
                      errorMessage="Harap pilih bank rekening Anda"
                      onSelect={async item => {
                        if (onChange) {
                          onChange(item.name);
                        }
                      }}
                      listData={listBank}
                      keyMenuTitle="name"
                    />
                  )}
                  name="bank"
                  defaultValue={oldData == null ? '' : oldData.bank}
                />
              )}
              {listJenis && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <InputChoice
                      label="Jenis Kelamin"
                      toNumber={false}
                      value={value}
                      error={!!errors.idprovinsi}
                      errorMessage="Harap Isi Jenis Kelamin Anda"
                      onSelect={async item => {
                        if (onChange) {
                          onChange(item.name);
                        }
                      }}
                      listData={listJenis}
                      keyMenuTitle="name"
                    />
                  )}
                  name="jeniskelaminguru"
                  defaultValue={oldData == null ? '' : oldData.jeniskelaminguru}
                />
              )}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="No. rekening"
                    placeholder="Nomer Rekening"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.rekening}
                    errorMessage="Nomer rekening harus diisi"
                  />
                )}
                name="rekening"
                defaultValue={oldData == null ? '' : oldData.rekening}
              />
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, value}}) => (
                  <TextInput
                    style={{backgroundColor: 'white', marginBottom: 10}}
                    placeholder="Unggah File CV Anda (*.pdf)"
                    error={!!errors.file_cv}
                    label="Unggah File CV Anda (*.pdf)"
                    // errorMessage={'File CV harus diupload'}
                    value={value}
                    editable={false}
                    selectTextOnFocus={false}
                    right={
                      <TextInput.Icon
                        name="file"
                        onPress={async () => {
                          const res = await getSingleDocumentPDF();
                          if (res) {
                            setFile(res);
                            onChange(res.name);
                          }
                        }}
                      />
                    }
                  />
                )}
                name="file_cv"
                // defaultValue={oldData == null ? '' : oldData.cv}
              />
              {/* modal */}
              {isModalVisible && (
                <Modal
                  isVisible={isModalVisible}
                  onBackdropPress={() => setModalVisible(false)}>
                  <Card
                    style={{
                      // borderRadius: 25,
                      minHeight: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 15,
                    }}>
                    <View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignSelf: 'center',
                          backgroundColor: color.green_500,
                          borderRadius: 50,
                          width: 100,
                          height: 100,
                        }}>
                        <Icon
                          name="check"
                          solid={true}
                          size={100}
                          style={{textAlign: 'center'}}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 24,
                          paddingVertical: 10,
                          textAlign: 'center',
                        }}>
                        Edit Akun Berhasil Diubah
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '200',
                          color: color.grey_2,
                          textAlign: 'center',
                        }}>
                        Klik bagian belakang untuk keluar
                      </Text>
                    </View>
                  </Card>
                </Modal>
              )}
            </View>
          </ScrollView>

          {/* Submit button */}
          <ButtonFormSubmit text="Simpan" onPress={handleSubmit(onSubmit)} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  textInputStyle: {
    backgroundColor: 'white',
    marginTop: dimens.standard,
    color: color.btn_black,
  },
});
