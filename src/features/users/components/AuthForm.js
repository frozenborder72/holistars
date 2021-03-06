import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../login/loginSlice';
import { registerUser } from '../usersSlice';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ login }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialLoginlUser = {
    email: '',
    password: ''
  };

  const initialRegisterlUser = {
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    image: '',
    bio: ''
  };

  const [user, setUser] = useState(login ? initialLoginlUser : initialRegisterlUser);

  const [previewSource, setPreviewSource] = useState();

  const handleFormChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      dispatch(loginUser(JSON.stringify(user)));
      navigate('/');
    } catch (err) {
      console.error(err);
    }
    setUser(initialLoginlUser);
  };

  const handleImage = async (e) => {
    const image = e.target.files[0];
    previewImage(image);
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'mx89penn');
    const { data } = await axios.post(
      'https://api.cloudinary.com/v1_1/holistars/image/upload',
      formData
    );
    setUser({ ...user, image: data.url });
  };

  const previewImage = (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      dispatch(registerUser(user));
    } catch (err) {
      console.error('Failed to register user', err);
    }
    setUser(initialRegisterlUser);
    navigate('/');
  };

  return (
    <div>
      <form className='form form__register'>
        {!login && (
          <div className='form-control'>
            <label htmlFor='username'>Username:</label>
            <input
              className='input'
              type='text'
              id='username'
              name='username'
              value={user.username}
              onChange={handleFormChange}
            />
          </div>
        )}
        <div className='form-control'>
          <label className='label' htmlFor='email'>
            Email:
          </label>
          <input
            className='input'
            type='email'
            id='email'
            name='email'
            value={user.email}
            onChange={handleFormChange}
          />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password:</label>
          <input
            className='input'
            type='password'
            id='password'
            name='password'
            value={user.password}
            onChange={handleFormChange}
          />
        </div>
        {!login && (
          <>
            <div className='form-control'>
              <label htmlFor='password_confirmation'>Confirm Password:</label>
              <input
                className='input'
                type='password'
                id='password_confirmation'
                name='password_confirmation'
                value={user.password_confirmation}
                onChange={handleFormChange}
              />
            </div>
            <div className='form-control'>
              <label htmlFor='image'>Image:</label>
              <input className='input' type='file' id='image' name='image' onChange={handleImage} />
            </div>
            {previewSource && (
              <img
                src={previewSource}
                style={{
                  height: '300px',
                  width: '300px',
                  marginInline: 'auto',
                  borderRadius: '10px'
                }}
                alt=''
              />
            )}
            <div className='form-control'>
              <label htmlFor='bio'>Bio:</label>
              <textarea
                className='textarea input'
                id='bio'
                name='bio'
                value={user.bio}
                onChange={handleFormChange}
              ></textarea>
            </div>
          </>
        )}
        {login ? (
          <button type='submit' className='button' onClick={handleLogin}>
            Login
          </button>
        ) : (
          <button type='submit' className='button' onClick={handleRegister}>
            Register
          </button>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
