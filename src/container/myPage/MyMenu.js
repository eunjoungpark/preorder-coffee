import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import Loading from '../../components/loading/Loading';
import Modal from '../../components/modal/Modal';
import Button from '../../components/form/button/Button';
import { Contents, PageTitle } from '../../components/common';
import * as productsImage from '../../images/products';
import { emptyLoading } from '../../store/loadings';
import {
  removeMenu,
  setMenu,
  MY_MENU,
  REMOVE_MY_MENU,
} from '../../store/mymenu';

const MyMenuWrap = styled.div`
  .list {
    li {
      padding: 10px 15px;
      &:nth-child(odd) {
        background-color: #ededed;
      }
      .menuImg {
        float: left;
        width: 70px;
        overflow: hidden;
        border-radius: 35px;
        img {
          display: block;
          margin: 0 50%;
          transform: translate(-50%, 0);
        }
      }
      .menuInfo {
        position: relative;
        overflow: hidden;
        padding: 0 30px 0 20px;
        button {
          width: 100%;
          padding: 10px 0;
        }

        span {
          display: flex;
          line-height: 1.5;

          &.ko {
            font-size: 18px;
            font-weight: bold;
          }
          &.en {
            font-size: 16px;
            color: #8c6046;
          }
        }
        .removeBtn {
          position: absolute;
          top: 50%;
          right: 0;
          width: 24px;
          height: 24px;
          padding: 1px 0 0 1px;
          border-radius: 13px;
          color: #8c6046;
          border: 1px solid #8c6046;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          transform: translate(0, -50%);
        }
      }
    }
  }
`;

const EmptyBox = styled.div`
  padding: 40px;
  color: #666;
  text-align: center;
  font-size: 16px;
`;

const MyMemu = ({
  auth,
  menuList,
  loadingMenu,
  loadingRemoveMenu,
  emptyLoading,
  removeMenu,
  setMenu,
  history,
}) => {
  useEffect(() => {
    if (auth.localId === null) {
      history.push('/');
    }
  }, [auth.localId]);

  useEffect(() => {
    return () => emptyLoading();
  }, []);

  const onRemoveMenuHandler = useCallback(id => {
    removeMenu({
      token: auth.idToken,
      userId: auth.localId,
      id,
    });
  }, []);

  const onSelectMenuHandler = useCallback(id => {
    setMenu(id);
    history.push('/mymenu/pay');
  }, []);

  return (
    <>
      {(loadingMenu || loadingRemoveMenu) && <Loading />}
      {loadingRemoveMenu === false && <Modal>삭제 되었습니다.</Modal>}
      {menuList && (
        <Contents>
          <PageTitle>나만의 메뉴 목록</PageTitle>
          <MyMenuWrap>
            {Object.keys(menuList).length > 0 ? (
              <ul className="list">
                {Object.keys(menuList).map(m => (
                  <li key={m} className="clear">
                    <p className="menuImg">
                      <img
                        width="100"
                        src={productsImage[menuList[m].image]}
                        alt={
                          menuList[m].nickname !== ''
                            ? menuList[m].nickname
                            : menuList[m].ko
                        }
                      />
                    </p>
                    <div className="menuInfo">
                      <Button
                        kind="blank"
                        onClick={() => onSelectMenuHandler(m)}
                      >
                        <span className="ko">
                          {menuList[m].nickname !== ''
                            ? menuList[m].nickname
                            : menuList[m].ko}
                        </span>
                        <span className="en">{menuList[m].en}</span>
                      </Button>
                      <Button
                        kind="blank"
                        className="removeBtn"
                        onClick={() => onRemoveMenuHandler(m)}
                      >
                        <MdClose />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyBox>나만의 음료를 저장해보세요!</EmptyBox>
            )}
          </MyMenuWrap>
        </Contents>
      )}
    </>
  );
};

MyMemu.propTypes = {
  auth: PropTypes.object.isRequired,
  menuList: PropTypes.object.isRequired,
  emptyLoading: PropTypes.func.isRequired,
  removeMenu: PropTypes.func.isRequired,
  setMenu: PropTypes.func.isRequired,
  loadingRemoveMenu: PropTypes.bool,
  loadingMenu: PropTypes.bool,
};

const mapStateToProps = ({ auth, mymenu, loadings }) => ({
  auth,
  menuList: mymenu.lists,
  loadingMenu: loadings[MY_MENU],
  loadingRemoveMenu: loadings[REMOVE_MY_MENU],
});

const mapDispatchToProps = { removeMenu, setMenu, emptyLoading };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyMemu);
