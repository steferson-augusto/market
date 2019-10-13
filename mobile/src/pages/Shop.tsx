import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, Image } from 'react-native'
import { Searchbar, Surface, Subheading, Text, IconButton, Colors, Button  } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import api from '../services/api'

const Shop = () => {
    const [query, setQuery] = useState('')
    const [products, setProducts] = useState([])

    const getData = async () => {
        try {
            const { data } = await api.get('/products')
            setProducts(data)
            console.log(data)
        } catch (response) {

        }
    }

    useEffect(() => {
        getData()
    }, [])

    const renderData = ({ item }) => {
        return (
            <View style={styles.container}>
                <Text>{item.name}</Text>
            </View>
        )
    }

    const renderItem = (product) => {
        const { name, price, id } = product.item
        console.log(product)
        const source = { uri: `http://10.0.2.2:3333/products/${id}/image` }
        return (
            <Surface style={styles.surface}>
                <Image source={source} style={styles.image} />
                <View style={styles.containerProduct}>
                    <View style={styles.containerDetail}>
                        <Subheading>{ name }</Subheading>
                        <View style={styles.containerPrice}>
                            <Text style={styles.cipher}>R$</Text>
                            <Text style={styles.price}>{ price }</Text>
                        </View>
                    </View>
                    <View style={styles.containerAction}>
                        <IconButton icon="receipt" color={Colors.red500} size={30} onPress={() => console.log('Pressed')} />
                        <IconButton icon={require('../assets/cart.png')} color={Colors.blue500} size={30} onPress={() => console.log('Pressed')} />
                    </View>
                </View>
            </Surface>
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
            <FlatList
                data={products}
                renderItem={product => renderItem(product)}
                keyExtractor={item => `${item.id}`}
            />
            {/* {renderItem()}
            {renderItem()} */}
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
        justifyContent: 'space-between',
        alignContent: 'center',
        flexWrap: 'wrap',
        marginHorizontal: 8,
        marginVertical: 5,
    },
    container: {
        width: 100,
    },
    image: {
        width: 85,
        height: 92,
        resizeMode: 'contain',
    },
    surface: {
        flexDirection: 'row',
        height: 100,
        width: '94%',
        marginHorizontal: '3%',
        marginVertical: 7,
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
    },
    containerProduct: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'stretch',
    },
    containerDetail: {
        flex: 1,
        alignItems: 'center',
        // borderLeftColor: '#aaa',
        // borderRightColor: '#aaa',
        // borderRightWidth: 1,
        // borderLeftWidth: 1,
        // borderStyle: 'solid'
    },
    containerAction: {
        width: 40,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    containerPrice: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cipher: {
        fontSize: 16,
        color: '#aaa',
        paddingRight: 6,
    },
    price: {
        fontSize: 42,
        color: '#777',
        fontWeight: 'bold',
    },
})

export default Shop