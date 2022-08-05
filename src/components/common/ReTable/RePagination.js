// ********* Re-Pagination **********
// Version: M1
// Author:
// Updated: 09/11/2021
// **********************************

import { useEffect } from 'react';

import Pagination from 'rc-pagination';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import styled from 'styled-components';
import colors from 'styles/colors';

import 'rc-pagination/assets/index.css';

const RePagination = ({ name, total, current, pageSize, onChange, fromZero, ...restProps }) => {

    const [currentTheme, ] = useDarkMode()

    useEffect(() => {
       name && scrollAfterPageChange(name)
    }, [current, name])

    return (
        <PaginationWrapper isDark={currentTheme === THEME_MODE.DARK}>
            <Pagination hideOnSinglePage
                        total={total}
                        current={current}
                        pageSize={pageSize}
                        onChange={onChange}
                        {...restProps}/>
        </PaginationWrapper>
    )
}

const scrollAfterPageChange = (id) => {
    const element = document.getElementById(id)
    if (element) window.scrollTo({ top: element.offsetTop, behavior:"smooth" })
}

const PaginationWrapper = styled.div`
  
  .rc-pagination-item, .rc-pagination-prev button, .rc-pagination-next button {
    border: none;
    background-color: transparent;
    
    a {
      font-family: Barlow, serif !important;
      font-weight: 500 !important;
    }
    
    @media (min-width: 1366px) {
      a {
        font-size: 16px;
      }
    }
  }

  .rc-pagination-item a, .rc-pagination-prev button, .rc-pagination-next button {
    color: ${({ isDark }) => isDark ? colors.grey4 : colors.darkBlue};
  }
  
  
  
  .rc-pagination-item-active a, .rc-pagination-item:focus a, .rc-pagination-item:hover a {
    color: ${colors.teal};
  }

  .rc-pagination-jump-prev button:after, .rc-pagination-jump-next button:after {
    content: '...';
  }

  .rc-pagination-next button:after, .rc-pagination-prev button:after {
    margin-top: -0.3rem;
  }

  .rc-pagination-prev .rc-pagination-item-link, .rc-pagination-next .rc-pagination-item-link {
    font-size: 28px;
  }

  .rc-pagination-disabled .rc-pagination-item-link, .rc-pagination-disabled:hover .rc-pagination-item-link, .rc-pagination-disabled:focus .rc-pagination-item-link {
    color: ${({ isDark }) => isDark ? colors.grey1 : colors.darkBlue5};
  }

  .rc-pagination-prev:focus .rc-pagination-item-link, .rc-pagination-next:focus .rc-pagination-item-link,
  .rc-pagination-prev:hover .rc-pagination-item-link, .rc-pagination-next:hover .rc-pagination-item-link {
    color: ${colors.teal};
    border-color: ${colors.teal};
  }
`

export default RePagination


