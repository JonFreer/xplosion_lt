import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Control from './pages/lt_control.tsx';
import LowerThirdGraphic from './pages/lt_graphic.tsx';
import GraphControl from './pages/graph_control.tsx';
import GraphGraphic from './pages/graph_graphic.tsx';
import Landing from './pages/landing.tsx';
import ScoreGraphic from './pages/score_graphic.tsx';
import ScoreControl from './pages/score_control.tsx';

const router = createBrowserRouter([

  {
    path: "/lt_control",
    element: <Control/>,
  },
  {
    path: "/lt",
    element: <LowerThirdGraphic/>,
  },
  {
    path: "/graph_control",
    element: <GraphControl/>,
  },

  {
    path: "/graph",
    element: <GraphGraphic/>,
  },  
  {
    path: "/score",
    element: <ScoreGraphic/>,
  },
  {
    path: "/score_control",
    element: <ScoreControl/>,
  },
  {
    path: "*",
    element: <Landing/>,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)