import React from 'react';
import './images.css';

function Images({ author, createdAt, imageUrl }) {
  return (
    <div className='images'>
        <img className='image' src={imageUrl} alt='image' />
        <div className='image_footer'>
            <h4>Author: {author}</h4>
            <span>{createdAt.toDate().toDateString()}</span>
        </div>
    </div>
  )
};

export default Images;