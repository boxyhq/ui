import { EmptyStateProps } from '../types';
import { Slot } from '@builder.io/mitosis';

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div
      className={`my-3 flex flex-col items-center justify-center space-y-3 rounded border py-32 ${props.className}`}>
      <h1>Hello world</h1>
      <div className='h-10 w-10'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          class='w-6 h-6'>
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
          />
        </svg>
      </div>
      <h4 className='text-center'>{props.title}</h4>
      {props.description && <p className='text-center text-gray-500'>{props.description}</p>}
    </div>
  );
}
