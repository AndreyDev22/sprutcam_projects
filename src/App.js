import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailsPage from './components/DetailsPage';
import Header from './components/Header';
import ProjectList from './components/ProjectList';

function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<ProjectList/>}/>
          <Route exact path='/details/:id' element={<DetailsPage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
