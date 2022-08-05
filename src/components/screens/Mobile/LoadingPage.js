import React from 'react';
import { getS3Url } from '../../../redux/actions/utils';
import styled, { keyframes } from 'styled-components';
import colors from '../../../styles/colors';

const LoadingPage = () => {
    return (
        <div className="h-[100vh] w-full bg-onus text-white flex flex-col items-center justify-center">
            <img src={getS3Url('/images/logo/nami_maldives.png')} width="100" height="100" />
            <div className="font-medium text-sm pt-[60px] pb-[20px]">Change mindset, make giant steps</div>
            <Loader>
                <div class="progress-bar" ></div>
            </Loader>
        </div>
    );
};

const animation = keyframes`
  0% {
  transform:translateX(0)
 }
 to {
  transform:translateX(300%)
 }
`;


const Loader = styled.div.attrs({
    className: ''
})`
  width: 100%;
  width: 200px;
  height: 3px;
  background: #333C54;
  border-radius: 18px;
  overflow: hidden;
  .progress-bar{
    position: relative;
    left: -50%;
    width: 50%;
    background: ${colors.teal};
    height: 3px;
    border-radius: 18px;
    transition:all;
    animation: ${animation} 2s linear infinite
  }

`



export default LoadingPage;
