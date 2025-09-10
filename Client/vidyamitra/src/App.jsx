// // <<<<<<< HEAD
//import { useState } from 'react'
import './App.css'
// import LoginPage from './LoginPage'
//import RegistrationPage from './RegistrationPage'
import AttendancePage from './components/AttendancePage'
//import Assignment_Page from './components/Assignment_Page'

function App() {
  return ( 
    <AttendancePage />   
  )
}

export default App

//=========


// import { useState } from "react";
// import LoginPage from "./components/LoginPage";
// import RegisterPage from "./components/RegisterPage";
// import Dashboard from "./components/Dashboard";
// import VidhyaMitraLanding from "./components/VidhyaMitraLanding";
// import AttendancePage from "./components/AttendancePage";

// import './App.css'

// const App = () => {
//   const [currentView, setCurrentView] = useState('landing');
//   const [token, setToken] = useState(null);
//   const [teacherId, setTeacherId] = useState(null);

//   // When login is successful, go to dashboard and pass token/teacherId
//   const handleLogin = (loginResponse) => {
//     console.log("Login response in App:", loginResponse);
//     if (loginResponse.token && loginResponse.teacherId) {
//       setToken(loginResponse.token);
//       setTeacherId(loginResponse.teacherId);
//       setCurrentView('dashboard');
//     } else {
//       setToken(null);
//       setTeacherId(null);
//       setCurrentView('login');
//       console.error("Invalid login response:", loginResponse);
//     }
//   };

//   const handleLogout = () => {
//     setToken(null);
//     setTeacherId(null);
//     setCurrentView('landing');
//   };

//   const switchToRegister = () => setCurrentView('register');
//   const switchToLogin = () => setCurrentView('login');

//   // Show landing page first
//   if (currentView === 'landing') {
//     return <VidhyaMitraLanding onLogin={switchToLogin} />;
//   }

//   // Show register page
//   if (currentView === 'register') {
//     return <RegisterPage onSwitchToLogin={switchToLogin} />;
//   }

//   // Show dashboard only if token and teacherId are present
//   if (currentView === 'dashboard' && token && teacherId) {
//     return <Dashboard onLogout={handleLogout} token={token} teacherId={teacherId} />;
//   }

//   // Show login page
//   return <LoginPage onLogin={handleLogin} onSwitchToRegister={switchToRegister} />;
// };

// export default App;

