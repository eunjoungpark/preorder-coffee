import styled from 'styled-components';

/* Layout */
export const Container = styled.section`
  position: relative;
`;

export const Contents = styled.section`
  padding: 20px 10px;
`;

/* Modal */
export const ModalContents = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 300px;
  padding: 20px;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  background-color: #fff;
  z-index: 12;
  line-height: 1.5;
  text-align: center;
  h1 {
    margin-bottom: 20px;
    font-weight: bold;
  }
  button {
    margin: 15px 5px 0 5px !important;
    font-size: 14px;
  }
`;

/* Title */
export const PageTitle = styled.h2`
  margin-bottom: 30px;
  color: #000;
  font-size: 26px;
  font-weight: bold;
  line-height: 1.5;
  .ko {
    display: block;
    font-size: 18px;
    color: #333;
  }
`;

export const PageSecnTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  font-size: 22px;
`;

export const SubTitle = styled.h3`
  margin: 50px 0 15px;
  padding: 0 10px 15px 10px;
  color: #333;
  font-size: 20px;
  border-bottom: 1px solid #ababab;
`;

/* Align */
export const AlignCenter = styled.div`
  text-align: center;
`;

export const AlignLeft = styled.div`
  text-align: left;
`;

export const AlignRight = styled.div`
  text-align: right;
`;

/* Flex */
export const FlextCont = styled.div`
  display: flex;
  > * {
    flex: 1;
  }

  button {
    margin-top: 30px;
    padding: 10px;
  }
`;
