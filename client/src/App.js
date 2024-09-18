import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import NavBar from './components/NavBar';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const Register = lazy(() => import('./components/Register'));
const Login = lazy(() => import('./components/Login'));
const MyGarden = lazy(() => import('./components/MyGarden'));
const Flower = lazy(() => import('./components/Flower'));
const Account = lazy(() => import('./components/Account'));
const AddFlower = lazy(() => import('./components/AddFlower'));
const EditFlower = lazy(() => import('./components/EditFlower'));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <NavBar />    
          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
      </Router>
    </Provider>
  );
}

export default App;
