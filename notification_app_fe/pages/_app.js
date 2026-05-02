import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../style/theme';
import { NotificationProvider } from '../state/notificationStore';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </ThemeProvider>
  );
}
