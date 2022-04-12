import {color} from '@constants';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import React, {FC, useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {AuthContext} from '@context/AuthContext';

type Props = {
  title: string;
  noBackButton?: boolean;
  withFilter?: boolean;
  withHistory?: boolean;
  drawerButton?: boolean;
  onPressFilter?: () => void;
};

export const Header: FC<Props> = ({
  title,
  noBackButton,
  withFilter,
  withHistory,
  onPressFilter,
}) => {
  const navigation: any = useNavigation();
  const {
    state: {userRole},
  } = useContext(AuthContext);

  return (
    <Appbar.Header style={styles.container}>
      {!noBackButton && <Appbar.BackAction onPress={navigation.goBack} />}

      {userRole == 'admin' && noBackButton && (
        <Appbar.Action
          icon="reorder-horizontal"
          onPress={() => navigation.toggleDrawer()}
        />
      )}

      <Appbar.Content title={title} titleStyle={{color: color.btn_black}} />

      {withFilter && (
        <Appbar.Action icon="filter-outline" onPress={onPressFilter} />
      )}
      {withHistory && <Appbar.Action icon="history" onPress={onPressFilter} />}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bg_grey,
  },
});
