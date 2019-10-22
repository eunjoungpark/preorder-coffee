import React, { useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import produce from 'immer';
import Modal from '../modal/Modal';
import Input from '../form/input/Input';
import Button from '../form/button/Button';
import { checkEmail, checkPassword } from '../../libs/util';
import { initAuth, initSuccess, SET_AUTH } from '../../store/auth';
import { emptyMessage } from '../../store/error';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  label,
  input {
    font-size: 16px;
    color: #333;
  }
  fieldset {
    margin: 10px 0;
  }
  label {
    float: left;
    width: 30%;
    line-height: 40px;
  }
  input {
    width: 70%;
    height: 40px;
    padding: 10px;
    overflow: hidden;
  }
  button {
    margin-top: 25px;
    padding-top: 7px;
    padding-bottom: 7px;
  }
`;

const AuthModal = styled.div`
  text-align: center;
  &.error {
    color: #f00;
  }
`;

const ValidationMsg = styled.p`
  width: 70%;
  margin-left: 30%;
  padding: 5px;
  color: #fff;
  &.error {
    color: #dd6868;
  }
  &.success {
    color: #69d36e;
  }
`;

const WrongBox = styled.div`
  text-align: center;
  padding: 30px 0;
`;

const MESSAGE = {
  INVALID_PASSWORD: '비밀번호를 다시 확인 해주세요.',
  EMAIL_NOT_FOUND: '이메일 주소를 다시 확인 해주세요.',
  EMAIL_EXISTS: '이미 사용중인 이메일 주소입니다.',
  TOO_MANY_ATTEMPTS_TRY_LATER:
    '로그인 시도가 자주 발생했습니다. 30초 후, 다시 시도해주세요.',
};

const Auth = ({
  initAuth,
  initSuccess,
  emptyMessage,
  type,
  auth,
  error,
  history,
  location,
}) => {
  const [formValidation, setFormValidation] = useState({
    email: {
      value: '',
      valid: false,
      touched: false,
    },
    password: {
      value: '',
      valid: false,
      touched: false,
    },
  });

  //이메일 유효성 검사
  const onChangeHandlerEmail = useCallback(e => {
    const { value } = e.target;
    setFormValidation(
      produce(draft => {
        draft.email.value = value;
        draft.email.valid = checkEmail(value);
        draft.email.touched = true;
      }),
    );
  }, []);

  //비밀번호 유효성 검사
  const onChangeHandlerPasswd = useCallback(e => {
    const { value } = e.target;
    setFormValidation(
      produce(draft => {
        draft.password.value = value;
        draft.password.valid = checkPassword(value);
        draft.password.touched = true;
      }),
    );
  }, []);

  //회원가입 or 로그인 실행
  const onSubmitHandlerAccount = useCallback(
    e => {
      if (formValidation.email.valid && formValidation.password.valid) {
        initAuth({
          email: formValidation.email.value,
          password: formValidation.password.value,
          type,
        });
      }
      e.preventDefault();
    },
    [formValidation],
  );

  const onClickErrorHandler = useCallback(() => {
    emptyMessage(SET_AUTH);
  }, []);

  return (
    <Form onSubmit={onSubmitHandlerAccount}>
      {error && (
        <Modal onClickHandler={onClickErrorHandler}>
          <AuthModal className="error">
            {MESSAGE[error.message]
              ? MESSAGE[error.message]
              : MESSAGE['TOO_MANY_ATTEMPTS_TRY_LATER']}
          </AuthModal>
          <Button kind="default" onClick={onClickErrorHandler}>
            확인
          </Button>
        </Modal>
      )}

      <Input
        id="email"
        type="email"
        name="email"
        label="아이디"
        value={formValidation.email.value}
        placeholder="이메일 주소를 입력해주세요"
        changed={onChangeHandlerEmail}
        errormessage="errorId"
      />
      {formValidation.email.touched && (
        <ValidationMsg
          className={formValidation.email.valid ? 'success' : 'error'}
          id="errorId"
          role="alert"
          aria-live="assertive"
          aria-invalid={!formValidation.email.valid}
        >
          {formValidation.email.valid
            ? '유효한 이메일양식입니다.'
            : '잘못된 이메일 양식입니다.'}
        </ValidationMsg>
      )}
      <Input
        id="password"
        type="password"
        name="email"
        label="비밀번호"
        value={formValidation.password.value}
        placeholder="비밀번호를 입력해주세요"
        changed={onChangeHandlerPasswd}
        errormessage="errorPasswd"
      />
      {formValidation.password.touched && (
        <ValidationMsg
          id="errorPasswd"
          role="alert"
          aria-live="assertive"
          aria-invalid={!formValidation.password.valid}
          className={formValidation.password.valid ? 'success' : 'error'}
        >
          {formValidation.password.valid
            ? '유효한 형식의 비밀번호입니다.'
            : '6자 이상의 문자(소문자, 특수문자, 숫자)를 입력해주세요'}
        </ValidationMsg>
      )}
      <Button type="submit" kind="base">
        확인
      </Button>
    </Form>
  );
};

Auth.propTypes = {
  auth: PropTypes.object,
  error: PropTypes.object,
  initAuth: PropTypes.func.isRequired,
  initSuccess: PropTypes.func.isRequired,
  emptyMessage: PropTypes.func.isRequired,
  type: PropTypes.string,
};

const mapStateToProps = ({ auth, loadings, error }) => ({
  auth,
  loadingAuth: loadings[SET_AUTH],
  error: error[SET_AUTH],
});

const mapDispatchToProps = {
  initAuth,
  initSuccess,
  emptyMessage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Auth));
