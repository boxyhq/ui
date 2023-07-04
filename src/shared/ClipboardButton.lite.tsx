import IconButton from './IconButton.lite';

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export const CopyToClipboardButton = ({
  text,
  translation,
  toastSucessCallback,
}: {
  text: string;
  translation: any;
  toastSucessCallback: () => void;
}) => {
  return (
    <IconButton
      tooltip={translation('copy')}
      Icon={
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
            d='M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z'
          />
        </svg>
      }
      className='hover:text-primary'
      onClick={() => {
        copyToClipboard(text);
        toastSucessCallback();
      }}
    />
  );
};

export default function InputWithCopyButton({
  text,
  label,
  translation,
  toastSucessCallback,
}: {
  text: string;
  label: string;
  translation: any;
  toastSucessCallback: () => void;
}) {
  return (
    <div>
      <div className='flex justify-between'>
        <label className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>{label}</label>
        <CopyToClipboardButton
          toastSucessCallback={toastSucessCallback}
          translation={translation}
          text={text}
        />
      </div>
      <input type='text' value={text} key={text} readOnly className='input-bordered input w-full text-sm' />
    </div>
  );
}
