import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Button, IconButton, Title, Text, Colors } from 'react-native-paper'
import NumericInput from 'react-native-numeric-input'

import { IconCart } from './Components'

const Product = ({ navigation }) => {
    const { id, price, name } = navigation.getParam('product')
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(0)
    const item = useSelector(state => state.cart.products.filter(({ product }) => product.id == id))

    useEffect(() => {
        console.log(item)
        console.log(id)
        if (item.length > 0) {
            setQuantity(item[0].quantity)
        }
    }, [])
    // console.log(product)
    return (
        <View style={styles.container}>
            <View style={styles.containerDetail}>
                <Image
                    style={styles.image}
                    source={{ uri: `http://localhost:3333/products/${id}/image` }}
                />
                <View style={styles.detail}>
                    <View style={styles.containerPrice}>
                        <Text style={styles.cipher}>R$</Text>
                        <Text style={styles.price}>{price}</Text>
                    </View>
                    <Text style={styles.cipher}>Quantidade</Text>
                    <NumericInput rounded
                        value={quantity} valueType='integer' minValue={0} maxValue={15}
                        onChange={value => setQuantity(value)}
                        iconStyle={{ color: '#fff' }} inputStyle={{ fontSize: 20 }}
                        rightButtonBackgroundColor={Colors.deepPurpleA700}
                        leftButtonBackgroundColor={Colors.deepPurpleA700}
                    />
                    <Button mode='contained' icon={IconCart} >CARRINHO</Button>
                    <Button mode='contained' icon='receipt' color={Colors.pinkA400}>LISTA</Button>
                </View>
            </View>
            <View style={styles.containerContent}>
                <Title>{name}</Title>
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
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        flex: 1,
        alignItems: 'flex-start',
        borderColor: 'red',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    image: {
        marginVertical: 15,
        height: 200,
        width: 200,
        resizeMode: 'contain',
    },
    containerDetail: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderColor: 'green',
        borderWidth: 1,
        borderStyle: 'solid',

    },
    detail: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    containerPrice: {
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

export default Product