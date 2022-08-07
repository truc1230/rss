import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="">
            <Header></Header>
            {children}
        </div>
    );
};

export default Layout;
