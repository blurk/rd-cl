import axios from 'axios';
import { AppProps } from 'next/app';
import '../styles/globals.css';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}

export default App;
