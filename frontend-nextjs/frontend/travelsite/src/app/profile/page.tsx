"use client";
import React, { useEffect, useState } from "react";
import './components/page.css';
import Header from "../components/header";
import { useRouter } from "next/navigation";
import ProtectedRouter from "../components/ProtectedRoute";
import axios from "axios";
import { useAuth } from "../components/Authcontext";
import { toast } from "react-toastify";

export default function Homepage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: Boolean }>({});
  const {refreshToken} = useAuth();

  const create_post = () => {
    router.push('/createpost');
  };

  
  const likePost = async (postId: number) => {
    
    try {
      let token = localStorage.getItem('accesstoken');
      if (!token) {
        await refreshToken();
        token = localStorage.getItem('accesstoken');
        return;
      }
      const response = await axios.post(
        `http://127.0.0.1:8000/posts/likepost/${postId}/`,
        { post_id: postId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      if (response.status === 200) {
        const action = response.data.Messages.split(' ')[1];
        alert(`Post ${action} successfully`);

      }
      setLikedPosts(prevLikedPosts => ({
        ...prevLikedPosts,
        [postId]: !prevLikedPosts[postId],
      }));
    } catch (error: any) {
      setErrorMessage('An error occurred while liking the post');
    }
  };

  const deletePost = async (postId: number) => {
    const token = localStorage.getItem('accesstoken');
    if (!token) {
      setErrorMessage('Please login again to continue');
      router.push('/signin');
      return;
    }
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/posts/deleteposts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { post_id: postId }
      });
      if (response.status === 202) {
        alert('Post deleted successfully');
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || 'Error occured while deleting post, try again later');
      } else {
        toast.error('Error occured while deleting post, try again later');
      }
    }
  };

  useEffect(() => {
    let token = localStorage.getItem('accesstoken');
    if (!token) {
      refreshToken();
      token = localStorage.getItem('accesstoken');
    }

    const fetchPost = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/posts/userposts/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Response from /posts/userposts/:', response.data);


        /*setPosts(response.data);*/
      
        const likedResponse = await axios.post('http://127.0.0.1:8000/posts/likedposts/', {},{
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        const likedData = likedResponse.data.reduce((acc: any, post: any) => {
          acc[post.id] = true;
          return acc;
        }, {});

        const updatedPosts = response.data.map((post: any) => ({
          ...post,
          liked:likedData[post.id] || false
        }));
                           
        const sortedposts = updatedPosts.sort((a: any, b: any) => 
          new Date(b.upload_time).getTime() - new Date(a.upload_time).getTime());

      setPosts(sortedposts);

      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.error || 'An error occurred');
        } else {
          toast.error('An error occurred');
        }
      }
    }
  fetchPost();
  }, []);

  const deleteUser = async (UserId: number) => {
    const token = localStorage.getItem('accesstoken');
    if (!token) {
      router.push('/signin');
      return;
    }
    if (!UserId) {
      alert("User not found" + "" + UserId + "");
      return;
    }
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/auth/du/${UserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: { user_id: UserId }

      });

      if (response.status === 200) {
        alert('User deleted successfully');
        localStorage.clear();
        router.push('/signin');
      } else {
        alert('Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    }
  };
  return (
    <>
      <Header />
      <ProtectedRouter>
        <div className="container">
          <div className="div-heading">
            <h1 className="heading">Your Profile</h1>
            <button className="button-create-post" onClick={create_post}>Upload</button>
            <button className="button-delete-user" onClick={ () => deleteUser(Number(localStorage.getItem('User_id')))}>Delete User</button>
          </div>
          <div className="post-container">
            {posts.length === 0 ? (
              <p>No post found</p>
            ) : (
              posts.map((post: any) => (
                <div className="posts" key={post.id}>
                  {post.image && <img className="post-image" src={`${post.image}`} />}
                  {post.video && <video className="post-video" src={`${post.video}`} controls />}
                  <div className="post-interact">
                    <p className="caption">{post.caption}</p>
                    <div>
                      <button
                        className={`heart-button ${ likedPosts[post.id] || post.liked ? 'liked' : ''}`}
                        onClick={() => likePost(post.id)}>
                        &#10084;
                      </button>
                      <button className="delete-button" onClick={() => deletePost(post.id)}> &#128465;</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ProtectedRouter>
    </>
  );
}