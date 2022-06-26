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
import { useSelector, useDispatch } from 'react-redux';
import { setOpenSignUp } from './actions/actions';
import { setOpenSignIn } from './actions/actions';
import { setCurrentUser } from './actions/actions';
import { updateImages } from './actions/actions';

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
  //modal
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  //states with redux
  const openSignUp = useSelector(state => state.openSignUp);
  const openSignIn = useSelector(state => state.openSignIn);
  const user = useSelector(state => state.user);
  const images = useSelector(state => state.images.images);
  const dispatch = useDispatch();



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        console.log(authUser);
        dispatch(setCurrentUser(authUser));
      } else {
        dispatch(setCurrentUser(null));
        //user logged out
      }

    })

    return () => {
      unsubscribe();
    }
  }, []);

  useEffect(() => {
    db.collection('images').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
      dispatch(updateImages((snapshot.docs.map(doc => ({
        id: doc.id,
        image: doc.data()
      })))));
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
    .catch((error) => alert(error.message));

    dispatch(setOpenSignUp(false));
  };

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    dispatch(setOpenSignIn(false));
  };


  return (
    <div className="App">
      <Modal
        open={openSignUp}
        onClose={() => dispatch(setOpenSignUp(false))}
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
        onClose={() => dispatch(setOpenSignIn(false))}
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
          user.currentUser ?
          (<Button onClick={() => auth.signOut()}>Logout</Button>)
          :
          (
            <div className='app_loginContainer'>
              <Button onClick={() => dispatch(setOpenSignIn())}>Sign In</Button>
              <Button onClick={() => dispatch(setOpenSignUp())}>Sign Up</Button>
            </div>
          )
        }
      </div>
      {
        user.currentUser?.displayName ?
        (<ImageUpload />)
        :
        (<h3>Sign in to upload images</h3>)
      }
      <div className='images_container'>
        {
          user.currentUser ?
          (
            <div className='images'>
                {
                  images.map(({id, image}) =>(
                    <Images key={id} imageId={id} author={image.author} createdAt={image.createdAt} imageUrl={image.imageUrl} />
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
