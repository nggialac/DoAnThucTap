import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import {data} from '../../../navigation/Models/MedicineData';
import Card from './Card';

const MedicineListScreen = ({navigation}) => {

    const renderItem = ({item}) => {
        return (
            <Card 
                itemData={item}
                onPress={()=> navigation.navigate('TabAdminHomeProductDetail', {itemData: item})}
            />
        );
    };

    return (
      <View style={styles.container}>
        <FlatList 
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
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