import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import utils from './utils';
import socket from './socket';
import spot from './spot';
import futures from './futures';
import wallet from './wallet';
import notification from './notification';
import heath from './heath';
import nao from './nao';

const rootReducer = combineReducers({
    auth,
    user,
    utils,
    socket,
    spot,
    futures,
    notification,
    wallet,
    heath,
    nao
});

export default rootReducer;
