import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import RulesPage from './pages/RulesPage';
import ProfilePage from './pages/ProfilePage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import MainLayout from './components/layouts/MainLayout';
import NonAuthLayout from './components/layouts/NonAuthLayout';
import { AuthPage } from './pages/AuthPage';
import { SendFormPage } from './pages/SendFormPage';
import { ResultSendFormPage } from './pages/ResultSendFormPage';
import AdminLayout from './components/layouts/AdminLayout';
import RequestsPage from './pages/RequestsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ChargePage } from './pages/ChargePage';
import { HistoryPage } from './pages/HistoryPage';
import FullRequestPage from './pages/FullRequestPage';


export const useRoutes = (isAuthenticated, role, token) => {
    const [products, setProducts] = useState([]);
    const [oldReqs, setOldReqs] = useState([]);
    const data = JSON.parse(localStorage.getItem('userData'));
    
    useEffect(() => {
        fetch('https://localhost:5001/store/getAll')
            .then(res => res.json())
            .then(items => setProducts(items))
    }, []);
    
    useEffect(() => { setTimeout(()=> {
        if((data === null ? role : data.role) === 0) {
            fetch('https://localhost:5001/coinRequest/getAll', 
            {
                headers: { 'Authorization': `Bearer ${data === null ? token : data.token}`}
            })
                .then(res => res.json())
                .then(items => setOldReqs(items)) 
            }
        }, 1000)
        
    }, [data, role, token]);
    
    console.log(window.location.pathname);
    if (data === null ? isAuthenticated : !!data.token) {
        if ((data === null ? role : data.role) === 0) {
            return (
                <AdminLayout>
                    <Switch>
                        <Route path="/requests" exact>
                            <RequestsPage requests={oldReqs} />
                        </Route>
                        <Route path="/history" exact>
                            <HistoryPage requests={oldReqs} />
                        </Route>
                        <Route path="/history/:requestId" >
                            <FullRequestPage requests = {oldReqs}/>
                        </Route>
                        <Route path="/orders" exact>
                            <OrdersPage />
                        </Route>
                        <Route path="/charge" exact>
                            <ChargePage />
                        </Route>
                        <Route path="/rules" exact>
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
                        <StorePage products={products} />
                    </Route>
                    {/* <Route path="/product/:productId" >
                        <ProductPage/>
                    </Route> */}
                    {
                        products.map(product => {
                            return <Route path={`/product/${product.id}`} >
                                <ProductPage product={product}/>
                            </Route>
                        })
                    }
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
                <Route path="/login" exact>
                    <AuthPage />
                </Route>
                <Route path="/rules" >
                    <RulesPage />
                </Route>
                <Route path="/store" >
                    <StorePage  products={products} />
                </Route>
                <Redirect to="/login" />
            </Switch>
        </NonAuthLayout>

    )
}