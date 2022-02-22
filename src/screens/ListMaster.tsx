import React, {FC} from 'react';
import {Header, OneLineInfo} from '@components';
import {color, dimens} from '@constants';
import {SafeAreaView, StatusBar, StyleSheet, ScrollView} from 'react-native';
import {AdminDrawerParamList, AppStackParamList} from '@routes/RouteTypes';
import {StackScreenProps} from '@react-navigation/stack';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialBottomTabScreenProps} from '@react-navigation/material-bottom-tabs';
import {Card} from 'react-native-paper';

type ScreenProps = CompositeScreenProps<
  MaterialBottomTabScreenProps<AdminDrawerParamList, 'ListMaster'>,
  StackScreenProps<AppStackParamList>
>;

export const ListMaster: FC<ScreenProps> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={color.bg_grey} barStyle="dark-content" />

      <Header noBackButton title="Daftar Master" onPressFilter={() => {}} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <OneLineInfo info="Klik item untuk melihat detail" />
        {/* <Card
          style={styles.card}
          onPress={() =>
            navigation.navigate<any>('DetailListMaster', {
              detailType: 'Jenjang Kelas',
            })
          }>
          <Card.Title
            title="Master Jenjang Kelas"
            subtitle="untuk mengelola data yang berkaitan dengan jenjang kelas"
            subtitleNumberOfLines={2}
          />
        </Card> */}
        {/* <Card
          style={styles.card}
          onPress={() =>
            navigation.navigate<any>('DetailListMaster', {detailType: 'Mapel'})
          }>
          <Card.Title
            title="Master Mapel"
            subtitle="untuk mengelola data yang berkaitan dengan mapel"
            subtitleNumberOfLines={2}
          />
        </Card> */}
        <Card
          style={styles.card}
          onPress={() =>
            navigation.navigate<any>('DetailListMaster', {detailType: 'Paket'})
          }>
          <Card.Title
            title="Master Paket"
            subtitle="untuk mengelola data yang berkaitan dengan paket"
            subtitleNumberOfLines={2}
          />
        </Card>
        {/* <Card
          style={styles.card}
          onPress={() =>
            navigation.navigate<any>('DetailListMaster', {
              detailType: 'Wilayah',
            })
          }>
          <Card.Title
            title="Master Wilayah"
            subtitle="untuk mengelola data yang berkaitan dengan wilayah"
            subtitleNumberOfLines={2}
          />
        </Card> */}
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
  card: {
    marginTop: dimens.standard,
  },
});
