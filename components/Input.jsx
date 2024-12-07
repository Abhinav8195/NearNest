import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

const Input = ({props}) => {
  return (
    <View style={[styles.container]}>
        
      <TextInput
      style={{flex:1}}
      placeholderTextColor={theme.Colors.textLight}
     
      {...props}
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container:{
    flexDirection:'row',
    height:hp(7.2),
    alignItems:'center',
    justifyContent:'center',
    borderWidth:0.4,
    borderWidth:0.4,
    borderColor:theme.Colors.text,
    borderRadius:theme.radius.xxl,
    borderCurve:'continuous',
    paddingHorizontal:18,
    gap:12
}

})