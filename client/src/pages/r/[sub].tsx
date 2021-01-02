import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, createRef, useEffect, useState } from 'react';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';
import { useAuthState } from '../../context/auth';
import { Sub } from '../../types';

export default function SubPage() {
	//Local State
	const [isOwnSub, setIsOwnSub] = useState(false);
	//Global State
	const { authenticated, user } = useAuthState();
	//Utils
	const router = useRouter();
	const fileInputRef = createRef<HTMLInputElement>();

	const subName = router.query.sub;

	const { data: sub, error, revalidate } = useSWR<Sub>(
		subName ? `/subs/${subName}` : null
	);

	useEffect(() => {
		if (!sub) return;
		setIsOwnSub(authenticated && user.username === sub.username);
	}, [sub]);

	//* Handle file input

	const openFileInput = (type: string) => {
		if (!isOwnSub) return;
		fileInputRef.current.name = type;
		fileInputRef.current.click();
	};

	const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files[0];

		const formData = new FormData();
		formData.append('file', file); //the image
		formData.append('type', fileInputRef.current.name); //type: banner or image

		try {
			await axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});

			revalidate();
		} catch (err) {
			console.log(err);
		}
	};

	if (error) router.push('/');

	let postsMarkup;

	if (!sub) {
		postsMarkup = <p className='text-lg text-center'>Loading...</p>;
	} else if (sub.posts.length === 0) {
		postsMarkup = (
			<p className='text-lg text-center'>
				There are no posts on this sub yet 😭...
			</p>
		);
	} else {
		postsMarkup = sub.posts.map((post) => (
			<PostCard key={post.identifier} post={post} />
		));
	}

	return (
		<>
			<Head>
				<title>{sub?.title}</title>
			</Head>
			{sub && (
				<>
					<input
						type='file'
						hidden={true}
						ref={fileInputRef}
						onChange={uploadImage}
					/>
					{/*SUBINFO AND IMAGES*/}
					<div>
						{/* BANNER IMAGE */}
						<div
							className={classNames('bg-blue-500', {
								'cursor-pointer': isOwnSub,
							})}
							onClick={() => openFileInput('banner')}>
							{sub.bannerUrl ? (
								<div
									className='h-56 bg-blue-500'
									style={{
										backgroundImage: `url(${sub.bannerUrl}) `,
										backgroundRepeat: 'no-repeat',
										backgroundPosition: 'center',
										backgroundSize: 'cover',
									}}></div>
							) : (
								<div className='h-20 bg-blue-500'></div>
							)}
						</div>
						{/* SUB METADATA */}
						<div className='h-20 bg-white '>
							<div className='container relative flex'>
								<div className='absolute -top-4'>
									<Image
										src={sub.imageUrl}
										alt='Sub'
										className={classNames('rounded-full', {
											'cursor-pointer': isOwnSub,
										})}
										onClick={() => openFileInput('image')}
										width={70}
										height={70}
									/>
								</div>
								<div className='p-1 pl-24'>
									<div className='flex items-center'>
										<h1 className='mb-1 text-2xl font-bold'>{sub.title}</h1>
									</div>
									<p className='text-sm text-gray-500 '>/r/{sub.name}</p>
								</div>
							</div>
						</div>
					</div>
					{/* POST AND SIDEBAR */}
					<div className='container flex pt-5'>
						<div className='w-160'>{postsMarkup}</div>
					</div>
				</>
			)}
		</>
	);
}
