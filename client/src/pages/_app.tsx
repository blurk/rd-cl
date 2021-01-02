import axios from 'axios';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import '../styles/icons.css';
import '../styles/tailwind.css';
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
	const { pathname } = useRouter();
	const authRoutes = ['/register', '/login'];

	return (
		<>
			{!authRoutes.includes(pathname) && <Navbar />}
			<Component {...pageProps} />
		</>
	);
}

export default App;
