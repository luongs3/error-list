import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRedirect, IndexRoute, hashHistory} from 'react-router';

const Test = React.createClass(<div>HAHA</div>);

render(<Test />, document.getElementById('client'));
