import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, Image, Picker } from 'react-native'
import { Searchbar, Surface, Subheading, Text, IconButton, Colors, Menu, Button } from 'react-native-paper'
import { useDispatch, useSelector } from "react-redux"

import api from '../services/api'
import { Select } from './Components'

const orderOptions = [
    { name: 'Menor preço', id: 'price:asc' },
    { name: 'Maior preço', id: 'price:desc' },
    { name: 'Nome crescente', id: 'name:asc' },
    { name: 'Nome decrescente', id: 'name:desc' },
]

interface MenuType {
    section: boolean
    order: boolean
}

const Shop = () => {
    const dispatch = useDispatch()
    const sections = useSelector(state => state.sections.data)
    const [query, setQuery] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)
    const [products, setProducts] = useState([])
    const [menu, setMenu] = useState<MenuType>({ section: false, order: false })
    const [section, setSection] = useState(0)
    const [order, setOrder] = useState(0)
    console.log(sections)

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

    const toggleFilterOpen = () => setFilterOpen(!filterOpen)

    const toggleMenuOpen = attr => setMenu({ ...menu, [attr]: true })
    const toggleMenuClose = attr => setMenu({ ...menu, [attr]: false })

    const renderItem = (product) => {
        const { name, price, id } = product.item
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
                    value={query} style={styles.searchBar}
                />
                <IconButton icon="filter-list" color={Colors.grey500} style={styles.iconButtonFilter}
                    size={20} onPress={toggleFilterOpen}
                />
            </View>

            {filterOpen && (
                <View style={styles.containerFilter}>
                    <Select label="Seção" data={sections} selected={section} onChange={setSection} />
                    <Select label="Ordenar" data={orderOptions} selected={order} onChange={setOrder} all=" " style={{ height: 30, width: 200 }} />
                </View>
            )}
            
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
    containerFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: '3%',
        paddingVertical: 8,
        // borderWidth: 1, borderStyle: 'solid', borderColor: '#000'
    },
    iconButtonFilter: {
        marginHorizontal: 12
    },
    searchBar: {
        flex: 1,
        marginLeft: '3%',
    },
    section: {
        padding: 0
    }
})

export default Shop