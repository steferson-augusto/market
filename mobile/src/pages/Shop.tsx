import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, Image, TouchableHighlight } from 'react-native'
import { Searchbar, Surface, Subheading, Text, IconButton, Colors, Button } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'

import api from '../services/api'
import { Product } from '../services/types'
import { SET_PRODUCTS, RESET_PRODUCTS } from '../store/actionTypes'
import useDebounce from '../services/hooks/useDebounce'
import { Select, LoaderProducts, Header, ModalCartItem } from './Components'
// import { IconCart } from './Components'

const orderOptions = [
    { name: 'Menor preço', id: 0 },
    { name: 'Maior preço', id: 1 },
    { name: 'Nome crescente', id: 2 },
    { name: 'Nome decrescente', id: 3 },
]

const orders = [
    { columnName: 'price', direction: 'asc' },
    { columnName: 'price', direction: 'desc' },
    { columnName: 'name', direction: 'asc' },
    { columnName: 'name', direction: 'desc' },
]

const Shop = ({ navigation }) => {
    const dispatch = useDispatch()
    const { data: products, total, cart } = useSelector(state => state.products)
    const sections = useSelector(state => state.sections.data)
    const [loading, setLoading] = useState(true)
    const [visible, setVisible] = useState(false)
    const [query, setQuery] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)
    const [section, setSection] = useState(0)
    const [order, setOrder] = useState(2)
    const [page, setPage] = useState(0)
    
    const debounceSearch = useDebounce(query)

    const getData = async () => {
        if (!endList()) {
            try {
                setLoading(true)
                if (page == 0) dispatch({ type: RESET_PRODUCTS, payload: 0 })
                const { data } = await api.post('/products', { section, query, ...orders[order], page, perPage: 2 })

                dispatch({ type: SET_PRODUCTS, payload: data })
                setLoading(false)
            } catch (response) {
                console.log('Erro na requisiçao')
            }
        }
    }

    useEffect(() => {
        dispatch({ type: RESET_PRODUCTS, payload: 0 })
        setPage(0)
    }, [section, order, debounceSearch])

    useEffect(() => {
        getData()
    }, [page])

    const endReached = () => setPage(page + 1)

    const toggleFilterOpen = () => setFilterOpen(!filterOpen)

    const endList = () => products.length > 0 && parseInt(total) <= products.length

    const handleAddCart = (product: Product) => {
        setVisible(true)
        console.log(product)
    }

    const renderItem = (product) => {
        const { name, price, id } = product.item
        const source = { uri: `http://localhost:3333/products/${id}/image` }
        return (
            <Surface style={styles.surface}>
                <Image source={source} style={styles.image} />
                <TouchableHighlight style={styles.containerProduct}
                    onPress={() => navigation.navigate('Product', { product: product.item })}
                >
                    <>
                    <View style={styles.containerDetail}>
                        <Subheading>{name}</Subheading>
                        <View style={styles.containerPrice}>
                            <Text style={styles.cipher}>R$</Text>
                            <Text style={styles.price}>{price}</Text>
                        </View>
                    </View>
                    <View style={styles.containerAction}>
                        <IconButton icon="receipt" color={Colors.pinkA400} size={30} onPress={() => console.log('Lista')} />
                        <IconButton icon={require('../assets/cart.png')} color={Colors.deepPurpleA700} size={30} onPress={() => handleAddCart(product.item)} />
                    </View>
                    </>
                </TouchableHighlight>
            </Surface>
        )
    }

    const renderLoading = () => {
        if (endList()) return <Text style={styles.fullProducts}>Não há mais produtos</Text>
        if (!loading) return null
        return <LoaderProducts loading={true} num={3} />
    }

    const modalDismiss = () => setVisible(false)

    return (
        <>
            <View style={styles.containerNav}>
                <Searchbar
                    placeholder="Pesquisar"
                    onChangeText={text => setQuery(text)}
                    onEndEditing={() => getData()}
                    onIconPress={() => getData()}
                    value={query} style={styles.searchBar}
                />
                <IconButton icon="filter-list" color={Colors.grey500} style={styles.iconButtonFilter}
                    size={20} onPress={toggleFilterOpen}
                />
            </View>

            {filterOpen && (
                <View style={styles.containerFilter}>
                    <Select label="Seção" data={sections} selected={section} onChange={setSection} />
                    <Select label="Ordenar" data={orderOptions} selected={order} onChange={setOrder} />
                </View>
            )}

            <FlatList
                data={products}
                renderItem={product => renderItem(product)}
                keyExtractor={(item: Product, index: number) => `${index}`}
                onEndReached={endReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderLoading}
            />

            <ModalCartItem visible={visible} dismiss={modalDismiss} />
           
        </ >
    )
}
 
Shop.navigationOptions = ({ navigation }) => ({
    header: () => <Header navigation={navigation} />
})


const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
    },
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
    },
    fullProducts: {
        alignSelf: 'center',
        paddingVertical: 20,
        fontSize: 20,
        color: '#888',
        fontWeight: 'bold'
    }
})

export default Shop