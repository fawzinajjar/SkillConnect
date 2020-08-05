import React, { Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';

//App Component That we Rendered To <div> element in the index.html 
const App = () => (
<Provider store={store} >
<Router>
    <Fragment>
      <Navbar />
      <Route exact path='/' component={Landing} />
      <section className="container" >
        <Alert/>
        <Switch>
          <Route exact path='/Register' component={Register}/>
          <Route exact path='/Login' component={Login}/>
        </Switch>
      </section>
    </Fragment>
</Router>
</Provider>
);

export default App;
