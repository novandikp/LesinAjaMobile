import React, {FC, useContext, useEffect, useState} from 'react';
import {ButtonFormSubmit, CardLabelValue, Gap, Header} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {Avatar, Card, Divider, Subheading, Title} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AppStackParamList} from '@routes/RouteTypes';
import {AuthContext} from '@context/AuthContext';

type ScreenProps = StackScreenProps<AppStackParamList, 'DetailWalmur'>;
export const DetailWalmur: FC<ScreenProps> = ({route}) => {
  const [item, setItem] = useState<any>([]);
  useEffect(() => {
    const getInitialData = async () => {
      const {data}: any = route.params;
      setItem(data);
    };
    getInitialData();

    return () => {};
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header title="Detail Wali Murid" />

      <ScrollView
        contentContainerStyle={{flexGrow: 1, padding: dimens.standard}}>
        <Card style={styles.contentContainer}>
          <Title style={{textAlign: 'center'}}>
            {item.wali != null ? item.wali : '-'}
          </Title>

          <Gap y={dimens.tiny} />
          <Divider />
          <Gap y={dimens.tiny} />

          <CardLabelValue
            label="Email"
            value={item.email != null ? item.email : '-'}
          />
          <CardLabelValue
            label="Nomor WA"
            value={item.telp != null ? item.telp : '-'}
          />
          <CardLabelValue
            label="Pekerjaan"
            value={item.pekerjaan != null ? item.pekerjaan : '-'}
          />
          <CardLabelValue
            label="Alamat"
            value={item.alamat != null ? item.alamat : '-'}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: dimens.standard,
  },
});
