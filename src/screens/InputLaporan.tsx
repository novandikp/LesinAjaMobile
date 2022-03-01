import React, {FC, useState} from 'react';
import {ButtonFormSubmit, Header, InputText} from '@components';
import {color, dimens} from '@constants';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import {TextInput} from 'react-native-paper';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiPost} from '@utils';

type FormDataType = {
  jumlah: string;
  keterangan: string;
  tanggal: string;
};
type ScreenProps = StackScreenProps<AppStackParamList, 'InputLaporan'>;
export const InputLaporan: FC<ScreenProps> = ({
  route,
  navigation: {navigate},
}) => {
  const {detailType}: any = route.params;
  //   console.log(data);

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<FormDataType>({mode: 'onChange'});
  const [Open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const onSubmit: SubmitHandler<FormDataType> = async data => {
    console.log(data);
    if (detailType == 'Pemasukan') {
      const pemasukan = await apiPost({
        url: '/keuangan/pemasukan',
        payload: data,
      });
      if (pemasukan) {
        navigate<any>('AdminDrawer');
      }
    } else if (detailType == 'Pengeluaran') {
      const pengeluaran = await apiPost({
        url: '/keuangan/pengeluaran',
        payload: data,
      });
      if (pengeluaran) {
        navigate<any>('AdminDrawer');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />
      <Header title={`Tambah ${detailType}`} />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
          {/* Item */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <InputText
                autoCapitalize="words"
                placeholder="Masukkan nama jumlah"
                label="Jumlah"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.jumlah}
                errorMessage="Jumlah harus diisi"
                keyboardType="numeric"
              />
            )}
            name="jumlah"
            // defaultValue='
          />

          {/* Jumlah pertemuan */}

          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange, onBlur, value}}) => (
              <InputText
                autoCapitalize="words"
                placeholder="Masukkan keterangan"
                label="keterangan"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.keterangan}
                errorMessage="Jumlah keterangan harus diisi"
              />
            )}
            name="keterangan"
            //   defaultValue={data && data.jumlahPertemuan}
          />

          {/* Biaya */}
          {/* {detailType == 'Wil && ( */}
          <Controller
            control={control}
            rules={{required: true}}
            render={({field: {onChange}}) => (
              <View>
                <DatePicker
                  modal
                  open={Open}
                  date={date}
                  mode="date"
                  textColor={color.grey_5}
                  onConfirm={Date => {
                    onChange(Date.toISOString().slice(0, 10));
                    setDate(Date);
                    setOpen(false);
                  }}
                  minimumDate={new Date()}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
                <TextInput
                  style={{backgroundColor: 'white', marginBottom: 10}}
                  placeholder="Piih Tanggal Les"
                  value={date.toISOString().slice(0, 10)}
                  editable={false}
                  selectTextOnFocus={false}
                  error={!!errors.tanggal}
                  // errorMessage="Harap pilih tanggal les"
                  right={
                    <TextInput.Icon
                      name="calendar"
                      onPress={() => {
                        setOpen(true);
                      }}
                    />
                  }
                />
              </View>
            )}
            name="tanggal"
            //   defaultValue={data && data.biaya}
          />
          {/* )} */}

          {/* Wilayah */}
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
