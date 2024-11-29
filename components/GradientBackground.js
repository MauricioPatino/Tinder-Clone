// import React from 'react';
// import LinearGradient from 'react-native-linear-gradient';
// import { StyleSheet } from 'react-native';
// import { useSpring, animated, to as interpolate } from 'react-spring';

// const AnimatedLinearGradient = animated(LinearGradient);

// const GradientBackground = ({ children }) => {
//   const { color } = useSpring({
//     from: { color: 0 },
//     config: { duration: 4000 },
//     loop: { reverse: true },    
//   });

//   const colors = interpolate([color], (c) => [
//     `rgba(255, 105, 180, ${1 - c})`,  
//     `rgba(255, 215, 0, ${c})`,       
//   ]);

//   return (
//     <AnimatedLinearGradient
//       colors={colors}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.background}
//     >
//       {children}
//     </AnimatedLinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
// });

// export default GradientBackground;
