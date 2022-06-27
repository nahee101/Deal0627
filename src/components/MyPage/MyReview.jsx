import { useState, useEffect } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../banner/Carousel.css";

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// import required modules
import {EffectCoverflow, Pagination, Navigation , Autoplay} from "swiper";
import { useNavigate } from 'react-router-dom';
import CommentList from './CommentList';



const MyReview = ({reviewRepository}) => {
    const [setSwiperRef] = useState(null);
    const navigate = useNavigate()

    //🍎user정보
    const { user } = useContext(AuthContext);
    const userId = user.uid;

    //🍎review /like
    const [myReviews, setMyReviews] = useState([])
    const [myLikes, setMyLikes] = useState([])
    const [myComments, setMyComments] = useState([])

    //🍎정렬까지 완료된 리뷰들
    const [onMyReviews,setOnMyReviews] = useState([])
    const [onMyLikes,setOnMyLikes] = useState([])
    const [onMyComments, setOnMyComments] = useState([])


    //🍎게시물 이동
    const goDetail = (review) => {

        console.log(review)
        navigate(`/reviews/${review.id}`, {state : {review}})
    }

    // 🍎📃firebase에 저장된 myReview받아오기(내가 작성한 리뷰)
    useEffect(()=> {
        const stopSync =  reviewRepository.syncMyReviewsById(reviews => {
            setMyReviews(reviews);
        },userId)
        return () => stopSync()
    },[userId, reviewRepository])

    // //🍎받아온 reviews를 value값만 가져오기 - 최신순 정렬
    useEffect(()=> {
        let reviewArray = Object.values(myReviews)
        let orderedReview =  reviewArray.slice().sort((a,b) => b.reviewDate.localeCompare(a.reviewDate))
        setOnMyReviews(orderedReview)
    },[myReviews])



    //🍎👍firebase에 저장된 myLikes받아오기(내가 좋아요한 리뷰들)
    useEffect(()=> {
        const stopSync =  reviewRepository.syncMyLikeById(reviews => {
            setMyLikes(reviews);
        },userId)
        return () => stopSync()
    },[userId, reviewRepository])

    //🍎받아온 Likes를 value값만 가져오기 - 최신순 정렬
    useEffect(()=> {
        let reviewArray = Object.values(myLikes)
        let orderedReview =  reviewArray.slice().sort((a,b) => b.reviewDate.localeCompare(a.reviewDate))
        setOnMyLikes(orderedReview)
    },[myLikes])


    //🍎✏️firebase에 저장된 myComments받아오기(내가 작성한 리뷰들)
    useEffect(()=> {
        const stopSync =  reviewRepository.syncMyCommentsById(comments => {
            setMyComments(comments);
        },userId)
        return () => stopSync()
    },[userId, reviewRepository])

    //🍎받아온 Comments를 value값만 가져오기 - 최신순 정렬
    useEffect(()=> {
        let reviewArray = Object.values(myComments)
        let orderedReview =  reviewArray.slice().sort((a,b) => b.date.localeCompare(a.date))
        setOnMyComments(orderedReview)
    },[myComments])

    console.log(onMyComments)

    return (
        <>
        <h2 className="Carousel_text">내가 작성한 리뷰</h2>
        <Swiper
            onSwiper={setSwiperRef}
            slidesPerView={3}
            centeredSlides={false}
            spaceBetween={30}
            pagination={{
            type: "fraction",
            }}
            autoplay={{
                delay: 3500,
                disableOnInteraction: false,
            }}
            navigation={true}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="mySwiper"
        >
            {
                onMyReviews.map(review => {
                    return <SwiperSlide key={review.id}><img onClick={()=>goDetail(review)} src={review.reviewIMG} alt="" /></SwiperSlide>
                })
            }
            

        </Swiper>

        <h2 className="Carousel_text">내가 좋아요한 리뷰</h2>
        <Swiper
            onSwiper={setSwiperRef}
            slidesPerView={3}
            centeredSlides={false}
            spaceBetween={30}
            pagination={{
            type: "fraction",
            }}
            autoplay={{
                delay: 3500,
                disableOnInteraction: false,
            }}
            navigation={true}
            modules={[Pagination, Navigation, Autoplay]}
            className="mySwiper"
        >
            {
                onMyLikes.map(review => {
                    return <SwiperSlide key={review.id}><img onClick={()=>goDetail(review)} src={review.reviewIMG} alt="" /></SwiperSlide>
                })
            }

        </Swiper>

        {/* {onMyComments && (<CommentList onMyComments={onMyComments}/>)} */}
        </>
    );
}

export default MyReview;
