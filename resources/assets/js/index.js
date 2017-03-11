import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRedirect, IndexRoute, hashHistory} from 'react-router';
import Tag from './containers/tag';
import Errors from './containers/errors';
import App from './app';

const routers = (
    <Router history={hashHistory} >
        <Route path='/' component={App}>
            <Route path='errors'>
                <IndexRoute component={Errors} />
            </Route>
            <Route path='tags' component={Tag} />
        </Route>
    </Router>
);

render(routers, document.getElementById('app'));
