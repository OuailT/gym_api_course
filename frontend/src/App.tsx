import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GymDetail from './pages/GymDetail';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-wrapper">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 5000,
        }}
      />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gyms/:id" element={<GymDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
