import React, { useState } from "react";
import { Button, stepClasses } from "@mui/material";

// props -> token & tokenType

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
        Authorization: props.token_type + " " + props.token,
      }),
      body: sendData,
    };

    try {
      const res = await fetch(BASE_URL + "post/image", reqOptions);
      if (res.ok) {
        const data = await res.json();

        // create post here
      }
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setImg(null);
      setDescription('');
      document.getElementById('fileInput').value = null;
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
