import React from 'react';
import styles from './CommentList.module.css'

const CommentList = ({onMyComments}) => {

    const goDetail = () => {

    }

    const renderComments = onMyComments.map(comment => (
        <section key={comment.id} onClick={()=>goDetail()} className={styles.commentList}>
            <img className={styles.img} src={comment.reviewIMG} alt="" />
            
            <div className={styles.comment_container}>
                <p className={styles.comment}>{comment.comment}</p>
                <div className={styles.commten_info}>
                    <p className={styles.date}>{comment.date}</p>
                    <p className={styles.reviewTitle}> 게시물 제목 : {comment.reviewTitle}</p>
                </div>
            </div>
        </section>
    ))

    return (
        <>
        <div className={styles.titleBox}>   
            <h2 className={styles.title}>내가 작성한 댓글</h2>
        </div>
        {renderComments}
        </>

    );
};

export default CommentList;