import { Button, Input, Modal } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import "./App.css";
import ImageUpload from "./components/ImageUpload";
import Post from "./components/Post";
function getModalStyle(param) {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}`,
    transform: `translate(-${top})%, -${left}%`,
  };
}

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     backgroundColor: theme.palette.background.paper,
//     position: 'absolute',
//     width: 400,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3)
//   }
// }))

function App() {
  const BASE_URL = "http://localhost:8000/";
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModelStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    console.log(localStorage.getItem("test"));
    setAuthToken(window.localStorage.getItem("authToken"));
    setAuthTokenType(window.localStorage.getItem("authTokenType"));
    setUsername(window.localStorage.getItem("username"));
    setUserId(window.localStorage.getItem("userId"));
  }, []);

  //  useEffect(() => {
  //   console.log('sec');
  //   authToken
  //     ? localStorage.setItem("authToken", authToken)
  //     : localStorage.removeItem("authToken");
  //     authTokenType
  //     ? localStorage.setItem("authTokenType", authTokenType)
  //     : localStorage.removeItem("authTokenType");
  //     username
  //     ? localStorage.setItem("username", username)
  //     : localStorage.removeItem("username");
  //     userId
  //     ? localStorage.setItem("userId", userId)
  //     : localStorage.removeItem("userId");
  // }, [authToken, authTokenType, userId]);

  function signIn(event) {
    if (event != null) event.preventDefault();
    localStorage.setItem("test", "test");

    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const reqOptions = { method: "Post", body: formData };

    fetch(BASE_URL + "login", reqOptions)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw res;
      })
      .then((data) => {
        console.log(data);
        setAuthToken(data.access_token);
        localStorage.setItem("authToken", data.access_token);
        setAuthTokenType(data.token_type);
        localStorage.setItem("authTokenType", data.token_type);
        setUserId(data.user_id);
        localStorage.setItem("userId", data.user_id);
        setUsername(data.username);
        localStorage.setItem("username", data.username);
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
    setOpenSignIn(false);
  }

  async function signUp(event) {
    if (event != null) event.preventDefault();

    const sendData = JSON.stringify({
      username: username,
      email: email,
      password: password,
    });

    const reqOptions = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: sendData,
    };

    const urlForFetching = BASE_URL + "user/";

    try {
      const res = await fetch(urlForFetching, reqOptions);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        signIn();
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }

    setOpenSignUp(false);
  }
  function logout() {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId("");
    setUsername("");
    localStorage.removeItem("test");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenType");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  }

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(BASE_URL + "post/all");
      if (response.ok) {
        const posts = await response.json();
        Array.from(posts).sort((a, b) => {
          const a_timeStamp = a.timestamp.split(/[-T]/);
          const b_timeStamp = b.timestamp.split(/[-T]/);
          const a_date = new Date(
            Date.UTC(a_timeStamp[0], a_timeStamp[1] - 1, a_timeStamp[2])
          );
          const b_date = new Date(
            Date.UTC(b_timeStamp[0], b_timeStamp[1] - 1, b_timeStamp[2])
          );
          return b_date - a_date;
        });
        setPosts(posts);
        return posts;
      } else {
        throw response;
      }
    }
    try {
      fetchPosts();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="app">
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={style}>
          <form className="app_signin">
            <img
              className="app_headerImage"
              src="https://pbs.twimg.com/profile_images/1526231349354303489/3Bg-2ZsT_400x400.jpg"
              alt="Instagram"
            />
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Login
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <Box sx={style}>
          <form className="app_signin">
            <img
              className="app_headerImage"
              src="https://pbs.twimg.com/profile_images/1526231349354303489/3Bg-2ZsT_400x400.jpg"
              alt="Instagram"
            />
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign-Up
            </Button>
          </form>
        </Box>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://pbs.twimg.com/profile_images/1526231349354303489/3Bg-2ZsT_400x400.jpg"
          alt="Instagram"
        />
        {authToken ? (
          <Button onClick={logout}>Log-Out</Button>
        ) : (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            <Button onClick={() => setOpenSignUp(true)}>Sign-Up</Button>
          </div>
        )}
      </div>
      <div className="app_posts">
        {posts.map((post) => (
          <Post post={post} />
        ))}
      </div>
      {authToken ? (
        <ImageUpload token={authToken} token_type = {authTokenType}/>
      ) : (
        <h3>You need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
