/* ๐ฅ ๊ฑฐ๋๊ธ ์์ ! */
// 06-20 ์ฌ์ฉ์ ์ ๋ณด

import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { firestore, storage } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid"; // ์ฌ์ง ๋๋ค ์์ด๋
import { useLocation, useNavigate } from "react-router-dom";

const DealRevise = () => {

    /* ์ฌ์ฉ์ ์ ๋ณด */
    const { user } = useContext(AuthContext);

    const location = useLocation();
    const deal = location.state.deal;
    console.log(deal)

    /* editing ๋ชจ๋์ธ์ง ์๋์ง */
    const [editing, setEditing] = useState(false);

    /* ์๋ฐ์ดํธ */
    const [newDCategory, setNewDCategory] = useState(deal.category);
    const [newDTitle, setNewDTitle] = useState(deal.title);
    const [newDHashtag1, setNewHashtag1] = useState(deal.hashtag1);
    const [newDHashtag2, setNewHashtag2] = useState(deal.hashtag2);
    const [newDHashtag3, setNewHashtag3] = useState(deal.hashtag3);
    const [newDPrice, setNewDPrice] = useState(deal.price);
    const [newDContent, setNewDContent] = useState(deal.content);

    /* ์ฌ์ง์ storage */
    const [newAttachment, setNewAttachment] = useState('');

    const navigate = useNavigate();

    /* editing ๋ชจ๋ ๋๊ณ  ์ผ๊ธฐ */
    const toggleEditting = () => {
        setEditing((prev) => !prev)
        navigate(`/deals/${deal.createdAt}`, {state: {deal}})
    };

    /* ์๋ฐ์ดํธ */
    const onSubmit = async (e) => {
        e.preventDefault();
        
        let newAttachmentUrl = deal.attachmentUrl;

        if (newAttachment !== '') {
            const newAttachmentRef = ref(storage, `images/${user.uid}/${uuidv4()}`);

            const response = await uploadString(newAttachmentRef, newAttachment, "data_url");
            console.log(response);
            newAttachmentUrl = await getDownloadURL(response.ref)
        }
        // dbDeals์ ์๋ฐ์ดํธ
        await updateDoc(doc(firestore, `/dbDeals/${deal.id}`), {
            category: newDCategory,
            title: newDTitle,
            hashtag1: newDHashtag1,
            hashtag2: newDHashtag2,
            hashtag3: newDHashtag3,
            price: newDPrice,
            content: newDContent,
            attachmentUrl: newAttachmentUrl
        });

        setEditing(false);

        // state๋ฅผ ๋น์์ form ๋น์ฐ๊ธฐ
        setNewDCategory("");
        setNewDTitle("");
        setNewHashtag1("");
        setNewHashtag2("");
        setNewHashtag3("");
        setNewDPrice("");
        setNewDContent("");

        // state๋ฅผ ๋น์์ ํ์ผ ๋ฏธ๋ฆฌ๋ณด๊ธฐ img src ๋น์ฐ๊ธฐ
        setNewAttachment("");

        navigate(`/deals/${deal.createdAt}`, {state: {deal}})
    };

    const onChange = (e) => {
        const {target: {name, value}} = e;
        
        if(name === 'category') {
            setNewDCategory(value);
        } else if(name === 'title') {
            setNewDTitle(value);
        } else if(name === 'hashtag1') {
            setNewHashtag1(value);
        } else if(name === 'hashtag2') {
            setNewHashtag2(value);
        } else if(name === 'hashtag3') {
            setNewHashtag3(value);
        }else if(name === 'price') {
            setNewDPrice(value);
        } else if(name === 'content') {
            setNewDContent(value);
        };
    };

    const onFileChange = (e) => {
        const {target: {files}} = e;
        // 06-16 ํ ๋ฒ์ ํ ๊ฐ์ ํ์ผ ์๋ ฅํ๋๋ก ํ๋๋ฐ ์ฌ๋ฌ ์ฅ ๊ฐ๋ฅํ๊ฒ๋ ์์ ,,, ์ด์ผ ํจ
        const theFile = files[0];
        // ํ์ผ ์ด๋ฆ ์ฝ๊ธฐ
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: {result}} = finishedEvent;
            setNewAttachment(result);
        };
        reader.readAsDataURL(theFile); // ๋ฐ์ดํฐ ์ธ์ฝ๋ฉ
    };

    const onClearAttatchment = () => setNewAttachment('');

    return (
        <section>
            <form
            onSubmit={onSubmit}>
                {/* ์นดํ๊ณ ๋ฆฌ ์์ฑ */}
                <label>์นดํ๊ณ ๋ฆฌ</label>
                <select>
                    <option name="category" value={newDCategory}>์๋ฅ</option>
                    <option name="category" value={newDCategory}>์กํ</option>
                    <option name="category" value={newDCategory}>๋ทฐํฐ/๋ฏธ์ฉ</option>
                    <option name="category" value={newDCategory}>๋ฐ๋ ค๋๋ฌผ</option>
                    <option name="category" value={newDCategory}>๊ต์ก/์ฒดํ ํคํธ</option>
                    <option name="category" value={newDCategory}>๊ธฐํ ์ค๊ณ ๋ฌผํ</option>
                </select> <br />

                {/* ์ ๋ชฉ ์์ฑ */}
                <label>์ ๋ชฉ</label>
                <input
                name="title"
                onChange={onChange}
                value={newDTitle}
                type="text" 
                maxLength={80} /> <br />

                {/* ํด์ํ๊ทธ1 ์์ฑ */}
                <label>ํด์ํ๊ทธ</label>
                <input
                name="hashtag1"
                onChange={onChange}
                value={newDHashtag1}
                type="text" 
                maxLength={80} /> <br />
                
                {/* ํด์ํ๊ทธ2 ์์ฑ */}
                <label>ํด์ํ๊ทธ</label>
                <input
                name="hashtag2"
                onChange={onChange}
                value={newDHashtag2}
                type="text" 
                maxLength={80} /> <br />

                {/* ํด์ํ๊ทธ3 ์์ฑ */}
                <label>ํด์ํ๊ทธ</label>
                <input
                name="hashtag3"
                onChange={onChange}
                value={newDHashtag3}
                type="text" 
                maxLength={80} /> <br />

                {/* ๊ฐ๊ฒฉ ์์ฑ */}
                <label>๊ฐ๊ฒฉ</label>
                <input
                name="price"
                onChange={onChange}
                value={newDPrice}
                type="number" /> <br />

                {/* ๊ธ ์์ฑ */}
                <textarea
                name="content"
                onChange={onChange}
                value={newDContent}
                cols="30" rows="10" /> <br />

                <input 
                onChange={onFileChange}
                type="file" 
                accept="image/*" />

                {/* ๊ฑฐ๋ ์๋ก๋ */}
                <input 
                type="submit" 
                value="์์ " />
                            
                {/* ์๋ก๋ํ  ์ฌ์ง ๋ฏธ๋ฆฌ ๋ณด๊ธฐ */}
                {newAttachment && (
                    <div>
                        <img 
                        src={newAttachment} 
                        width="50px" height="50px" />

                        <button
                        onClick={onClearAttatchment}>์ฒจ๋ถ ํ์ผ ์ญ์ </button>
                    </div>
                )}
            </form>

            <button onClick={toggleEditting}>์ทจ์</button>

        </section>
    );
};

export default DealRevise;