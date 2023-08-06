import LoginView from './components/LoginView'
import MainView from './components/MainView'
import Auth from './components/Auth'

export default function App() {

  return (
    <Auth login={<LoginView/>}>
      <MainView/>
    </Auth>
  );
}
