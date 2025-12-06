import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserIndex from './pages/User/TelaUserConfigIndex';
import UserAgendamentos from './pages/User/TelaUserConfigAgendamento';
import UserFavoritos from './pages/User/TelaUserConfigFavoritos';
import UserAvaliacao from './pages/User/TelaUserConfigAvaliacao';
import FotografoIndex from './pages/Fotografo/TelaFotografoConfigIndex';
import PublicIndex from './pages/Public/Index';
export default function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicIndex />} />
        <Route path="/user" element={<UserIndex />} />
        <Route path="/user/agendamentos" element={<UserAgendamentos />} />
        <Route path="/user/favoritos" element={<UserFavoritos />} />
        <Route path="/user/avaliacoes" element={<UserAvaliacao />} />
        <Route path="/fotografo" element={<FotografoIndex />} />
      </Routes>
    </Router>
  );
}
