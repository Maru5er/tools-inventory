import './App.css';
import React from 'react';
import Dashboard from '../container/Dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Link} from 'react-router-dom';
import Login from '../container/Login/Login';
import { useAppSelector } from './hooks';


const App : React.FC = () => {
  const username = useAppSelector((state) => state.user.username);
  return (
    <div>
      <Router>
        <div>
          <Link to='/toolview'>toolview </Link>
          <Link to='/login'>login</Link>
          <p>Logged in as {username}</p>
        </div>
        <Routes>
          <Route path="/toolview" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
