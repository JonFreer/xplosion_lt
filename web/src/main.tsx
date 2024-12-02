import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Control from './pages/control.tsx';
import LowerThirdGraphic from './pages/lt_graphic.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Control/>,
  },
  {
    path: "/lt",
    element: <LowerThirdGraphic/>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)