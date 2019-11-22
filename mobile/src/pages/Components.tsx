import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, Picker, FlatList, Image, View, TouchableNativeFeedback, TouchableNativeFeedbackBase } from 'react-native'
import { Appbar, Badge, Text, Surface, Colors, IconButton, Paragraph, Button } from 'react-native-paper'
import { Placeholder, PlaceholderMedia, PlaceholderLine, Shine } from 'rn-placeholder'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import Popover from 'react-native-popover-view'
import Modal from 'react-native-modal'
import LottieView from 'lottie-react-native'

import { DEL_FROM_CART } from '../store/actionTypes'
import { numberToPrice } from '../services/utils'

export const IconCart = ({ size = 24, color = '#fff' }) => <IconMaterial name="shopping-cart" size={size} color={color} />

export const Header = ({ navigation }) => {
    const dispatch = useDispatch()
    const { products, total } = useSelector(state => state.cart)
    const [visible, setVisible] = useState(false)
    const ref = useRef()

    const removeItem = (quantity, { id, price }) => dispatch({ type: DEL_FROM_CART, payload: { id, price: price * quantity } })

    const renderItem = ({ item }) => {
        const { quantity, product } = item
        const { name, price, id } = product
        const source = { uri: `http://localhost:3333/products/${id}/image` }
        return (
            <TouchableNativeFeedback onPress={() => navigation.navigate('Product', { product })}>
            <Surface style={styles.containerItem}>
                <Image source={source} style={styles.image} />
                <View style={styles.containerProduct}>
                    <View style={styles.containerDetail}>
                        <Paragraph numberOfLines={1}>{name}</Paragraph>
                        <View style={styles.containerPrice}>
                            <Text style={styles.cipher}>{`${quantity} x R$`}</Text>
                            <Text style={styles.price}>{numberToPrice(price)}</Text>
                        </View>
                    </View>
                    <View style={styles.containerAction}>
                        <IconButton icon="delete" color='#1c227e' size={30} onPress={() =>removeItem(quantity, product)} />
                    </View>
                </View>
            </Surface>
            </TouchableNativeFeedback>
        )
    }

    return (
        <Appbar.Header>
            <Appbar.Action icon='add' color='transparent' />
            <Appbar.Content title='PRODUTOS' titleStyle={{ alignSelf: "center" }} />

            <Appbar.Action icon={IconCart} onPress={() => setVisible(!visible)} ref={ref} />
            {products.length > 0 && <Badge style={styles.badge}>{products.length}</Badge>}

            <Popover
                isVisible={visible}
                fromView={ref.current}
                onRequestClose={() => setVisible(false)}
                placement='bottom'
                backgroundStyle={{ backgroundColor: 'transparent' }}
                popoverStyle={styles.popoverHeader}
            >
                {products.length > 0 ? (
                    <>
                        <FlatList
                            data={products} style={{ height: 300 }}
                            renderItem={item => renderItem(item)}
                            keyExtractor={(item, index) => `${index}`}
                            showsVerticalScrollIndicator={false}
                        />
                        {total > 0 && (
                            <View style={styles.containerPopoverButton}>
                                <Text style={{ flex: 1, color: '#eee', fontSize: 18 }}>{numberToPrice(total, 'R$')}</Text>
                                <Button mode="contained" color={Colors.pinkA400}>FINALIZAR</Button>
                            </View>
                        )}
                    </>
                ) : (
                    <LottieView style={{ height: 200, width: 200, alignSelf: 'center' }}
                    source={require('../assets/animations/empty_cart.json')} autoPlay loop />
                )}

            </Popover>
        </Appbar.Header>
    )
}

export const ModalCartItem = ({ visible, dismiss }) => (
    <Modal isVisible={visible}
        onBackdropPress={dismiss}
        onSwipeComplete={dismiss}
        swipeDirection={['down', 'up']}
    >
        <View style={{ height: 200, backgroundColor: '#bbb' }}>
            <Text>Hello!</Text>
            <Button onPress={dismiss}>FECHAR</Button>
        </View>
    </Modal>
)

export const Select = ({ label, data, onChange, selected = 0, style = styles.select }) => {
    return (
        <Surface style={{ elevation: 4, marginHorizontal: 5 }}>
            <Text style={styles.selectLabel}>{label}:</Text>
            <Picker mode='dropdown'
                selectedValue={selected}
                style={style} itemStyle={{ fontWeight: 'bold' }}
                onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
            >
                {/* {(all !== '') && <Picker.Item label={all} value={false} />} */}
                {data.map(({ id, name }) => <Picker.Item label={name} value={id} key={`${id}`} />)}
            </Picker>
        </Surface>
    )
}

const ImageLoad = () => (
    <PlaceholderMedia style={styles.imageProduct} />
)

export const LoaderProduct = () => {
    return (
        <Surface style={styles.surfaceProduct}>
            <Placeholder
                style={{ justifyContent: 'center', alignItems: 'center' }}
                Left={ImageLoad}
                Animation={props => (
                    <Shine {...props} style={{ backgroundColor: "#fff" }} />
                )}
            >
                {/* <PlaceholderMedia style={styles.imageProduct} /> */}

                <PlaceholderLine style={styles.titleProduct} />
                <PlaceholderLine style={styles.priceProduct} />

            </Placeholder>
        </Surface>
    )
}

interface LoaderProductsProps {
    num?: number
    loading: boolean
}
export const LoaderProducts = ({ num = 1, loading }: LoaderProductsProps) => (
    (loading &&
        <>
            {Array(num).fill(num).map((n, index) => <LoaderProduct key={`${index}`} />)}
        </>
    )
)

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    select: {
        height: 30,
        width: 170,
    },
    surface: {
        elevation: 4,
        backgroundColor: '#888'
    },
    selectLabel: {
        paddingTop: 6,
        paddingLeft: 6,
    },
    surfaceProduct: {
        flexDirection: 'row',
        height: 100,
        width: '94%',
        marginHorizontal: '3%',
        marginVertical: 7,
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
    },
    imageProduct: {
        width: 85,
        height: 92,
        marginHorizontal: 5
    },
    titleProduct: {
        minHeight: 18,
        width: '80%',
        marginLeft: '8%',
        backgroundColor: '#ddd'
    },
    priceProduct: {
        minHeight: 40,
        width: '30%',
        marginLeft: '30%',
        backgroundColor: '#ddd'
    },
    popoverHeader: {
        width: 250,
        backgroundColor: '#1c227e',
        paddingHorizontal: 6,
        paddingTop: 10,
    },
    containerPopoverButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
    },
    containerItem: {
        flexDirection: 'row',
        height: 55,
        width: '100%',
        marginVertical: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
    },
    image: {
        width: 40,
        height: 42,
        resizeMode: 'contain',
        marginLeft: 5,
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
        fontSize: 13,
        color: '#aaa',
        paddingRight: 6,
    },
    price: {
        fontSize: 20,
        color: '#777',
        fontWeight: 'bold',
    },
})