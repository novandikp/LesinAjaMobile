import React, {FC, useEffect, useState, useRef} from 'react';
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
  const componentMounted = useRef(true); // (3) component is mounted
  useEffect(() => {
    const getInitialData = async () => {
      const data = await apiGet({
        url: '/paket?page=1&paket&orderBy=biaya&sort=ASC',
      });
      if (componentMounted.current) {
        setLesList(data.data);
      }
    };
    getInitialData();

    return () => {
      // isActive = false;
      componentMounted.current = false;
    };
  }, [lesList]);
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
                <CardKeyValue keyName="Jenjang" value={item.jenjang} />
                <CardKeyValue
                  keyName="Jumlah Pertemuan"
                  value={item.jumlah_pertemuan}
                />
                <CardKeyValue
                  keyName="Biaya"
                  value={item.biaya
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                />
                <CardKeyValue
                  keyName="Gaji Tutor"
                  value={item.gaji
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                />
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
