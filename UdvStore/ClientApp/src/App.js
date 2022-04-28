import React, { useState, useEffect, useContext } from 'react';
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";
import { ButtonStatesContext } from './context/ButtonStatesContext';
import { CoinsContext } from './context/CoinsContext';
import { useClicked, useStatus } from './hooks/status.hook';
import './fonts/hero.css';
import './custom.css';
import { SendFormChecker } from './context/SendFormChecker';
import { useForm } from './hooks/form.hook';
import { RequestStateContext } from './context/RequestStateContext';

export const App = () => {
  const { login, logout, token, userId, fullName, role } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated, role);
  let { isActive, toggleActive } = useStatus();
  let { isClicked, toggleClicked } = useClicked();
  const [coinsAmount, setCoinsAmount] = useState('-1');
  let { isSent, toggleSent } = useForm();
 
  useEffect(() => {
    if (isAuthenticated && role === 1) {
      fetch(`https://localhost:5001/coins/get?employeeId=${userId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(money => {
          setCoinsAmount(String(money));
        })
        .catch((e) => logout());
    }
  }, [isAuthenticated, role, token, userId])

  return (
    <AuthContext.Provider value={{ login, logout, token, userId, role, fullName, isAuthenticated }}>
      <ButtonStatesContext.Provider value={{ isActive, toggleActive }}>
        <RequestStateContext.Provider value={{ isClicked, toggleClicked}}>
          <CoinsContext.Provider value={{ coinsAmount }}>
            <SendFormChecker.Provider value={{ isSent, toggleSent }}>
              <BrowserRouter>
                { routes }
              </BrowserRouter>
            </SendFormChecker.Provider>
          </CoinsContext.Provider>
        </RequestStateContext.Provider>
      </ButtonStatesContext.Provider>
    </AuthContext.Provider>
  );
}
