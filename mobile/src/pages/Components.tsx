import React from 'react'
import { StyleSheet, Picker, View } from 'react-native'
import { Appbar, Badge, Text, Surface } from 'react-native-paper'
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

export const Select = ({ label, data, onChange, selected, all="Todos", style = styles.select }) => {
    return (
        <Surface style={styles.surface}>
            <Text style={styles.selectLabel}>{label}:</Text>
            <Picker mode='dropdown'
                selectedValue={selected}
                style={style} itemStyle={{ fontWeight: 'bold' }}
                onValueChange={(itemValue, itemIndex) => onChange(itemValue) }
            >
                <Picker.Item label={all} value={0} />
                {data.map(({ id, name }) => <Picker.Item label={name} value={id} key={`${id}`} /> )}
            </Picker>
        </Surface>
    )
}

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
    }
})