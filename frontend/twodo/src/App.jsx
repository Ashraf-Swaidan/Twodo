import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodoPage from './pages/TodoPage';
import ProjectPage from './pages/ProjectPage';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import ArchivePage from './pages/ArchivePage';

function App() {
  return (
    <BrowserRouter>

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes (wrap in PrivateRoute) */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/todos"
              element={
                <PrivateRoute>
                  <TodoPage />
                </PrivateRoute>
              }
            />

            <Route
              path='/todos/archive'
              element={
                <PrivateRoute>
                  <ArchivePage />
                </PrivateRoute>
              }
              />

            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />

              <Route 
                path='/project/:projectId'
                element={
                  <PrivateRoute>
                    <ProjectPage />
                  </PrivateRoute>
                }
                />


          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
