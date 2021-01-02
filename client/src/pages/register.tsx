import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useAuthState } from '../context/auth';

export default function Register() {
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [agreement, setAgreement] = useState(false);
	const [errors, setErrors] = useState<any>({});

	const router = useRouter();

	const { authenticated } = useAuthState();
	if (authenticated) {
		router.push('/');
	}
	const submitForm = async (event: FormEvent) => {
		event.preventDefault();

		if (!agreement) {
			setErrors({ ...errors, agreement: 'You must agree to term' });
			return;
		}

		try {
			await axios.post('/auth/register', {
				email,
				username,
				password,
			});

			router.push('/login');
		} catch (err) {
			setErrors(err.response.data);
		}
	};

	return (
		<div className='flex bg-white'>
			<Head>
				<title>Register</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div
				className='h-screen bg-center bg-cover w-36'
				style={{ backgroundImage: "url('/images/bricks.jpg')" }}></div>
			<div className='flex flex-col justify-center pl-6'>
				<div className='w-70'>
					<h1 className='mb-2 text-lg font-medium'>Sign up</h1>
					<p className='mb-10 text-xs'>
						By continuing, you agree to our User Agreement and Privacy Policy
					</p>

					<form onSubmit={submitForm}>
						<div className='mb-6'>
							<input
								type='checkbox'
								id='agreement'
								checked={agreement}
								onChange={(e) => setAgreement(e.target.checked)}
								className='mr-1 cursor-pointer'
							/>
							<label htmlFor='agreement' className='text-xs cursor-pointer'>
								I agree to get emails about cool stuff on Reddit
							</label>
							<small className='block font-medium text-red-600'>
								{errors.agreement}
							</small>
						</div>
						<InputGroup
							className='mb-2'
							type='email'
							setValue={setEmail}
							placeholder='Email'
							error={errors.email}
							value={email}
						/>
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
							Sign up
						</button>
					</form>

					<small>
						Already a redditors?
						<Link href='/login'>
							<a className='ml-1 text-blue-500 uppercase'>Log In</a>
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
}
