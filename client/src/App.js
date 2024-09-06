// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import MyGarden from './components/MyGarden';
import Flower from './components/Flower';
import Account from './components/Account';
import AddFlower from './components/AddFlower';
import EditFlower from './components/EditFlower';
import NavBar from './components/NavBar';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-garden" element={<MyGarden />} />
          <Route path="/flower" element={<Flower />} />
          <Route path="/account" element={<Account />} />
          <Route path="/add-flower" element={<AddFlower />} />
          <Route path="/edit-flower/:id" element={<EditFlower />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
