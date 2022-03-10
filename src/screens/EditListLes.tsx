import React, {FC, useEffect, useState} from 'react';
import {ButtonFormSubmit, Header, InputChoice, InputText} from '@components';
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
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {apiGet, apiPost} from '@utils';
type FormDataType = {
  paket: string;
  jenjang: string;
  jumlah_pertemuan: string;
  biaya: string;
  gaji: string;
};

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListLes'>,
  StackScreenProps<AppStackParamList>
>;
export const EditListLes: FC<ScreenProps> = ({
  route,
  navigation: {navigate},
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
    // setValue,
  } = useForm<FormDataType>({mode: 'onChange'});
  const {data}: any = route.params;
  const idpaket = data != null ? data.idpaket : null;
  const paket = !data;
  const [listJenjang, setListJenjang] = useState([]);
  const [selectedJenjang, setSelectedJenjang] = useState({jenjang: ''});
  useEffect(() => {
    const getInitialData = async () => {
      const jenjang = await apiGet({url: '/paket/jenjang'});
      setListJenjang(jenjang.data);
      if (data) {
        setSelectedJenjang({
          jenjang: data.jenjang,
        });
      }
    };
    getInitialData();
    return () => {
      // isActive = false;
    };
  }, []);
  const onSubmit: SubmitHandler<FormDataType> = async data => {
    if (!paket) {
      const success = await apiPost({
        url: 'paket/' + idpaket,
        payload: data,
      });
      if (success) {
        navigate('ListLes');
      }
    } else {
      const success = await apiPost({
        url: 'paket',
        payload: data,
      });
      if (success) {
        navigate('ListLes');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title={`${data ? 'Ubah' : 'Tambah'} Data Les`} />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
          {/* Paket */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <InputText
                autoCapitalize="words"
                placeholder="Masukkan nama paket"
                label="Paket"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.paket}
                errorMessage="Paket harus diisi"
              />
            )}
            name="paket"
            defaultValue={data && data.paket}
          />
          {/* Jenjang */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange}}) => (
              <InputChoice
                label="Jenjang"
                toNumber={false}
                listData={listJenjang}
                keyMenuTitle={'jenjang'}
                onSelect={item => {
                  setSelectedJenjang({
                    jenjang: item.jenjang,
                  });
                  onChange(item.jenjang);
                }}
                value={selectedJenjang.jenjang}
              />
            )}
            name="jenjang"
            defaultValue={selectedJenjang.jenjang}
          />
          {/* jumlah pertemuan */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <InputText
                autoCapitalize="words"
                placeholder="Masukkan jumlah pertemuan"
                label="Jumlah Pertemuan"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.biaya}
                errorMessage="jumlah pertemuanharus diisi"
                keyboardType="number-pad"
              />
            )}
            name="jumlah_pertemuan"
            defaultValue={data && data.jumlah_pertemuan.toString()}
          />
          {/* Biaya */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <InputText
                autoCapitalize="words"
                placeholder="Masukkan jumlah biaya"
                label="Biaya"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.biaya}
                errorMessage="Biaya harus diisi"
                keyboardType="numeric"
              />
            )}
            name="biaya"
            defaultValue={data && data.biaya.toString()}
          />

          {/* Gaji tutor */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <InputText
                autoCapitalize="words"
                placeholder="Masukkan jumlah gaji tutor"
                label="Gaji Tutor"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.gaji}
                errorMessage="Mapel harus diisi"
                keyboardType="numeric"
              />
            )}
            name="gaji"
            defaultValue={data && data.gaji.toString()}
          />
        </View>
      </ScrollView>

      {/* Submit button */}
      <ButtonFormSubmit
        isLoading={isSubmitting}
        text="Simpan"
        onPress={handleSubmit(onSubmit)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
});
