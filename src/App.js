import { useEffect, useState } from 'react';
import './App.css';
import { ReactComponent as Logo } from './assets/gallery-logo.svg';
import Images from './components/images/Images';
import { db, auth } from './firebase/firebase.utils';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { Input } from '@material-ui/core';
import ImageUpload from './components/image-upload/ImageUpload';

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
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [images, setImages] = useState([]);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
        //user logged out
      }

    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('images').onSnapshot(snapshot => {
      setImages(snapshot.docs.map(doc => ({
        id: doc.id,
        image: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false);
  };


  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <Logo className='logo'/>
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button type='submit' onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <Logo className='logo'/>
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <Button type='submit' onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>
      <div className='app_header'>
        <Logo className='logo' />
        <h1>Image Gallery</h1>
        {
          user ?
          (<Button onClick={() => auth.signOut()}>Logout</Button>)
          :
          (
            <div className='app_loginContainer'>
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )
        }
      </div>
      {
        user?.displayName ?
        (<ImageUpload username={user.displayName}/>)
        :
        (<h3>Sign in to upload images</h3>)
      }
      <div className='images_container'>
        {
          user ?
          (
            <div className='images'>
                {
                  images.map(({id, image}) =>(
                      <Images key={id} imageId={id} user={user} author={image.author} createdAt={image.createdAt} imageUrl={image.imageUrl} images={images} setImages={setImages}/>
                  ))
                }
            </div>
          ) :
          (null)
        }
      </div>
    </div>
  );
}

export default App;
