'use client';
import Header from "../components/header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProtectedRouter from "../components/ProtectedRoute";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('accesstoken');
      if (!token) {
        console.error("No access token found");
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/upload/list/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log("Received data:", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Header />
      <ProtectedRouter>
        <div>
          {posts.map((post) => (
            <div key={post.id}>
              <p>{post.caption}</p>
              {post.image && <img src={post.image} alt="Post image" />}
              {post.video && <video src={post.video} controls />}
            </div>
          ))}
        </div>
      </ProtectedRouter>
    </>
  );
}