import classNames from 'classnames';
import React from 'react';

interface InputGroupProps {
	className?: string;
	type: string;
	placeholder: string;
	value: string;
	error: undefined | string;
	setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
	className,
	type,
	placeholder,
	value,
	error,
	setValue,
}) => {
	return (
		<div className={className}>
			<input
				type={type}
				className={classNames(
					'w-full p-3 transition border border-gray-300 rounded outline-none duratiion-200 bg-gray-50 focus:bg-white hover:bg-white',
					{
						'border-red-500': error,
					}
				)}
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
			/>
			<small className='font-medium text-red-600'>{error}</small>
		</div>
	);
};

export default InputGroup;
