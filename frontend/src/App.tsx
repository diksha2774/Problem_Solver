import Signin from './components/Signin';
import Signup from './components/Signup';
import All_PS from './components/All_PS';
import PS_data from './components/PS_data';
import Evaluate_code from './components/Evaluate_code';
import { BrowserRouter , Routes, Route} from 'react-router-dom';
import LandingPage from './components/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/all_PS" element={<All_PS/>}/>
          <Route path="/PS_data" element={<PS_data/>}/>
          <Route path="/Evaluate_code" element={<Evaluate_code/>}/>
      </Routes>
    </BrowserRouter>
  );        
}
