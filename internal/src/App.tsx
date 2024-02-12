import { WellKnownURLs } from './well-known';
import { Button } from './shared/Button';

import './index.css';

function App() {
  return (
    <>
    <Button />
      <WellKnownURLs jacksonUrl="/abc" />
    </>
  );
}

export default App;
