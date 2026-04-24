import { Routes, Route, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Splash from './screens/Splash';
import Home from './screens/Home';
import Pods from './screens/Pods';
import Book from './screens/Book';
import BookConfirm from './screens/BookConfirm';
import Sessions from './screens/Sessions';
import Profile from './screens/Profile';

const NAV_ROUTES = ['/', '/pods', '/book', '/sessions', '/profile'];

export default function App() {
  const { pathname } = useLocation();
  const showNav = NAV_ROUTES.some(r => pathname === r);

  return (
    <>
      <Routes>
        <Route path="/splash" element={<Splash />} />
        <Route path="/"        element={<Home />} />
        <Route path="/home"    element={<Home />} />
        <Route path="/pods"    element={<Pods />} />
        <Route path="/book"    element={<Book />} />
        <Route path="/book/confirm" element={<BookConfirm />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/profile"  element={<Profile />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  );
}
