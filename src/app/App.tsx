import './App.css';
import React from 'react';
import Dashboard from '../container/Dashboard/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Link} from 'react-router-dom';
import Login from '../container/Login/Login';


const App : React.FC = () => {
  return (
    <div>
      <Router>
        <Link to='/toolview'>toolview</Link>
        <Link to='/login'>login</Link>
        <Routes>
          <Route path="/toolview" element={<Dashboard/>}/>
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
