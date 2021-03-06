/* ๐ฅ ๊ฑฐ๋๊ธ ์์ธํ! */
// ๊ฒ์๊ธ(๋๊ธ(ํด์ผ ๋จ), ํ์ผ(ํ์)) ์ญ์ , ์์ (revise ํ์ด์ง๋ก ์ด๋)
// commentWrite ์ฐ๊ฒฐ
// dealLike ์ฐ๊ฒฐ
// ๋๊ธ ๊ฐ์ ์ธ๊ธฐ ํด์ผ ๋จ
// 06-20 ๋ก๊ทธ์ธ ๋ ์ฌ๋ = ์์ฑ์์ผ ๊ฒฝ์ฐ์๋ง ์ญ์ , ์์  ๋ฒํผ ๋ณด์ด๋๋ก

import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "@firebase/storage";
import { firestore, storage } from "../../firebase";

import styles from './CSS/dealDetail.module.css'

import CommentWrite from "./CommentWrite";
import DealLike from "./DealLike";

const DealDetail = () => {
    /* ์ฌ์ฉ์ ์ ๋ณด */
    const { user } = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();
    const dealState = location.state.deal;

    // ๋ฌธ์ ๊ฐ์ ธ์ค๊ธฐ - ๊ทผ๋ฐ ๋ณ ์๋ฏธ ์๋ ๋ฏ...
    const returnDoc = async() => {
        const docSnap = await getDoc(doc(firestore, `/dbDeals/${dealState.id}`));
        return docSnap;
    };

    useEffect(()=> {
        returnDoc();
    }, [])

    // ๊ธ ์ญ์ 
    const deserRef = ref(storage, dealState.attachmentUrl);

    const onDeleteClick = async() => {
        const ok = window.confirm("์ ๋ง ์ด ๊ฒ์๊ธ์ ์ญ์ ํ์๊ฒ ์ต๋๊น?");
            if (ok) {
                    await deleteDoc(doc(firestore, `/dbDeals/${dealState.id}`));
                    // ์ญ์  ๋ฒํผ ๋๋ฅด๋ฉด /๊ฑฐ๋(ํ์ด๋ธ๊ฒ์ํ)๋ก ๋์ด๊ฐ
                    deleteObject(deserRef).then(() => {
                        console.log('ํ์ผ ์ญ์  ์');
                    }).catch((err) => {
                        console.log('ํ์ผ ์ญ์  ์ ๋จ')
                    })
                    navigate('/deals');
                }
            };
    
    // ๊ธ ์์ 
    const onReviseClick = (deal) => {
        navigate(`/deals/revise/${deal.createdAt}`, {state: {deal}})
    }

    // ๋๊ธ ๊ฐ์ ๊ฐ์ ธ์ค๊ธฐ
    const commentCnt = () => {
        firestore.collection('dbDeals')
        .doc(`${dealState.id}`)
        .collection('dComments')
        .get();
        console.log(commentCnt)
    };

    return (
        <section>
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <p>dealState.photo URL</p>
                    <h3>{dealState.creatorName}</h3>
                </div>

                <div className={styles.searchInput}>
                    <input type="text" />
                    <button>Search</button>
                </div>
            </div>

            <div className={styles.content}>
            <img src={dealState.attachmentUrl} alt="deal" />
                <div className={styles.container}>
                    <select className="" id="">
                        <option value="">์จ๊ธฐ๊ธฐ</option>
                        <option value="">์ ๊ณ ํ๊ธฐ</option>
                        <option value="">์ญ์ </option>
                        <option value="">์์ </option>
                    </select>
                    
                    {/* ์ ๋ณด */}
                    <div className={styles.title}>
                        <h3>{dealState.title}</h3>
                        {dealState.hashtagArray[0]&& <span>#{dealState.hashtagArray[0]} </span>}
                        {dealState.hashtagArray[1]&& <span>#{dealState.hashtagArray[1]} </span>}
                        {dealState.hashtagArray[2]&& <span>#{dealState.hashtagArray[2]} </span>}
                        {
                            dealState.price == '' ? (
                                <p>๋๋๐งก</p>
                            ) : (
                                <p>{dealState.price}์</p>
                            )
                        }
                    </div>
                    <p className={styles.description}>{dealState.content}</p>
                </div>
            </div>

            <hr />
            <div className={styles.icon_container}>
                <div className={styles.icon_container_left}>
                    {/* ์ข์์ */}
                    <DealLike 
                    isMyLike={dealState.likeUser.includes(user.uid)}
                    dealState={dealState} />
                    <p className={styles.comment}>๐๋๊ธ๊ฐ์</p>
                </div>
                {
                    dealState.creatorId == user.uid ? (
                        <div className={styles.icon_container_right}>
                            <button onClick={() => onReviseClick(dealState)}>์์ </button>
                            <button onClick={onDeleteClick}>์ญ์ </button>
                        </div>    
                    ) : (
                        <>
                        </>
                    )
                }
            </div>
            {/* ๋๊ธ ์์ฑ */}
            <div className={styles.comments_container}>
                <CommentWrite />
            </div>
            
        </section>
    );

};

export default DealDetail;