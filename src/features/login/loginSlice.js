import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/users_api';

const initialState = sessionStorage.getItem('userInfo')
  ? JSON.parse(sessionStorage.getItem('userInfo'))
  : {};

export const loginUser = createAsyncThunk('login/loginUser', async user => {
  try {
    const response = await api.post('/authentication/login/', user);
    sessionStorage.setItem('userInfo', JSON.stringify(response.data));
    return response.data;
  } catch (err) {
    return err.message;
  }
});

const loginSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    logout(state) {
      sessionStorage.removeItem('userInfo');
      state.userInfo = {};
    },
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { logout } = loginSlice.actions;
export default loginSlice.reducer;