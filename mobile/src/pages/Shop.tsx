import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, Text } from 'react-native'
import { Searchbar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// import api from '../services/api'
import data from './data'

const Shop = () => {
    const [query, setQuery] = useState('')
    console.log(data)

    // const getData = async () => {
    //     const { response } = await api.get('/products')
    //     console.log(response)
    // }

    // useEffect(() => {
    //     getData()
    // }, [])

    const renderData = ({ item }) => {
        return (
            <View style={styles.container}>
                <Text>{item.name}</Text>
            </View>
        )
    }

    return (
        <>
            <View style={styles.containerNav}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={text => setQuery(text)}
                    value={query} style={{ width: '80%' }}
                />
                <Icon name="chevron-down" size={20} />
            </View>
            <FlatList data={data} renderItem={item => renderData(item)} keyExtractor={item => `${item.id}`} contentContainerStyle={styles.flatlist} />
        </>
    )
}

const styles = StyleSheet.create({
    containerNav: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    flatlist: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        flexWrap: 'wrap',
        marginHorizontal: 8,
        marginVertical: 5,
    },
    container: {
        width: 100,
        borderColor: '#000',
        borderWidth: 2,
        borderStyle: 'solid'
    }
})

export default Shop