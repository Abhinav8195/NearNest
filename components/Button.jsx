import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { theme } from '../constants/theme';
import { hp } from '../helpers/common'; // Make sure hp is imported
import Loading from './Loading';

const Button = ({
    buttonStyle,
    textStyle,
    title = '',
    onPress = () => {},
    loading = false,
    hasShadow = true
}) => {

    const shadowStyle={
        shadowColor:theme.Colors.dark,
        shadowOffset:{width:0,height:10},
        shadowOpacity:0.2,
        shadowRadius:8,
        elevation:4
    }

    if(loading){
        return(
            <View style={[styles.button, buttonStyle, {backgroundColor:'white'}]}>
                <Loading/>
            </View>
        )
    }
    return (
        <TouchableOpacity 
            onPress={onPress} 
            style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
        >
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

export default Button;

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.Colors.primary,
        height: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve:'continuous',
        borderRadius: theme.radius.xl
    },
    text: {
        color: 'white',
        fontSize: hp(2.5),
        fontWeight:theme.fonts.bold
    },
    // shadow: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.8,
    //     shadowRadius: 2,
    //     elevation: 5,
    // }
});
