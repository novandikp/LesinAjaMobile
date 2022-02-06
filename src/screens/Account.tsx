import React, {FC, useEffect, useState} from 'react';
import {
  ButtonFormSubmit,
  Header,
  InputChoice,
  InputText,
  SkeletonLoading,
} from '@components';
import {color, dimens} from '@constants';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiGet, cancelApiRequest, apiPost} from '@utils';
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
  const [oldData, setOldData] = useState({
    wali: '',
    telp: '',
    idprovinsi: '',
    alamat: '',
    pekerjaan: '',
  });
  useEffect(() => {
    const getInitialData = async () => {
      const provinsi = await getListDaerah({type: 'provinsi'});
      setListDaerah(prev => ({...prev, provinsi}));

      const OldData = await apiGet({url: 'wali/profile'});
      setOldData(OldData.data);
      setIsLoading(false);
    };

    getInitialData();
    return () => {
      // cancelApiRequest();
    };
  }, []);
  const onSubmit: SubmitHandler<FormDataType> = async data => {
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
      payload: {
        wali: data.wali,
        telp: data.telp,
        alamat: data.alamat,
        idprovinsi: data.idprovinsi,
        idkabupaten: data.idkabupaten,
        idkecamatan: data.idkecamatan,
        iddesa: data.iddesa,
        pekerjaan: data.pekerjaan,
      },
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
                    error={!!errors.wali}
                    errorMessage="Nama harus diisi"
                  />
                )}
                name="wali"
                defaultValue={oldData.wali}
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
                defaultValue={oldData.telp}
              />

              {/* Provinsi */}
              {listDaerah.provinsi && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <InputChoice
                      label="Domisili - Provinsi"
                      value={value}
                      error={!!errors.idprovinsi}
                      errorMessage="Harap pilih provinsi tempat tinggal Anda"
                      onSelect={async item => {
                        if (onChange) {
                          const kota = await getListDaerah({
                            type: 'kota',
                            idParent: item.id,
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
                  defaultValue={
                    listDaerah.provinsi.find(
                      (i: any) => i.id == oldData.idprovinsi,
                    )?.name
                  }
                />
              )}

              {/* kota */}

              {listDaerah.kota && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <InputChoice
                      label="Domisili - Kota"
                      value={value}
                      error={!!errors.idkabupaten}
                      errorMessage="Harap pilih kota/kabupaten tempat tinggal Anda"
                      onSelect={async item => {
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
                />
              )}
              {/* kecamatan */}

              {listDaerah.kecamatan && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <InputChoice
                      label="Domisili - Kecamatan"
                      value={value}
                      error={!!errors.idkecamatan}
                      errorMessage="Harap pilih kecamatan tempat tinggal Anda"
                      onSelect={async item => {
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

              {/* kecamatan */}

              {listDaerah.kecamatan && (
                <Controller
                  control={control}
                  rules={{required: true}}
                  render={({field: {onChange, value}}) => (
                    <InputChoice
                      label="Domisili - Kelurahan"
                      value={value}
                      error={!!errors.iddesa}
                      errorMessage="Harap pilih kecamatan tempat tinggal Anda"
                      onSelect={item => {
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
                defaultValue={oldData.alamat}
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
                defaultValue={oldData.pekerjaan}
              />
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
