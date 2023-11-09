import styles from './App.module.scss';
import { Web3Provider } from './context/Web3Context';
import RoleRoutes from './rbac/RoleRoutes';

function App() {
  return (
    <Web3Provider>
      <div className={styles.app}>
        <RoleRoutes />
      </div>
    </Web3Provider>
  );
}

export default App;
