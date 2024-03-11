import React, { useState } from 'react';
import CommonInput from '@/atoms/CommonInput/CommonInput';
import ModifyProfileImg from '@/atoms/ModifyProfileImg/ModifyProfileImg';
import SubmitButton from '@/atoms/SubmitButton/SubmitButton';
import AccountPageTitle from '@/atoms/AccountPageTitle/AccountPageTitle';
import { useRef } from 'react';
import { useUserStore } from '@/zustand/useUserStore';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';

function SetInitialProfile() {
  const [username, setUsername] = useState('');
  const [handle, setHandle] = useState('');
  const [image, setImage] = useState(null);
  const { updateUser } = useUserStore();

  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...storedUser, username, handle, image };

  const isNameValid = /^[a-zA-Z]+$/.test(username) && username.length >= 3 && username.length <= 16;
  const isHandleValid = /^[a-zA-Z]+$/.test(handle) && handle.length >= 3 && handle.length <= 16;

  const pb = new PocketBase('https://pocket10.kro.kr');

  const userObject = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userObject.id;

  const handleImageChange = (imageFile) => {
    setImage(imageFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isNameValid || !isHandleValid) {
      alert('폼 검증 실패');
      return;
    }

    updateUser({ username, handle, image });
    localStorage.setItem('user', JSON.stringify(updatedUser));

    try {
      const userData = {
        username: username,
        handle: handle,
      };
      console.log(userData);
      await pb.collection('users').update(userId, userData);
      console.log('데이터 저장 중...');
      navigate('/style');
    } catch (error) {
      console.error('데이터 저장 실패:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[320px] h-[650px] mx-auto flex flex-col items-center justify-start">
      <AccountPageTitle text={'프로필 설정'} className={'mt-75px mb-18px'} />
      <ModifyProfileImg onImageChange={handleImageChange} />
      <div className="mb-1">
        <CommonInput
          text="닉네임"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="커뮤니티에서 사용할 닉네임"
        />
        <div className="text-red-500 text-xs h-1">
          {!isNameValid && username.length > 0 && '3글자 이상, 16글자 이하의 영문이어야 합니다.'}
        </div>
      </div>
      <div className="mb-2">
        <CommonInput
          text="핸들"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="개인페이지 ID"
        />
        <div className="text-red-500 text-xs h-1">
          {!isHandleValid && handle.length > 0 && '3글자 이상, 16글자 이하의 영문이어야 합니다.'}
        </div>
      </div>
      <SubmitButton isFormValid={isNameValid && isHandleValid} text="설정" width="w-36" className={'mt-30px'} />
    </form>
  );
}

export default SetInitialProfile;
