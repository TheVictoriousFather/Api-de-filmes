import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
    <Route path="/:language/:type/:videoName" element={<App />} />
    <Route path="/api" element={<api />} />

      {/* <Route path="/:lang/movies/:movieName" element={<MoviePage />} />
      <Route path="/:lang/series/:seriesName/:season/:episode" element={<SeriesPage />} /> */}
    </Routes>
  </BrowserRouter>,
  </React.StrictMode>,
)
