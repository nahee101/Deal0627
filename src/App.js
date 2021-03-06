import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from './components/Intro/IntroList';
import Contents from './page/Contents';
import FirstMain from './page/FirstMain/FirstMain';
import EventIntro from './components/Intro/EventIntro';
import SignIn from './components/login/SignIn';
import Mypage from './page/Mypage';
import SignUp from './components/login/SignUp';
import { useContext } from "react";
import AuthContext from "./components/context/AuthContext";
/*π μ§μ import*/
import ReviewWrite from './components/Review/reviewWrite';
import ReviewPage from './components/Review/reviewPage';
import ReviewDetail from './components/Review/reviewDetail';
import ReviewRevise from './components/Review/reviewRevise';

/* π₯ λ°μ μ£Ό import μμ */
import DealWrite from './components/Deal/DealWrite';
import DealPage from './components/Deal/DealPage';
import DealDetail from './components/Deal/DealDetail';
import DealRevise from './components/Deal/DealRevise';
/* π₯ λ°μ μ£Ό import λ */
import NotFound from './page/NotFound';
import {useState, useEffect} from 'react';

import { firestore } from './firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

function App({reviewRepository, commentRepository, imageUploader, likeRepository}) {
  
  const { user } = useContext(AuthContext);
  const userId = user ? user.uid : null
  const navigator = useNavigate();


//πμ§μ : create & update review 
const createAndUpdateReview = (review,userId) => {
  reviewRepository.saveReview(userId, review);
}

//πμ§μ : delete review 
const deleteReview = (deletedItem,currentComment) => {

  if(window.confirm("κ²μκΈμ μ λ§ μ­μ  νμκ² μ΅λκΉ?")){
    reviewRepository.removeReview(userId,deletedItem,currentComment)
    alert('κ²μκΈμ μ­μ νμ΅λλ€.');
    navigator('/reviews')
  }
  console.log(deletedItem.reviewIMG)
}


//πμ§μ : delete Comment 
const deleteComment = (comment,reviewId,userId) => {

  if(window.confirm("νμΈμ λλ₯΄μλ©΄ λκΈμ΄ μ­μ λ©λλ€. ")){
    commentRepository.removeComment(userId,reviewId, comment)
    alert('λκΈμ μ­μ νμ΅λλ€.');
  }
}

//πμ§μ : create Comment 
const createAndUpdateComment = (comment,reviewId,userId) => {
  commentRepository.saveComment(userId,reviewId, comment);
}

//πμ§μ : μ’μμ λλ₯΄κΈ°
const clickLike = (userId, review) => {
  likeRepository.saveLike(userId, review)
  console.log('app μ’μμ μ±κ³΅')
}

//πμ§μ : μ’μμ μ­μ  λ‘μ§
const removeLike = (userId,review) => {
  likeRepository.removeLike(userId, review)
}

  /* π₯ νμ΄μ΄μ€ν μ΄μ μ μ₯λΌ μλ deals κ²μκΈ μ λ³΄ */
  const [deals, setDeals] = useState([]);
  // π₯ λ λλ§ μ μ½λ°± ν¨μ μ€ν
  useEffect(() => {
    // dbDeals μ½λ μ λ νΌλ°μ€ κ°μ Έμ΄
    // μμ± μΌμ λ΄λ¦Όμ°¨μ(μ΅κ·Ό μμ)μΌλ‘ μ λ ¬
    const dq = query(
      collection(firestore, "dbDeals"),
      orderBy("createdAt", "desc")
    );
    // μμ , μ­μ  μ€μκ° λ°μ
    // snapshot -> κ°κ°μ docsμ μ κ·ΌνκΈ° μν΄μ μ¬μ©
    onSnapshot(dq, (snapshot) => {
      const dealArray = snapshot.docs.map(doc => ({
      // κ°κ°μ κ°μ²΄μ κ³ μ  idλ₯Ό λ§λ€μ΄ ν λΉ
        id: doc.id, ...doc.data()
      }));
      // κ±°λκΈ κ°μ²΄ λ¦¬μ€νΈλ₯Ό setDealsμ ν λΉ
        setDeals(dealArray);
      })
  }, []);
  

  return (
    <div className="App">
        <Routes>
          <Route path="/" element={!user?<FirstMain/> : <Home/>}></Route>
          <Route path="/home" element={user ? <Home /> :<SignIn/> }></Route>
          <Route path="/contents" element={<Contents/>}></Route>
          <Route path="/mypage" element={< Mypage reviewRepository={reviewRepository} deals={deals}/>}></Route>
          <Route path="/signIn" element={<SignIn/>}></Route>
          <Route path="/signUp" element={<SignUp/>}></Route>
          <Route path="/event" element={<EventIntro />}></Route>
          
          {/* πμ€μ§μ router */}
          <Route path='/reviews'  element={<ReviewPage reviewRepository={reviewRepository}/>}/>
          <Route path='/reviews/:id' element={<ReviewDetail reviewRepository={reviewRepository} clickLike={clickLike} removeLike={removeLike} createAndUpdateComment={createAndUpdateComment} deleteReview={deleteReview} deleteComment={deleteComment}/>}/>
          <Route path='/reviews/write' element={<ReviewWrite imageUploader={imageUploader} createAndUpdateReview={createAndUpdateReview}/>}/>
          <Route path='/review/revise/:id' element={<ReviewRevise imageUploader={imageUploader} createAndUpdateReview={createAndUpdateReview} />}/>

          {/* π₯ λ°μ μ£Ό route μμ */}
          <Route path='/deals' element={<DealPage deals={deals}/>} />
          <Route path='/deals/:createdAt' element={<DealDetail deals={deals}/>} />
          <Route path='/deals/write' element={<DealWrite/>} />
          <Route path='/deals/revise/:createdAt' element={<DealRevise />} />
          {/* π₯ λ°μ μ£Ό route λ */}
          <Route path="/not-found" element={<NotFound />}></Route>
        </Routes>
        <hr></hr>
        <footer>Copyright β uptown All rights reserved</footer>
    </div>
  );
}

export default App;
