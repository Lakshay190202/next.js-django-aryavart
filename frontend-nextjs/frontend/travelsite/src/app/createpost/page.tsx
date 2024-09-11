'use client';
import React, { useState } from "react";
import axios from "axios";
import Header from "../components/header";
import ProtectedRouter from "../components/ProtectedRoute";
import './components/page.css';


export default function CreatePost() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  let [tags, setTags] = useState<string>(''); 

  const handleUpload = async () => {
    const token = localStorage.getItem('accesstoken');
    const formdata = new FormData();
    formdata.append('caption', caption);
    if (image) formdata.append('image', image);
    if (video) formdata.append('video', video);

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload/posts/', formdata, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        
      }
      });

      if (response.status === 201) {
        console.log('Post created successfully');
        
      } else {
        console.error('Failded to create post');
      }
      
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Header />
      <ProtectedRouter>
        <div className="create-main-div">
          <div className="glass-container">
            <div className="containerr">
              <div className="caption-div">
                <p>Caption</p>
                <input
                  type="text"
                  placeholder="Enter a caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              <div className="image-div">
                <p>Image</p>
                <label htmlFor="image-upload" className="custom-file-upload">
                  Pick an image
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0]: null)}
                />
              </div>
              <div className="video-div">
                <p>Video</p>
                <label htmlFor="video-upload" className="custom-file-upload">
                  Pick a video
                </label>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideo(e.target.files ? e.target.files[0]:null)}
                />
              </div>
              <div className="tags-div">
                Add tags
                <input
                  type="text"
                  placeholder="Add tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div className="button-div">
                <button onClick={handleUpload}>Create Post</button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRouter>
    </>
  );
}