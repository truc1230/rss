import React from 'react';
import PropTypes from 'prop-types';
import Header from '../sections/Header';
import Footer from '../sections/Footer';

const Layout = ({ children }) => {
    return (
        <div className="">
            <Header></Header>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default Layout;
