import React from 'react'
import { StyleSheet, Picker, View } from 'react-native'
import { Appbar, Badge, Text, Surface } from 'react-native-paper'
import { Placeholder, PlaceholderMedia, PlaceholderLine, Shine } from 'rn-placeholder'
import IconMaterial from 'react-native-vector-icons/MaterialIcons'

export const IconCart = () => <IconMaterial name="shopping-cart" size={24} color="white" />

interface HeaderProps {
    title: string
    subtitle?: string
}
export const Header = ({ title, subtitle }: HeaderProps ) => {
    return (
        <Appbar.Header>
            <Appbar.Content
                title={title}
                subtitle={subtitle}
            />
           
            <Appbar.Action icon={IconCart} />
            <Badge style={styles.badge}>3</Badge>
            
        </Appbar.Header>
    )
}

export const Select = ({ label, data, onChange, selected = 0, all="Todos", style = styles.select }) => {
    return (
        <Surface style={styles.surface}>
            <Text style={styles.selectLabel}>{label}:</Text>
            <Picker mode='dropdown'
                selectedValue={selected}
                style={style} itemStyle={{ fontWeight: 'bold' }}
                onValueChange={(itemValue, itemIndex) => onChange(itemValue) }
            >
                {/* {(all !== '') && <Picker.Item label={all} value={false} />} */}
                {data.map(({ id, name }) => <Picker.Item label={name} value={id} key={`${id}`} /> )}
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
    }
})