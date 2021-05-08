import axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from '../context/auth';
import { LOGIN } from '../helpers/path_helper';
import { POST_MISC_VOTE } from '../helpers/url_helpers';
import { Post } from '../types';
import ActionButton from './ActionButton';

dayjs.extend(relativeTime);

interface PostCardProps {
	post: Post;
	revalidate?: Function;
}

export default function PostCard({ post, revalidate }: PostCardProps) {
	const { authenticated } = useAuthState();
	const router = useRouter();
	const isInSubPage = router.pathname === '/r/[sub]';

	const vote = async (value: number) => {
		if (!authenticated) router.push(LOGIN);

		if (value === post.userVote) value = 0;

		try {
			const res = await axios.post(POST_MISC_VOTE, {
				identifier: post.identifier,
				slug: post.slug,
				value
			});

			if (revalidate) revalidate();

			console.log(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div
			key={post.identifier}
			className='flex mb-4 bg-white rounded'
			id={post.identifier}>
			{/* Vote section */}
			<div className='w-10 py-3 text-center bg-gray-200 rounded-l'>
				{/* Upvote */}
				<div
					className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
					onClick={() => vote(1)}>
					<i
						className={classNames('icon-arrow-up', {
							'text-red-500': post.userVote === 1
						})}></i>
				</div>
				<p className='text-xs font-bold'>{post.voteScore}</p>
				{/* Downvote */}
				<div
					className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600'
					onClick={() => vote(-1)}>
					<i
						className={classNames('icon-arrow-down', {
							'text-blue-600': post.userVote === -1
						})}></i>
				</div>
			</div>
			{/* Post data section */}
			<div className='w-full p-2'>
				<div className='flex items-center'>
					{!isInSubPage && (
						<>
							<Link href={`/r/${post.subName}`}>
								<img
									src={post.sub.imageUrl}
									className='w-6 h-6 mr-1 rounded-full cursor-pointer'
								/>
							</Link>
							<Link href={`/r/${post.subName}`}>
								<a className='text-xs font-bold cursor-pointer hover:underline'>
									/r/{post.subName}
								</a>
							</Link>
							<span className='mx-1 text-xs text-gray-500'>•</span>
						</>
					)}
					<p className='text-xs text-gray-500'>
						Posted by
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

				<div className='flex'>
					<Link href={post.url}>
						<a>
							<ActionButton>
								<i className='mr-1 fas fa-comment-alt fa-xs'></i>
								<span className='font-bold'>{post.commentCount} Comments</span>
							</ActionButton>
						</a>
					</Link>
					<ActionButton>
						<i className='mr-1 fas fa-share fa-xs'></i>
						<span className='font-bold'>Share</span>
					</ActionButton>
					<ActionButton>
						<i className='mr-1 fas fa-bookmark fa-xs'></i>
						<span className='font-bold'>Save</span>
					</ActionButton>
				</div>
			</div>
		</div>
	);
}
