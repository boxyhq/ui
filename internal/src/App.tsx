import { useState } from 'react';

import './index.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className='text-1xl font-bold underline bg-red-400'>Hello world!</h1>
      <button className='btn btn-primary'>Sign</button>
    </>
  );
}

export default App;
