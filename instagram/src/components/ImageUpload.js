import React, { useState } from "react";
import { Button, stepClasses } from "@mui/material";

const ImageUpload = (props) => {
  const BASE_URL = "http://localhost:8000/";

  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);

  function changeHandler(event) {
    if (event.target.files[0]) {
      setImg(event.target.files[0]);
    }
  }

  async function uploadHandle(event) {
    if (event.target.value) {
      event.preventDefault();
    }
    const sendData = new FormData();
    sendData.append("image", img);
    const reqOptions = {
      method: "post",
      headers: new Headers({
        'Authorization': props.token_type + " " + props.token,
      }),
      body: sendData,
    };

    try {
      const res = await fetch(BASE_URL + "post/image", reqOptions);
      if (res.ok) {
          const data = await res.json();
          console.log(data);
        cretePost(data.filename);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setImg(null);
      setDescription("");
      document.getElementById("fileInput").value = null;
    }
  }

  async function cretePost(imgUrl) {
    const sendData = JSON.stringify({
      img_url: imgUrl,
      img_url_type: "relative",
      caption: description,
      creator_id: props.userId,
    });
    const reqOptions = {
      method: "post",
      headers: new Headers({
        Authorization: props.token_type + " " + props.token,
        "Content-Type": "application/json",
      }),
      body: sendData,
    };

    try {
      const res = await fetch(BASE_URL + "post", reqOptions);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        window.location.reload(); // reload the page
        window.scrollTo(0,0); // scroll to start of the page
        
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <div className="imageupload">
      <input
        type={"text"}
        placeholder="Enter description"
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />
      <input type={"file"} id={"fileInput"} onChange={changeHandler} />
      <Button className="imageupload_button" onClick={uploadHandle}>
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
