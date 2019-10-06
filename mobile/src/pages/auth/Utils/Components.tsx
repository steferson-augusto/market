import React from 'react'
import { StyleSheet, Image, ImageStyle } from 'react-native'

interface LogoProps {
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center'
    style: ImageStyle
}
export const Logo = ({ resizeMode, style }: LogoProps = { resizeMode: 'contain', style: {} }) => (
    <Image
        style={style}
        resizeMode={resizeMode}
        source={require('../../../assets/logo.png')}
    />
)

const styles = StyleSheet.create({
    logo: {
        height: 150,
        width: 150,
        marginTop: '10%',
        marginBottom: 40,
    },
})