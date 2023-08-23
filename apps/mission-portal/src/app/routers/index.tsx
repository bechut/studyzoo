import { metadata } from './metadata';
import { Route, Routes } from 'react-router-dom';

export default function Routers() {
  return (
    <Routes>
      {metadata.map((meta) => (
        <Route key={meta.path} path={meta.path} element={meta.element} />
      ))}
    </Routes>
  );
}
