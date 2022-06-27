import React, { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CSS/reviewRevise.module.css'

//🍎 Review를 수정하는 페이지

import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Nav from '../Nav/Nav';
import SubMainBannerReviews from '../banner/SubMainBannerReviews';
import { useRef } from 'react';



const ReviewRevise = ({createAndUpdateReview , imageUploader}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userId = user.uid

    const review = location.state.review

    const reviewIMGRef = useRef();
    const [changedReview, setChangedReview] = useState({});
    const [uploadedIMG, setUploadedIMG] = useState(review.reviewIMG)
    const [inputButton, setInputButton] = useState(false)

    const [name , setName] = useState('현재 이미지')

    useEffect(()=>{
        setUploadedIMG(uploadedIMG)
    },[uploadedIMG,setName])


    const onChange = event => {
        if(event.currentTarget == null) {
            return;
        }
        event.preventDefault();
        setChangedReview( {
            ...review,
            [event.currentTarget.name] : event.currentTarget.value,
        });
    };

    //🍎버튼을 클릭하면 파일인풋이 클릭된것 처럼 보이기
    const onButtonClick = (event) =>{
        event.preventDefault();
        reviewIMGRef.current.click();
    };

    


    const  imgOnChange = async (event) => {
        event.preventDefault();
        
        setInputButton(true)
        console.log(event.target.files[0]);
        const uploaded = await imageUploader.upload(event.target.files[0]);
        setUploadedIMG(uploaded.url)
        setInputButton(false)

        // console.log(uploaded.url)
        // console.log('이미지로딩')
        setName(uploaded.original_filename)
        console.log(uploaded.original_filename)
        setChangedReview( {
            ...review,
            reviewIMG : uploaded.url,
        });
    }

    const SubmitReview = () => {
        createAndUpdateReview(changedReview,userId)
        navigate('/reviews')
        
    }

    return (
        <>
        <Nav/>
        <SubMainBannerReviews/>
            <div className={styles.reviewWrite}>
            <div className={styles.titleBox}>
                <h2>리뷰 수정하기</h2>
            </div>
                <form className={styles.form}>
                    <input 
                        className={styles.input_title} 
                        name='reviewTitle' 
                        type="text" 
                        defaultValue={review?review.reviewTitle:''} 
                        onChange={onChange}
                        />
                
                {/* 화면상에서 안보임 */}
                    <input 
                        className={styles.fileInput}
                        type="file"
                        accept='image/*'
                        name='reviewIMG'
                        ref={reviewIMGRef}
                        onChange={imgOnChange} 
                    />
                <textarea 
                    className={styles.textarea}
                    name="reviewDescription" 
                    defaultValue={review?review.reviewDescription:''}
                    onChange={onChange}
                    >
                </textarea>

                    { inputButton &&
                        (<div className={styles.modal_container}>
                            <div className={styles.dialog__inner}>
                                <div className={styles.dialog__content}>
                                <h2>이미지를 업로딩 중 입니다.</h2>
                                <p>잠시만 기다려주세요.</p>
                                <p>자동으로 닫힙니다</p>
                                <div className={styles.loading}></div>
                                </div>  
                            </div>
                        </div>)
                    }
                    <div className={styles.last_container}>
                        <div className={styles.inner}>
                            <div className={styles.input_container}>
                                {uploadedIMG? (<img src={uploadedIMG} alt='current' className={styles.fileInput_img} />) : (
                                    <div className={styles.before_uploadedImg}>
                                        <p>이미지를 <br/>첨부해주세요</p>
                                        
                                    </div>
                                )}
                                <button 
                                    className={styles.input_button}
                                    onClick={onButtonClick}
                                >
                                <div style={{fontSize: '1rem'}}>{name}</div>
                                </button>
                            </div>

                            <div className={styles.hash_container}>
                                <p>#태그는 수정할 수없습니다.</p>
                                <div className={styles.hashtags_box}>
                                    <input disabled='true' className={styles.hashtags} defaultValue={review?review.reviewHashtags[0]:''} name='reviewHashtags' type="text" onChange={onChange} />
                                    <input disabled='true' className={styles.hashtags} defaultValue={review?review.reviewHashtags[1]:''} name='reviewHashtags' type="text" onChange={onChange} />
                                    <input disabled='true' className={styles.hashtags} defaultValue={review?review.reviewHashtags[2]:''} name='reviewHashtags' type="text" onChange={onChange} />
                                </div>
                            </div>

                        </div>
                        <div className={styles.submit_buttons}>
                            <button 
                                className={styles.button}
                            >취소
                            </button>
                            <button 
                                className={styles.button}
                                onClick={SubmitReview}
                            >수정
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ReviewRevise;