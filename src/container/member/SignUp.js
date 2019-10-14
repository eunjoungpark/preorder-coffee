import React from 'react';
import { Contents, PageTitle } from '../../components/common';
import Auth from '../../components/auth/Auth';

const SignUp = () => {
  return (
    <Contents>
      <PageTitle>회원가입</PageTitle>
      <Auth type="signup" />
    </Contents>
  );
};

export default SignUp;
