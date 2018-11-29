import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { UserContext } from "./UserContext";

const cfExt = window.contentfulExtension || window.contentfulWidget;
cfExt.init((contentful) => {
  contentful.window.startAutoResizer();

  const { user: { firstName, lastName, email } } = contentful;
  const userName = (firstName && lastName) ? `${firstName} ${lastName}` : email;
  const user = { name: userName };

  ReactDOM.render(
    (
      <UserContext.Provider value={user}>
        <App contentful={contentful} />
      </UserContext.Provider>
    ),
    document.getElementById('root')
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
