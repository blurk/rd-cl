import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Post } from '../types';

dayjs.extend(relativeTime);

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
						<div key={post.identifier} className='flex mb-4 bg-white rounded'>
							{/* VOTE SECTION */}
							<div className='w-10 text-center bg-gray-200 rounded-l'>
								<p>⬆</p>
							</div>
							{/* POST DATA SECTION */}
							<div className='w-full p-2'>
								<div className='flex items-center'>
									<Link href={`/r/${post.subName}`}>
										<>
											<img
												src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
												className='w-6 h-6 mr-1 rounded-full cursor-pointer'
											/>
											<a className='text-xs font-bold cursor-pointer hover:underline'>
												/r/{post.subName}
											</a>
										</>
									</Link>
									<p className='text-xs text-gray-500'>
										<span className='mx-1'>•</span> Posted by
										<Link href={`/u/${post.username}`}>
											<a className='mx-1 hover:underline'>/u/{post.username}</a>
										</Link>
										<Link href={post.url}>
											<a className='mx-1 hover:underline'>
												{dayjs(post.createdAt).fromNow()}
											</a>
										</Link>
									</p>
								</div>
								<Link href={post.url}>
									<a className='my-1 text-lg font-medium'>{post.title}</a>
								</Link>
								{post.body && <p className='my-1 text-sm'>{post.body}</p>}
								{/* ACTION BUTTONS */}
								<div className='flex'>
									<Link href={post.url}>
										<a>
											<div className='p-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
												<i className='mr-1 fa-xs fas fa-comment-alt'></i>
												<span className='font-bold'>20 comments</span>
											</div>
										</a>
									</Link>
									<div className='px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
										<i className='mr-1 fas fa-share fa-xs'></i>
										<span className='font-bold'>Share</span>
									</div>
									<div className='px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
										<i className='mr-1 fas fa-bookmark fa-xs'></i>
										<span className='font-bold'>Save</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
				{/* SIDE BAR */}
			</div>
		</div>
	);
}
