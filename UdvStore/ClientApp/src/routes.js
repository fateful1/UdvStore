import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import RulesPage from './pages/RulesPage';
import ProfilePage from './pages/ProfilePage';
import StorePage from './pages/StorePage';
import MainLayout from './components/layouts/MainLayout';
import NonAuthLayout from './components/layouts/NonAuthLayout';
import { AuthPage } from './pages/AuthPage';
import { SendFormPage } from './pages/SendFormPage';
import { ResultSendFormPage } from './pages/ResultSendFormPage';
import AdminLayout from './components/layouts/AdminLayout';
import { RequestsPage } from './pages/RequestsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ChargePage } from './pages/ChargePage';


export const useRoutes = (isAuthenticated, role) => {
    if (isAuthenticated) {
        if (role === 0) {
            return (
                <AdminLayout>
                    <Switch>
                        <Route path="/requests">
                            <RequestsPage />
                        </Route>
                        <Route path="/orders">
                            <OrdersPage />
                        </Route>
                        <Route path="/charge">
                            <ChargePage />
                        </Route>
                        <Route path="/rules">
                            <RulesPage />
                        </Route>
                        <Redirect to="/requests" />
                    </Switch>
                </AdminLayout>
            )
        }
        return (
            <MainLayout>
                <Switch>
                    <Route path="/profile" exact>
                        <ProfilePage />
                    </Route>
                    <Route path="/rules" >
                        <RulesPage />
                    </Route>
                    <Route path="/store" >
                        <StorePage />
                    </Route>
                    <Route path="/sendForm">
                        <SendFormPage />
                    </Route>
                    <Route path='/result'>
                        <ResultSendFormPage />    
                    </Route>
                    <Redirect to="/profile" />
                </Switch>
            </MainLayout>
        );
    }
    return (
        <NonAuthLayout>
            <Switch>
                <Route path="/" exact>
                    <AuthPage />
                </Route>
                <Route path="/rules" >
                    <RulesPage />
                </Route>
                <Route path="/store" >
                    <StorePage />
                </Route>
                <Redirect to="/" />
            </Switch>
        </NonAuthLayout>

    )
}