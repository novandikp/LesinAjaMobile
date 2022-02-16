import React, {FC, useEffect, useState} from 'react';
import {Header, OneLineInfo, CardKeyValue, FABList, Gap} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {Button, Card} from 'react-native-paper';
import {apiDelete, apiGet} from '@utils';
type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListTutor'>,
  StackScreenProps<AppStackParamList>
>;

export const ListLes: FC<ScreenProps> = ({navigation}) => {
  const [lesList, setLesList] = useState([]);
  // const lesList = [
  //   {
  //     mapel: 'Fisika',
  //     jenjangKelas: 'SMP Kelas 3',
  //     paket: 'Paket 2',
  //     wilayah: 'Wilayah 1',
  //     biaya: '2500000',
  //     gajiTutor: '200000',
  //   },
  //   {
  //     mapel: 'Gambar Teknik',
  //     jenjangKelas: 'TK A',
  //     paket: 'Paket 1',
  //     wilayah: 'Wilayah 1',
  //     biaya: '2500000',
  //     gajiTutor: '200000',
  //   },
  //   {
  //     mapel: 'Matematika',
  //     jenjangKelas: 'SMP Kelas 1',
  //     paket: 'Paket 1',
  //     wilayah: 'Wilayah 2',
  //     biaya: '2500000',
  //     gajiTutor: '200000',
  //   },
  //   {
  //     mapel: 'Bahasa Inggris',
  //     jenjangKelas: 'SMA Kelas 3',
  //     paket: 'Paket 2',
  //     wilayah: 'Wilayah 1',
  //     biaya: '2500000',
  //     gajiTutor: '200000',
  //   },
  // ];
  useEffect(() => {
    const getInitialData = async () => {
      const data = await apiGet({
        url: '/paket?page=1&paket&orderBy=biaya&sort=ASC',
      });
      setLesList(data.data);
      // console.log(applyingTutor.data);
    };
    getInitialData();

    return () => {
      // isActive = false;
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        withFilter
        title="Daftar Les"
        onPressFilter={() => {}}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />
        {lesList.map((item: any, index: number) => {
          return (
            <Card key={index} style={{marginTop: dimens.standard}}>
              {/* <Card.Title title={`${item.mapel} ${item.jenjangKelas}`} /> */}
              <Card.Content>
                <CardKeyValue keyName="Paket" value={item.paket} />
                <CardKeyValue
                  keyName="Jumlah Pertemua"
                  value={item.jumlah_pertemuan}
                />
                <CardKeyValue keyName="Biaya" value={item.biaya} />
                <CardKeyValue keyName="Gaji Tutor" value={item.gaji} />
              </Card.Content>
              <Card.Actions>
                <Button
                  onPress={() =>
                    navigation.navigate<any>('EditListLes', {data: item})
                  }>
                  Edit
                </Button>
                <Button
                  onPress={async () => {
                    const {success} = await apiDelete({
                      url: '/paket/' + item.idpaket,
                    });
                    // console.log(success);
                    if (success) {
                      navigation.navigate('ListLes');
                    }
                  }}>
                  Hapus
                </Button>
              </Card.Actions>
            </Card>
          );
        })}
        <Gap y={72} />
      </ScrollView>

      {/* Add button */}
      <FABList
        label="Tambah Data"
        onPress={() => navigation.navigate<any>('EditListLes', {data: null})}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: dimens.standard,
    paddingTop: dimens.small,
  },
});
