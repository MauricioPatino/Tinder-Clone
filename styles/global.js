// global.js
import colors from './colors';
import spacing from './spacing';

export default {
  container: {
    flex: 1,
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};
