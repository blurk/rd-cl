import axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import React from 'react';
import { Post } from '../types';
dayjs.extend(relativeTime);

const ActionButton = ({ children }) => {
	return (
		<div className='p-2 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200'>
			{children}
		</div>
	);
};

interface PostCardProps {
	post: Post;
}

export default function PostCard({
	post: {
		identifier,
		slug,
		title,
		body,
		subName,
		createdAt,
		voteScore,
		userVote,
		commentCount,
		username,
		url,
	},
}: PostCardProps) {
	const vote = async (value) => {
		try {
			const res = await axios.post('/misc/vote', {
				identifier,
				slug,
				value,
			});

			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div key={identifier} className='flex mb-5 bg-white rounded'>
			{/* VOTE SECTION */}
			<div className='py-3 text-center bg-gray-200 rounded-l w-11'>
				{/* UPVOTE */}
				<div
					className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500'
					onClick={() => vote(1)}>
					<i
						className={classNames('icon-arrow-up', {
							'text-red-500': userVote === 1,
						})}></i>
				</div>
				<p className='text-xs font-bold'>{voteScore}</p>
				{/* DOWNVOTE */}
				<div
					className='w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600'
					onClick={() => vote(-1)}>
					<i
						className={classNames('icon-arrow-down', {
							'text-blue-600': userVote === -1,
						})}></i>
				</div>
			</div>
			{/* POST DATA SECTION */}
			<div className='w-full p-3'>
				<div className='flex items-center'>
					<Link href={`/r/${subName}`}>
						<>
							<img
								src='https://www.gravatar.com/avatar/00000000000000000000037777777777?d=mp&f=y'
								className='h-6 mr-1 rounded-full cursor-pointer w-7'
							/>
							<a className='text-xs font-bold cursor-pointer hover:underline'>
								/r/{subName}
							</a>
						</>
					</Link>
					<p className='text-xs text-gray-501'>
						<span className='mx-2'>•</span> Posted by
						<Link href={`/u/${username}`}>
							<a className='mx-2 hover:underline'>/u/{username}</a>
						</Link>
						<Link href={url}>
							<a className='mx-2 hover:underline'>
								{dayjs(createdAt).fromNow()}
							</a>
						</Link>
					</p>
				</div>
				<Link href={url}>
					<a className='my-2 text-lg font-medium'>{title}</a>
				</Link>
				{body && <p className='my-2 text-sm'>{body}</p>}
				{/* ACTION BUTTONS */}
				<div className='flex'>
					<Link href={url}>
						<a>
							<ActionButton>
								<i className='mr-2 fa-xs fas fa-comment-alt'></i>
								<span className='font-bold'>{commentCount}</span>
							</ActionButton>
						</a>
					</Link>
					<ActionButton>
						<i className='mr-2 fas fa-share fa-xs'></i>
						<span className='font-bold'>Share</span>
					</ActionButton>
					<ActionButton>
						<i className='mr-2 fas fa-bookmark fa-xs'></i>
						<span className='font-bold'>Save</span>
					</ActionButton>
				</div>
			</div>
		</div>
	);
}
