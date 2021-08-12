  
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

// export function CommentCard({style, children, onPress}) {
//   return (
//     <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
//       {children}
//     </TouchableOpacity>
//   );
// }

export function CommentCard({style, children}) {
  return (
    <TouchableOpacity style={[styles.card, style]} >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
  },
});