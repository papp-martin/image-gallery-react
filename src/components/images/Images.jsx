import React, {useState, useEffect} from 'react';
import { db } from '../../firebase/firebase.utils';
import firebase from "firebase/compat/app";
import './images.css';

function Images({ imageId, author, createdAt, imageUrl, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if(imageId) {
        unsubscribe = db
            .collection("images")
            .doc(imageId)
            .collection("comments")
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

    db.collection("images").doc(imageId).collection("comments").add({
        text: comment,
        author: user.displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }

  return (
    <div className='images'>
        <img className='image' src={imageUrl} alt='image' />
        <div className='image_footer'>
            <h4>Author: {author}</h4>
            <span>{createdAt.toDate().toDateString()}</span>
        </div>
        <div className='post_comments'>
            {comments.map((comment) => (
                <p>
                    <strong>{comment.author}</strong> {comment.text}
                </p>
            ))}
        </div>
        <form className='post_commentBox'>
            <input
                className='post_input'
                type="text"
                placeholder='Add a comment'
                value={comment}
                disabled={!user}
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