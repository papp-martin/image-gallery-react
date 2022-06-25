import React, {useState, useEffect} from 'react';
import { db } from '../../firebase/firebase.utils';
import firebase from "firebase/compat/app";
import { doc, deleteDoc } from 'firebase/firestore';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import './images.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { useSelector } from 'react-redux';
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);


function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: `60%`,
      height: `75%`,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(1, 1, 1),
    },
}));

function Images({ imageId, author, createdAt, imageUrl, images, setImages }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const user = useSelector(state => state.user);

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [openimg, setOpenimg] = useState(false);


  //console.log(index,"index");


  useEffect(() => {
    let unsubscribe;
    if(imageId) {
        unsubscribe = db
            .collection('images')
            .doc(imageId)
            .collection('comments')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
    }

    return () => {
        unsubscribe();
    };

  }, [imageId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection('images').doc(imageId).collection('comments').add({
        text: comment,
        author: user.currentUser.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  };

  const handleDelete = async (id) => {
    try {
        await deleteDoc(doc(db, 'images', id))
        setImages(images.filter((image) => image.id !== id));
    } catch (error) {
        console.log(error);
    }
  };

  const handleClick = () => {
    setOpenimg(true);
  };

  return (
    <div className='post'>
        <Modal open={openimg} onClose={() => setOpenimg(false)}>
            <div style={modalStyle} className={classes.paper}>
                <Swiper
                    className='swiper'
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true}}
                    onSwiper={(swiper) => console.log(swiper)}
                    onSlideChange={() => console.log('slide change')}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false
                    }}
                >
                    {
                        images.map(({image}) => {
                            return(
                                <SwiperSlide key={image.index}>
                                    <img key={image.id} className='modal-image' src={image.imageUrl} alt='image' />
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </Modal>
        <div className='image' onClick={handleClick} style={{backgroundImage: `url(${imageUrl})`}} />
        <div className='image_footer'>
            <h4>Author: {author}</h4>
            {
                (author === user.currentUser.displayName) ?
                (
                    <button type='button' onClick={() => handleDelete(imageId)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                ) :
                (null)
            }
            <span>{createdAt?.toDate().toDateString()}</span>
        </div>
        <div className='post_comments'>
            {comments.map((comment) => (
                <p>
                    <strong>{comment.author}</strong> <span id='text'>{comment.text}</span>
                </p>
            ))}
        </div>
        <form className='post_commentBox'>
            <input
                className='post_input'
                type="text"
                placeholder='Add a comment'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button 
                className='post_button'
                disabled={!comment}
                type="submit"
                onClick={postComment}
            >
            Post
            </button>
        </form>
    </div>
  )
};

export default Images;