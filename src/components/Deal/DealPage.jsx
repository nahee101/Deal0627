/* π₯ deal κ²μν λͺ©λ‘ */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DealItem from "./DealItem";
import Nav from "../Nav/Nav";
import styles from './CSS/dealPage.module.css';
import SubMainBanner from "../banner/SubMainBannerDeal";
import { useState } from "react";
import { firestore } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

const DealPage = ({deals}) => {
    // title λλ₯΄λ©΄ κ²μκΈ λ΄μ© λ³Ό μ μλλ‘
    const navigate = useNavigate();

    const onClick = () => {
        navigate('/deals/write');
    };

    const [keyword, setKeyword] = useState('');

    const onChange = (e) => {
        setKeyword(e.target.value);
    };

    const [onDeals, setOnDeals] = useState(Object.values(deals))

    /* ν΄μνκ·Έ κ²μ */
    const onSearchClick = async () => {
        const q = query(
            collection(firestore, 'dbDeals'),
            where('hashtagArray', '>=', keyword),
        );
        const resSnap = await getDocs(q);
        resSnap.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        })
        console.log('νν')
    };

    return (
        <div>
            <Nav />
            <SubMainBanner/>
            <section className={styles.dealPage}>
                <h1>Deals</h1>
                
                <div className={styles.header}>
                    <div className={styles.search}>
                        <input 
                        onChange={onChange}
                        type="text" placeholder="κ΄μ¬ μλ ν΄μνκ·Έλ‘ κ²μν΄λ³΄μΈμ"/>
                        <button onClick={onSearchClick}>κ²μνκΈ°</button>
                        <hr />
                    </div>
                    <button
                    className={styles.button_write}
                    onClick={onClick}>κΈ μμ±νκΈ°</button>
                </div>

                <ul className={styles.list}>
                    {
                        deals.map(deal => (
                            <li key={deal.createdAt}>
                                <DealItem deal={deal} />
                            </li>
                        ))
                    }
                </ul>
            </section>
        </div>
    );
};

export default DealPage;