import React, {useState} from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from '../../firebase/firebase.utils';
import firebase from 'firebase/compat/app';
import { useSelector } from 'react-redux';
import './ImageUpload.css';

function ImageUpload({ images }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const user = useSelector(state => state.user);

    const handleChange = event =>  {
        if(event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //error function
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db
                        db.collection("images").add({
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            imageUrl: url,
                            author: user.currentUser.displayName,
                            index: images.length
                        });

                        setProgress(0);
                        setImage(null);
                    });
            }
        );
    };



  return (
    <div className='image-upload'>
        <progress className='progress' value={progress} max="100"/>
        <input type="file" onChange={handleChange} />
        <Button onClick={handleUpload}>
            Upload
        </Button>
    </div>
  )
}

export default ImageUpload