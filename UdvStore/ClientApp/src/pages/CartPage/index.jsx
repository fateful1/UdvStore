import React from 'react';
import StoreNavBar from '../../components/StoreNavBar';
import { Link, Redirect } from 'react-router-dom';
import styles from './cart.module.css'
import CartItem from '../../components/CartItem';
import { useState, useEffect, useContext } from 'react';
import { CoinsContext } from './../../context/CoinsContext';

export default function CartPage() {
    let userCoins = useContext(CoinsContext).coinsAmount;

    let [prodCount, setProdCount] = useState(0);
    let [cart, setCart] = useState([]);
    let [sumPrice, setSumPrice] = useState(0);

    const decrementCount = (id, price) => {
        const products = new Map(Object.entries(JSON.parse(localStorage.getItem('cart'))));
        products.get(String(id)).count--;

        localStorage.setItem('cart', JSON.stringify(Object.fromEntries(products)));

        setProdCount(prev => prev - 1);
        setSumPrice(prev => prev - price);
    };

    const incrementCount = (id, price) => {
        const products = new Map(Object.entries(JSON.parse(localStorage.getItem('cart'))));
        products.get(String(id)).count++;

        localStorage.setItem('cart', JSON.stringify(Object.fromEntries(products)));

        setProdCount(prev => prev + 1);
        setSumPrice(prev => prev + price);
    };

    const deleteProductFromCart = (id) => {
        const products = new Map(Object.entries(JSON.parse(localStorage.getItem('cart'))));
        products.delete(String(id));
        localStorage.setItem('cart', JSON.stringify(Object.fromEntries(products)));

        let product = cart.find(e => e.id === id);
        let newCart = cart.filter(e => e.id !== id);
        setCart(newCart);
        setProdCount(prev => prev - product.count);
        setSumPrice(prev => prev - product.price * product.count);
    }

    useEffect(() => {
        if (localStorage.getItem('cart') !== null) {
            const products = new Map(Object.entries(JSON.parse(localStorage.getItem('cart'))));
            products.forEach((product) => {
                setCart(prev => [...prev, {
                    img: product.img,
                    title: product.title,
                    price: product.price,
                    id: product.id,
                    count: product.count
                }])

                setProdCount(prev => prev + product.count);
                setSumPrice(prev => prev + product.price * product.count);
            })
        }
    }, [])

    return (
        <div>
            <StoreNavBar />
            <Link to="/store">
                <div className={styles.arrow}>
                    <div></div>
                </div>
            </Link>
            {
                cart.length === 0
                    ?
                    <div className={styles.emptyCart}>
                        <div className={styles.title}>В корзине пока ничего нет</div>
                        <p className={styles.subTitle}>Перейдите в <Link to='/store' className={styles.link}>магазин</Link>, чтобы купить мерч</p>
                    </div>
                    :
                    <div className={styles.wrapper}>
                        <div className={styles.cartItems}>
                            <div className={styles.header}>
                                <span className={styles.headerTitle}>Ваша корзина</span>
                                <span className={styles.counter}>всего: {prodCount}</span>
                            </div>
                            <div>
                                {cart.map((product) => {
                                    return <CartItem
                                        img={product.img}
                                        title={product.title}
                                        price={product.price}
                                        id={product.id}
                                        count={product.count}
                                        onMinus={decrementCount}
                                        onPlus={incrementCount}
                                        onGarbage={deleteProductFromCart} />
                                })}
                            </div>
                        </div>
                        <div className={styles.summaryBlock}>
                            <div>
                                <div className={styles.header}>
                                    <span className={styles.headerTitle}>Итого</span>
                                    <span className={styles.sumCoins}>{sumPrice} UC</span>
                                </div>
                                <p className={styles.counter}>Товары, {prodCount} шт.</p>
                            </div>

                            <div className={styles.bottomBlock}>
                                <div className={styles.balance}>Ваш баланс: {userCoins} UC</div>
                                <button className={styles.addButton}>Оплатить</button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}