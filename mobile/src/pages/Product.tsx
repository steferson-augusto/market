import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image, Dimensions } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Button, IconButton, Title, Text, Colors, Badge } from 'react-native-paper'
import NumericInput from 'react-native-numeric-input'

import { EDIT_CART } from '../store/actionTypes'
import { numberToPrice } from '../services/utils'

const Product = ({ navigation }) => {
    const dispatch = useDispatch()
    const product = navigation.getParam('product')
    const { id, price, name, mark, section } = product
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(0)
    const item = useSelector(state => state.cart.products.filter(({ product }) => product.id == id))

    useEffect(() => {
        if (item.length > 0) {
            setQuantity(item[0].quantity)
        }
    }, [])

    const handleQuantity = value => {
        setQuantity(value)
        dispatch({ type: EDIT_CART, payload: { product, quantity: value } })
    }
    
    return (
            <View style={styles.container}>
                <View style={styles.containerDetail}>
                    <Title>{name}</Title>
                    <Image
                        style={styles.image}
                        source={{ uri: `http://localhost:3333/products/${id}/image` }}
                    />
                </View>
                <View style={styles.containerContent}>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            {section && (
                                <Badge style={{ marginHorizontal: 3, backgroundColor: Colors.deepPurple700 }}>{section}</Badge>
                            )}
                            {mark && (
                                <Badge style={{ marginHorizontal: 3 }}>{mark}</Badge>
                            )}
                        </View>
                    </View>
                    <View style={styles.containerPrice}>
                        <Text style={styles.cipher}>R$</Text>
                        <Text style={styles.price}>{numberToPrice(price)}</Text>
                    </View>
                    <View style={styles.detail}>
                        <Text style={styles.cipher}>Carrinho</Text>
                        <NumericInput rounded
                            value={quantity} valueType='integer' minValue={0} maxValue={15} initValue={quantity}
                            onChange={value => handleQuantity(value)}
                            iconStyle={{ color: '#fff' }} inputStyle={{ fontSize: 28 }}
                            rightButtonBackgroundColor={Colors.deepPurpleA700}
                            leftButtonBackgroundColor={Colors.deepPurpleA700}
                            totalHeight={60} totalWidth={140}
                        />
                        <Button mode='contained' icon='receipt'
                            color={Colors.pinkA400}
                            style={{ marginVertical: 10 }}
                        >Lista de Compras</Button>
                    </View>
                </View>
            </View>
    )
}

Product.navigationOptions = ({ navigation }) => {
    const param = navigation.getParam('product')
    return ({
        title: param.name,
        headerLeft: () => <IconButton icon='chevron-left' color='#fff' size={32} onPress={() => navigation.goBack()} />,
    })
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    containerContent: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        alignItems: 'center',
    },
    image: {
        marginVertical: 15,
        height: 200,
        width: 200,
        resizeMode: 'contain',
    },
    containerDetail: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    detail: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    containerPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cipher: {
        fontSize: 20,
        color: '#888',
        paddingRight: 7,
    },
    price: {
        fontSize: 48,
        color: '#777',
        fontWeight: 'bold',
    },
})

export default Product