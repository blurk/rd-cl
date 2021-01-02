import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { Post } from '../types';

export default function Home() {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		axios
			.get('/posts')
			.then((res) => setPosts(res.data))
			.catch((err) => console.error({ err }));
	}, []);
	return (
		<div className='pt-12'>
			<Head>
				<title>Reddit: the front page of the internet</title>
			</Head>
			<div className='container flex pt-4'>
				{/* POSTS FEED */}
				<div className='w-160'>
					{posts.map((post) => (
						<PostCard post={post} key={post.identifier} />
					))}
				</div>
				{/* SIDE BAR */}
			</div>
		</div>
	);
}
