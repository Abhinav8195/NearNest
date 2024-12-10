import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'
const RichTextEditor = ({
    editorRef,
    onChange
}) => {
  return (
    <View style={{minHeight:85}}>

   

      <RichToolbar
      actions= {[
        actions.setStrikethrough,
        actions.removeFormat,
        actions.setBold,
        actions.setItalic,
        actions.insertOrderedList,
        actions.blockquote,
        // actions.alignLeft,
        // actions.alignCenter,
        // actions.alignRight,
        actions.code,
        actions.line,
        actions.heading1,
        actions.heading4
      ]}
      iconMap={{
        [actions.heading1]:({tintColor})=> <Text style={{color:tintColor}} >H1</Text>,
        [actions.heading4]:({tintColor})=> <Text style={{color:tintColor}} >H4</Text>
      }}
      style={styles.richBar}
      flatContainerStyles={styles.listStyle}
      editor={editorRef}
      selectedIconTint={theme.Colors.primaryDark}
      disabled={false} />

<RichEditor  ref={editorRef} 
    containerStyle={styles.rich}
    editorStyle={styles.contentStyle}
    placeholder={"What's on your mind?"}
    onChange={onChange}
    />
    </View>

    
  )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar:{
        borderTopRightRadius:theme.radius.xl,
        borderTopLeftRadius:theme.radius.xl,
        backgroundColor:theme.Colors.gray
    }
})