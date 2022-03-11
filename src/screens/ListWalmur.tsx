import React, {FC, useEffect, useState, useRef} from 'react';
import {Header, OneLineInfo, CardKeyValue} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {Card} from 'react-native-paper';
import {apiGet} from '@utils';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListWalmur'>,
  StackScreenProps<AppStackParamList>
>;

export const ListWalmur: FC<ScreenProps> = ({navigation}) => {
  const [walmurList, setWalmurList] = useState([]);
  const componentMounted = useRef(true); // (3) component is mounted

  useEffect(() => {
    const getInitialData = async () => {
      const walmur = await apiGet({
        url: 'admin/wali?page=1&wali=Budi&orderBy=wali&sort=ASC',
      });
      if (componentMounted.current) {
        setWalmurList(walmur.data);
      }
    };
    getInitialData();
    return () => {
      componentMounted.current = false;
      // cancelApiRequest();
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header
        noBackButton
        withFilter
        title="Daftar Wali Murid"
        onPressFilter={() => {}}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />
        {walmurList.map((item: any, index: number) => {
          return (
            <Card
              key={index}
              style={{marginTop: dimens.standard}}
              onPress={() =>
                navigation.navigate<any>('DetailWalmur', {data: item})
              }>
              <Card.Title title={item.wali} />
              <Card.Content>
                <CardKeyValue keyName="Nama" value={item.wali} />
                <CardKeyValue keyName="Email" value={item.email} />
                <CardKeyValue keyName="Nomor WA" value={item.telp} />
                <CardKeyValue keyName="Alamat" value={item.alamat} />
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>
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
