import React, {FC, useEffect, useState} from 'react';
import {CardKeyValue, Gap, Header, NestedCard} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {Card, Subheading} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {apiGet} from '@utils';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailLesTutor'>;
export const DetailLesTutor: FC<ScreenProps> = ({navigation, route}) => {
  const {data}: any = route.params;
  console.log(data);
  const [coursePresenceList, setCoursePresenceList] = useState([]);

  useEffect(() => {
    const getInitialData = async () => {
      const jadwalles = await apiGet({
        url: '/jadwal/siswa/' + data.idsiswa,
      });
      console.log(jadwalles.data);
      setCoursePresenceList(jadwalles.data);
      // conso
    };
    getInitialData();

    return () => {
      // isActive = false;
    };
  });
  // console.log();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Les" />

      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: dimens.standard}}>
        {/* About Les */}
        <Card>
          <Card.Title title="IPA kelas 5 SD" subtitle="5/8 Pertemuan" />
          <Card.Content>
            <CardKeyValue keyName="Siswa" value={data.siswa} keyFlex={8} />
            <CardKeyValue keyName="Tutor" value="-" keyFlex={8} />
            <CardKeyValue
              keyName="Tgl Mulai"
              value="-"
              // {coursePresenceList[0].tglabsen.toISOString()}
              keyFlex={8}
            />
            <CardKeyValue keyName="Tgl Selesai" value="-" keyFlex={8} />
          </Card.Content>
        </Card>

        {/* There is no applying tutor */}
        <Card style={{marginTop: dimens.standard}}>
          <Card.Title
            title="Menunggu Konfirmasi Walimurid"
            titleStyle={{color: '#F59E0B'}}
          />
          <Card.Content>
            <Subheading>
              Menunggu wali murid konfirmasi tutor yang akan mengajar di les ini
            </Subheading>
          </Card.Content>
        </Card>

        {/* Presence */}
        <Card style={{marginTop: dimens.standard}}>
          <Card.Title
            title="Presensi Les"
            titleStyle={{color: '#2563EB'}}
            subtitle="Klik item untuk melihat detail presensi"
            subtitleStyle={{fontSize: dimens.medium_14}}
          />
          <Card.Content>
            {coursePresenceList.map((item: any, index: number) => {
              return (
                <NestedCard
                  key={index}
                  title={new Date(item.tglabsen).toLocaleDateString()}
                  // subtitle={new Date(item.tglabsen).getTime()}
                  subtitle="-"
                  additionalText={
                    item.flagabsen == 1 ? 'Sudah absen' : 'Belum absen'
                  }
                  onPress={() => {
                    navigation.navigate<any>('DetailPresensi', {data: item});
                  }}
                />
              );
            })}
          </Card.Content>
        </Card>
        <Gap y={dimens.standard} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
});
