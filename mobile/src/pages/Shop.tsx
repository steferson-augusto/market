import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Searchbar } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import api from '../services/api'

const Shop = () => {
    const [query, setQuery] = useState('')

    const getData = async () => {
        const { response } = await api.get('/products')
        console.log(response)
    }

    useEffect(() => {
        getData()
    }, [])

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
        </>
    )
}

const styles = StyleSheet.create({
    containerNav: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
})

export default Shop