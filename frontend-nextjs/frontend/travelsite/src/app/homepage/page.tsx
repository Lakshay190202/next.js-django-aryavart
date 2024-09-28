'use client'
import Header from "../components/header"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProtectedRouter from "../components/ProtectedRoute"
import { useAuth } from "../components/Authcontext";
import './page.css';
import { toast } from "react-toastify"

export default function Homepage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
  const { refreshToken } = useAuth();
  const [action, setAction] = useState('');

  const likePost = async (postId: number) => {
    try {
      let token = localStorage.getItem('accesstoken');
      if (!token) {
        await refreshToken();
        token = localStorage.getItem('accesstoken');
      }
      if (!token) {
        setErrorMessage('You need to be signed in to like a post');
        localStorage.clear();
        router.push('/signin');
        return; // Prevent further execution
      }
      const response = await axios.post(`http://127.0.0.1:8000/posts/likepost/${postId}/`,
        { post_id: postId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      if (response.status === 200) {
        const action = response.data.Messages.split(' ')[1];
        setAction(action);
        console.log(`post ${action}`);
      }
      setLikedPosts(prevLikedPosts => ({
        ...prevLikedPosts,
        [postId]: !prevLikedPosts[postId],
      }));
    } catch (error: any) {
      setErrorMessage(`An error occurred while ${action}`);
    }
  }

  useEffect(() => {

    const fetchPost = async () => {
      let token = localStorage.getItem('accesstoken');
      if (!token) {
        await refreshToken();
        token = localStorage.getItem('accesstoken');
      }
      if (token) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/posts/homepage/', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('Response from /posts/homepage/:', response.data);

          setPosts(posts);
        } catch (error: any) {
          setErrorMessage('Failed to fetch content, please try again');
        }
      } else {
        toast.error('Token is not available, please login again');
        localStorage.clear();
        router.push('/signin');
      }
    };
    fetchPost();
  }, []);
  return (
    <>
      <Header />
      <div className="container">
        <div>
          <div className="post-container">
            {posts.length === 0 ? (
              <p>No posts available</p>
            ) : (
              posts.map((post: any) => (
                <div className="posts" key={post.id}>
                  {post.image && <img className="post-image" src={`${post.image}`} />}
                  {post.video && <video className="post-video" src={`${post.video}`} controls />}
                  <div className="post-interact">
                    <p className="caption">{post.caption}</p>
                    <div>
                      <button
                        className={`heart-button ${likedPosts[post.id] || post.liked ? 'liked' : ''}`}
                        onClick={() => likePost(post.id)}>
                        &#10084;
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );}
/*
  return (
    <>
      <Header />
      <div className="container">
        <div>
          <div>
            <div className="post-container">
              {(posts.map((post: any) => (
                  <div className="posts" key={post.id}>
                    {post.image && <img className="post-image" src={`${post.image}`} />}
                    {post.video && <video className="post-video" src={`${post.video}`} />}
                    <div className="post-interact">
                      <p className="caption"> {post.caption}</p>
                      <div>
                        <button
                          className={`heart-button ${likedPosts[post.id] || post.liked ? 'liked' : ''}`}
                          onClick={() => likePost(post.id)}>
                          &#10084;
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}*/