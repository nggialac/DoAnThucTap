import React from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
// import {data} from '../../../navigation/Models/MedicineData';
import Card from './Card';
import { getMedicineByCategory } from '../../../api/MedicineApis';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';

const MedicineListScreen = ({navigation, route}) => {
  const madm = route.params.madm;
  const [listData, setListData] = React.useState([]);

  React.useEffect(() => {
    getMedicineByCategory(madm)
    .then(res=>{
      console.log(res.data);
      setListData(res.data);
    })
    .catch(e=>{
      Alert.alert('Fail!', 'Not found Data', [{text: 'ok'}])
    })
  }, [])

    const renderItem = ({item}) => {
        return (
            <Card 
                key={item.masp}
                itemData={item}
                onPress={()=> navigation.navigate('TabAdminHomeProductDetail', {itemData: item})}
            />
        );
    };

    return (
      <View style={styles.container}>
        <FlatList 
            // key={item=>item.masp}
            data={listData}
            renderItem={renderItem}
            keyExtractor={item => item.masp}
        />
      </View>
    );
};

export default MedicineListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    width: '90%',
    alignSelf: 'center'
  },
});