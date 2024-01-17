import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signin from './signin';
import Signup from './signup';
import Todo from './todo/todo';


const App = () => {
  return (
    <>
      <Router>
        <Routes>

          <Route path='/signin' element={<Signin />} />
          <Route path='/todo' element={<Todo />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/*' element={<Navigate to='/signin' />} />

        </Routes>
      </Router>
    </>

  );
};

export default App;
