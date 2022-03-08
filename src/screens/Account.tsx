import React, {FC, useEffect, useState} from 'react';
import {
  ButtonFormSubmit,
  Header,
  InputChoice,
  InputText,
  SkeletonLoading,
} from '@components';
import {Card} from 'react-native-paper';

import {color, dimens} from '@constants';
import {Icon} from 'react-native-elements';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import Modal from 'react-native-modal';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  Text,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiGet, apiPost} from '@utils';
import {getListDaerah} from '@utils/getListData';

type FormDataType = {
  wali: string;
  pekerjaan: string;
  idprovinsi: string;
  idkabupaten: string;
  idkecamatan: string;
  iddesa: string;
  alamat: string;
  telp: string;
};

type ScreenProps = StackScreenProps<AppStackParamList, 'Account'>;

export const Account: FC<ScreenProps> = () => {
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
  const [selectedDaerah, setSelectedDaerah] = useState({
    provinsi: '',
    kota: '',
    kecamatan: '',
    desa: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const [oldData, setOldData] = useState<any>({
    wali: '',
    telp: '',
    idprovinsi: '',
    alamat: '',
    pekerjaan: '',
    idkabupaten: '',
    idkecamatan: '',
    iddesa: '',
  });
  useEffect(() => {
    const getInitialData = async () => {
      const provinsi = await getListDaerah({type: 'provinsi'});
      setListDaerah(prev => ({...prev, provinsi}));
      const OldData = await apiGet({url: 'wali/profile'});
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
    console.log(data.iddesa);
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
    const {success} = await apiPost({
      url: '/wali/profile/',
      payload: data,
    });
    console.log(success);
    if (success) {
      setModalVisible(true);
    }
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
                    error={!!errors.wali}
                    errorMessage="Nama harus diisi"
                  />
                )}
                name="wali"
                defaultValue={oldData == null ? ' ' : oldData.wali}
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
                // defaultValue=""
                defaultValue={oldData == null ? ' ' : oldData.telp}
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
                defaultValue={oldData == null ? ' ' : oldData.alamat}
              />

              {/* Pekerjaan */}
              <Controller
                control={control}
                rules={{required: true}}
                render={({field: {onChange, onBlur, value}}) => (
                  <InputText
                    label="Pekerjaan"
                    placeholder="Masukkan pekerjaan Anda"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={!!errors.pekerjaan}
                    errorMessage="Pekerjaan harus diisi"
                  />
                )}
                name="pekerjaan"
                defaultValue={oldData == null ? ' ' : oldData.pekerjaan}
              />
            </View>
          </ScrollView>
          {isModalVisible && (
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={() => setModalVisible(false)}>
              <Card
                style={{
                  borderRadius: 25,
                  minHeight: 100,
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <View>
                  <View style={{paddingTop: 10}}>
                    <Icon
                      name="check"
                      solid={true}
                      size={100}
                      borderRadius={50}
                      backgroundColor={color.green_500}
                    />
                  </View>
                  <Text
                    style={{fontSize: 24, paddingTop: 10, paddingBottom: 10}}>
                    Edit Akun Berhasil Diubah
                  </Text>
                </View>
              </Card>
            </Modal>
          )}
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
