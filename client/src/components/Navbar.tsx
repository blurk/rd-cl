import Link from 'next/link';
import React from 'react';
import RedditLogo from '../images/reddit.svg';

const Navbar: React.FC = () => (
	<div className='fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white'>
		{/* LOGO AND TITLE */}
		<div className='flex items center'>
			<Link href='/'>
				<a>
					<RedditLogo className='w-8 h-8 mr-2 ' />
				</a>
			</Link>
			<span className='text-2xl font-semibold'>
				<Link href='/'>Reddit</Link>
			</span>
		</div>
		{/* SEARCH INPUT */}
		<div className='flex items-center mx-auto border rou0ded bg-gray-102 hover:border-blue-500 hover:bg-white'>
			<i className='pl-4 pr-3 text-gray-500 fas fa-search'></i>
			<input
				type='text'
				className='py-1 pr-3 bg-transparent rounded focus:outline-none w-160'
				placeholder='Search...👀'
			/>
		</div>
		{/* AUTH BUTTONS */}
		<div className='flex'>
			<Link href='/login'>
				<a className='w-32 py-1 mr-4 leadding-5 hollow blue button'>Login</a>
			</Link>
			<Link href='/register'>
				<a className='w-32 py-1 leadding-5 blue button'>Register</a>
			</Link>
		</div>
	</div>
);

export default Navbar;
