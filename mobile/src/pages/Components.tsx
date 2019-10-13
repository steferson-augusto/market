import React from 'react'
import { StyleSheet, } from 'react-native'
import { Appbar, Badge } from 'react-native-paper'
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

const styles = StyleSheet.create({
    badge: {
      position: 'absolute',
      top: 5,
      right: 5,
    },
})