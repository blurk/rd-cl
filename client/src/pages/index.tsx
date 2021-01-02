import Head from 'next/head';
import useSWR from 'swr';
import PostCard from '../components/PostCard';
export default function Home() {
	const { data: posts } = useSWR('/posts');

	return (
		<>
			<Head>
				<title>Reddit: the front page of the internet</title>
			</Head>
			<div className='container flex pt-4'>
				{/* POSTS FEED */}
				<div className='w-160'>
					{posts?.map((post) => (
						<PostCard post={post} key={post.identifier} />
					))}
				</div>
				{/* SIDE BAR */}
			</div>
		</>
	);
}
