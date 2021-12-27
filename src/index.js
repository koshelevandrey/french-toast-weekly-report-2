import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './modules/app/app.component';
import reportWebVitals from './reportWebVitals';
import './styles/main.scss';
import 'bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { Initialisation } from './modules/app/setup.component';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth0Provider
                domain={process.env.REACT_APP_AUTH0_DOMAIN}
                clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
                redirectUri={window.location.origin}
                cacheLocation='localstorage'
                useRefreshTokens={true}
                audience={process.env.REACT_APP_AUTH0_AUDIENCE}>
                <App />
            </Auth0Provider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
