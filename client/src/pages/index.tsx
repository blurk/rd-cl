import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import PostCard from '../components/PostCard';
import { Sub } from '../types';
export default function Home() {
	const { data: posts } = useSWR('/posts');
	const { data: topSubs } = useSWR('/misc/top-subs');

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
				<aside className='ml-6 w-80'>
					<div className='bg-white rounded'>
						<div className='p-4 border-b-2'>
							<p className='text-lg font-semibold text-center'>
								Top Communities
							</p>
						</div>
						<div>
							{topSubs?.map((sub: Sub) => (
								<div
									key={sub.name}
									className='flex items-center px-4 py-2 text-xs border-b'>
									<Link href={'/r/' + sub.name}>
										<Image
											className='rounded-full cursor-pointer'
											src={sub.imageUrl}
											alt='Sub'
											width={(6 * 16) / 4}
											height={(6 * 16) / 4}
										/>
									</Link>
									<Link href={'/r/' + sub.name}>
										<a className='ml-2 font-bold cursor-pointer hover:underline'>
											/r/{sub.name}
										</a>
									</Link>
									<p className='ml-auto font-md'>{sub.postCount}</p>
								</div>
							))}
						</div>
					</div>
				</aside>
			</div>
		</>
	);
}
