import './App.css';
import { HealthChainProvider } from './context/HealthChainContext';
// import { Web3Provider } from './context/Web3Context';
import RoleRoutes from './rbac/RoleRoutes';

function App() {
  return (
    <HealthChainProvider>
      <div className="App">
        <RoleRoutes />
      </div>
    </HealthChainProvider>
  );
}

export default App;
