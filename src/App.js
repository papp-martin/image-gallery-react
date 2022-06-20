import { useEffect, useState } from 'react';
import './App.css';
import { ReactComponent as Logo } from './assets/gallery-logo.svg';
import Images from './components/images/Images';
import { db } from './firebase/firebase.utils';

function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    db.collection('images').onSnapshot(snapshot => {
      setImages(snapshot.docs.map(doc => ({
        id: doc.id,
        image: doc.data()
      })));
    })
  }, []);


  return (
    <div className="App">
      <div className='app_header'>
        <Logo className='logo' />
        <h1>Image Gallery</h1>
      </div>

      <div className='app_images'>
        {
          images.map(({id, image}) =>(
            <Images key={id} author={image.author} createdAt={image.createdAt} imageUrl={image.imageUrl} />
          ))
        }
      </div>

    </div>
  );
}

export default App;
