import React, {FC, useEffect, useState, useRef} from 'react';
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
  const componentMounted = useRef(true); // (3) component is mounted

  const [selectedJenjang, setSelectedJenjang] = useState({jenjang: ''});
  useEffect(() => {
    const getInitialData = async () => {
      const jenjang = await apiGet({url: '/paket/jenjang'});
      if (componentMounted.current) {
        setListJenjang(jenjang.data);
      }
      if (data != null && data.jenjang != null) {
        let list = jenjang.data;
        let defaultJenjang = await list.find(
          (i: any) => i.jenjang == data.jenjang,
        ).jenjang;
        setSelectedJenjang({
          jenjang: defaultJenjang,
        });
      }
    };
    getInitialData();
    return () => {
      componentMounted.current = false;
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
        navigate('HomeAdmin');
      }
    } else {
      const success = await apiPost({
        url: 'paket',
        payload: data,
      });
      if (success) {
        navigate('HomeAdmin');
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
          {listJenjang && (
            <Controller
              control={control}
              rules={{required: true}}
              render={({field: {onChange}}) => (
                <InputChoice
                  label="Jenjang"
                  value={selectedJenjang.jenjang}
                  toNumber={false}
                  error={!!errors.jenjang}
                  errorMessage="Harap pilih jenjang"
                  onSelect={item => {
                    if (onChange) {
                      setSelectedJenjang({
                        jenjang: item.jenjang,
                      });
                      onChange(item.jenjang);
                    }
                  }}
                  listData={listJenjang}
                  keyMenuTitle={'jenjang'}
                />
              )}
              name="jenjang"
              defaultValue={data && data.jenjang}
            />
          )}
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
