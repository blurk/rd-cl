import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<any>({});

	const router = useRouter();

	const submitForm = async (event: FormEvent) => {
		event.preventDefault();

		try {
			await axios.post('/auth/login', {
				username,
				password,
			});

			router.push('/');
		} catch (err) {
			setErrors(err.response.data);
		}
	};

	return (
		<div className='flex bg-white'>
			<Head>
				<title>Login</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div
				className='h-screen bg-center bg-cover w-36'
				style={{ backgroundImage: "url('/images/bricks.jpg')" }}></div>
			<div className='flex flex-col justify-center pl-6'>
				<div className='w-70'>
					<h1 className='mb-2 text-lg font-medium'>Log In</h1>
					<form onSubmit={submitForm}>
						<InputGroup
							className='mb-2'
							type='text'
							setValue={setUsername}
							placeholder='Username'
							error={errors.username}
							value={username}
						/>
						<InputGroup
							className='mb-4'
							type='password'
							setValue={setPassword}
							placeholder='Password'
							error={errors.password}
							value={password}
						/>
						<button className='w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded'>
							Log In
						</button>
					</form>

					<small>
						New to reddit?
						<Link href='/register'>
							<a className='ml-1 text-blue-500 uppercase'>Register</a>
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
}
