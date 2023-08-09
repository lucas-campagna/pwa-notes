import LoginView from './components/LoginView'
import MainView from './components/MainView'
import Auth from './components/Auth'
import Alerts from './components/Alerts';

export default function App() {
  return (
    <Alerts>
      <Auth login={<LoginView/>}>
        <MainView/>
      </Auth>
    </Alerts>
  );
}
