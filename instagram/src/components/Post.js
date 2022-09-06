import React, { useEffect, useState } from "react";
import "../components/post.css";
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";

function Post(props) {

  const BASE_URL = "http://localhost:8000/";
  const [imgUrl, setImgUrl] = useState("");
  const [comments, setComments] = useState([]);
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
        {console.log(comments)}
        {comments.map((comment) => (
          <p>
            <strong> {comment.username}:</strong> {comment.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Post;
