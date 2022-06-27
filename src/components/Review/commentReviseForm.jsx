import React from 'react';
import styles from './CSS/commentReviseForm.module.css'
import { useState } from 'react';
import { useEffect } from 'react';

const CommentReviseForm = ({ currentComment, getComment }) => {

    const [changedComment, setChangedComment] = useState({}) 
    const [comment, setCommet] = useState({})

     //🍎user정보

    useEffect(()=> {
        setCommet(currentComment)
    },[currentComment])

    const onChange = event => {
        if(event.currentTarget === null) {
            return;
        }
        event.preventDefault();
        setChangedComment( {
            ...comment,
            [event.currentTarget.name] : event.currentTarget.value,
        });
    };

    //🍎props로 comment보내주기
    const onSubmit = (event)=> {
        event.preventDefault();
        getComment(changedComment)
    }

    //🍎창 취소
    const onCancle = (event) =>{
        event.preventDefault();

    }

    const canSave = Boolean(Object.keys(changedComment).length !== 0) 

    return (
        <>
        {currentComment!==undefined && (
            <div className={styles.container}>
            <h3 className={styles.user}>{currentComment.userName}<span>({currentComment.userEmail})</span></h3>
            <form className={styles.comment_form} name='comment'>
                <textarea 
                value={currentComment?currentComment.comment:''} 
                onChange={onChange} 
                className={styles.textarea} 
                name="comment" 
                ></textarea>
                <div>
                    <button className={styles.button} onClick={()=>onCancle()} >취소</button>
                    {canSave? (<button  className={styles.button_ok} onClick={()=>onSubmit()}>댓글 수정</button>): ''}
                </div>
            </form>
            </div>)}
        </>
    );
};

export default CommentReviseForm;