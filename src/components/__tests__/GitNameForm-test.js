import React from 'react';
import ReactDOM from 'react-dom';
import {renderIntoDocument} from 'react-addons-test-utils';
import { expect} from 'chai';
import { GitNameForm } from 'components';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import createStore from 'redux/create';
import ApiClient from 'helpers/ApiClient';
const client = new ApiClient();

describe('GitNameForm', () => {
  const mockStore = {
    gitname: {
      loaded: false,
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1,
      repos: [
        { language: 'JavaScript' },
        { language: 'JavaScript' },
        { language: 'JavaScript' },
        { language: 'JavaScript' },
        { language: 'JavaScript' },
        { language: 'Python' },
        { language: 'Python' },
        { language: 'Python' },
        { language: 'Ruby' },
        { language: 'Ruby' }
      ],
      editing: {},
      sendError: {},
      user: { 
        login: 'martinrp', 
        id: 659163, 
        avatar_url: 'https://avatars.githubusercontent.com/u/659163?v=3', 
        url: 'https://api.github.com/users/martinrp'
      }
    }
  };
  const store = createStore(browserHistory, client, mockStore);
  const renderer = renderIntoDocument(
    <Provider store={store} key="provider">
      <GitNameForm/>
    </Provider>
  );
  const dom = ReactDOM.findDOMNode(renderer);

  it('should render correctly', () => {
    return expect(renderer).to.be.ok;
  });

  it('should display github user name', () => {
    const text = dom.getElementsByTagName('h2')[0].textContent;
    expect(text).to.equal(mockStore.gitname.user.login);
  });

  it('should display github user url', () => {
    const text = dom.getElementsByTagName('h4')[0].textContent;
    expect(text).to.equal(mockStore.gitname.user.url);
  });

  it('should render with a load button', () => {
    const text = dom.getElementsByTagName('button')[0].textContent;
    expect(text).to.be.a('string');
  });

  it('should render the correct languages', () => {
    const langBlock = dom.getElementsByClassName('user-langs')[0].textContent;
    expect(langBlock).to.contain('JavaScript');
    expect(langBlock).to.contain('Python');
    expect(langBlock).to.contain('Ruby');
    expect(langBlock).to.not.contain('C');
  });

  it('should render the correct language percentages', () => {
    const langBlock = dom.getElementsByClassName('user-langs')[0].textContent;
    expect(langBlock).to.contain('50%');
    expect(langBlock).to.contain('30%');
    expect(langBlock).to.contain('20%');
    expect(langBlock).to.not.contain('5%');
  });

});
