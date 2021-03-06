/* π₯ 06-17 μ’μμ */
// 06-21 dbDealsμ μ’μμ μ/ μ’μμ λλ₯Έ μ μ  κ° μλ°μ΄νΈ

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { firestore } from "../../firebase";
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from "firebase/firestore";

const DealLike = ({dealState, isMyLike}) => {

    /* μ¬μ©μ μ λ³΄ */
    const { user } = useContext(AuthContext);

    // like λ²νΌμ΄ λλ Έλμ§ μ λλ Έλμ§
    const [likeAction, setLikeAction] = useState(isMyLike);
    console.log(isMyLike)

    /* μ¬μ© ν¨μ */
    async function toggleLike(e) {
        e.preventDefault();
        const dLikeRef = doc(firestore, "dbDeals", dealState.id);

        if (likeAction === false) {
            await updateDoc(dLikeRef, {
                likeCount: increment(1),
                likeUser: arrayUnion(user.uid)
            });
            setLikeAction(true);
        } else {
            await updateDoc(dLikeRef, {
                likeCount: increment(-1),
                likeUser: arrayRemove(user.uid)
            });
            setLikeAction(false);
        };
    }

    return(
        <>
            <button onClick={toggleLike}>
                {likeAction ? 'π' : 'π€'}
            </button>
            <p>{dealState.likeCount}</p>
        </>
    );
};

export default DealLike;