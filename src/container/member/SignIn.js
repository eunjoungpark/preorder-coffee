import React from 'react';
import { Contents, PageTitle } from '../../components/common';
import Auth from '../../components/auth/Auth';

const SignIn = () => {
  return (
    <Contents>
      <PageTitle>로그인</PageTitle>
      <Auth type="signin" />
    </Contents>
  );
};

export default SignIn;
