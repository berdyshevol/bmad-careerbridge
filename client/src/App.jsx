import { API_BASE_URL } from './config.js';

function App() {
  return (
    <div>
      <h1>CareerBridge</h1>
      <p>API base URL: {API_BASE_URL || '(same origin, proxied through /api)'}</p>
    </div>
  );
}

export default App;
