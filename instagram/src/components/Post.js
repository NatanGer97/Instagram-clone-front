import React, { useEffect, useState } from "react";
import "../components/post.css";
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";

function Post(props) {
  const BASE_URL = "http://localhost:8000/";
  const [imgUrl, setImgUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    // console.log(props.post.comments);
    setComments(props.post.comments);
  }, []);

  useEffect(() => {
    const postImgUrl = props.post.img_url;
    if (props.post.img_url_type === "absolute") {
      setImgUrl(postImgUrl);
    } else {
      setImgUrl(BASE_URL + postImgUrl);
    }
  }, []);

  async function deletePostHandler(event) {
    if (event.target.value) {
      event.preventDefault();
    }
    const reqOptions = {
      method: "DELETE",
      headers: new Headers({
        Authorization: props.token_type + " " + props.token,
      }),
    };

    try {
      const res = await fetch(BASE_URL + `post/${props.post.id}`, reqOptions);
      if (res.ok) {
        alert("post delete");
        window.location.reload();
      }
      if (res.status === 403) {
        console.log(res);
        alert("Only creator can delete, sorry");
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async function addComment(event) {
    event.preventDefault();
    console.log(newComment);
    const commentToSend = JSON.stringify({
      username: props.username,
      text: newComment,
      post_id: props.post.id,
    });

    const reqOptions = {
      method: "post",
      headers: new Headers({
        'Authorization': props.token_type + " " + props.token,
        'Content-Type' : 'application/json',
      }),
      body: commentToSend,
    };

    try {
      const response = await fetch(BASE_URL + "comment", reqOptions);
      if (response.ok) {
        alert("Commend added");
      }
    } catch (error) {
      alert(error);
      console.log(error);
    } finally {
      setNewComment('');
    }
  }

  function onNewCommentChangeHandler(event) {
    setNewComment(event.target.value);
  }
  return (
    <div className="post">
      <div className="post_header">
        <Avatar alt="" src="" />
        <small>{props.post.timestamp}</small>

        <div className="post_headerInfo">
          <h3>{props.post.user.username}</h3>
          <Button className="post_delete" onClick={deletePostHandler}>
            Delete
          </Button>
        </div>
      </div>
      <img className="post_image" src={imgUrl} />
      <h4 className="post_text">{props.post.caption}</h4>
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong> {comment.username}:</strong> {comment.text}
          </p>
        ))}
      </div>
      {props.token && (
        <form className="post_commentbox">
          <input
            className="post_input"
            type={"text"}
            placeholder="Add a comment"
            value={newComment}
            onChange={onNewCommentChangeHandler}
          />
          <button
            className="post_button"
            type="submit"
            disabled={!newComment}
            onClick={addComment}
          >
            Add
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
