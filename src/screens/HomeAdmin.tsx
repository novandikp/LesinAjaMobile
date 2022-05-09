import React, {FC, useState, useEffect} from 'react';
import {Header} from '@components';
import {color, dimens} from '@constants';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {Card, DataTable} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {CompositeScreenProps} from '@react-navigation/core';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {useIsFocused} from '@react-navigation/core';
import {apiGet} from '@utils';

type SocialMediaType = {
  refrensi: string;
  persentase?: string;
  jumlah_wali?: string;
};
type ScreenProps = CompositeScreenProps<
  DrawerScreenProps<AdminDrawerParamList, 'HomeAdmin'>,
  StackScreenProps<AppStackParamList>
>;
export const HomeAdmin: FC<ScreenProps> = ({}) => {
  const [socialMedia, setSocialMedia] = useState<SocialMediaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocus = useIsFocused();

  useEffect(() => {
    let isActive = true;

    const getInitialData = async () => {
      const {data}: {data: SocialMediaType[]} = await apiGet({
        url: '/admin/wali/refrensi',
      });
      if (isActive) {
        setSocialMedia(data);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    if (isRefreshing || isLoading || isFocus) {
      getInitialData();
    }

    return () => {
      isActive = false;
    };
  }, [isFocus, isLoading, isRefreshing]);
  // ([
  //   {
  //     nama: 'Google',
  //     efektivitas: '10%',
  //     keterangan: '5',
  //   },
  //   {
  //     nama: 'Tiktok',
  //     efektivitas: '10%',
  //     keterangan: '5',
  //   },
  //   {
  //     nama: 'Instagram',
  //     efektivitas: '10%',
  //     keterangan: '5',
  //   },
  //   {
  //     nama: 'Facebook',
  //     efektivitas: '10%',
  //     keterangan: '5',
  //   },
  //   {
  //     nama: 'YouTube',
  //     efektivitas: '10%',
  //     keterangan: '5',
  //   },
  //   {
  //     nama: 'Teman',
  //     efektivitas: '10%',
  //     keterangan: '5',
  //   },
  // ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header drawerButton noBackButton title="Beranda" />

      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, padding: dimens.standard}}>
          <Card>
            <ScrollView horizontal>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={styles.dataCell}>
                    Sosial Media
                  </DataTable.Title>
                  <DataTable.Title style={styles.dataCell}>
                    Efektivitas
                  </DataTable.Title>
                  <DataTable.Title style={styles.dataCell}>
                    Jumlah Wali murid
                  </DataTable.Title>
                </DataTable.Header>
                {socialMedia.map(item => {
                  return <SocialMediaRow key={item.refrensi} item={item} />;
                })}
              </DataTable>
            </ScrollView>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SocialMediaRow: FC<{item: SocialMediaType}> = ({item}) => {
  return (
    <DataTable.Row>
      <DataTable.Cell style={styles.dataCell}>{item.refrensi}</DataTable.Cell>
      <DataTable.Cell style={styles.dataCell}>{item.persentase}</DataTable.Cell>
      <DataTable.Cell style={styles.dataCell}>
        {item.jumlah_wali}
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
    flex: 1,
  },
  dataCell: {
    minWidth: 100,
  },
});
