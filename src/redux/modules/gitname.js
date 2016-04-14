import fetch from 'isomorphic-fetch';
const REQUEST_REPOS = 'redux-example/gitname/REQUEST_REPOS';
const RECEIVE_REPOS = 'redux-example/gitname/RECEIVE_REPOS';
const REQUEST_USER = 'redux-example/gitname/REQUEST_USER';
const RECEIVE_USER = 'redux-example/gitname/RECEIVE_USER';

const initialState = {
  loaded: false,
  isFetching: false,
  didInvalidate: false,
  lastUpdated: 1,
  repos: [],
  editing: {},
  sendError: {},
  user: {}
};

// Reducer

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_USER:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_USER:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        user: action.user,
        repos: action.repos,
        lastUpdated: action.receivedAt,
        sendError: {
          ...state.sendError,
          [action.id]: action.error
        }
      })
    default:
      return state;
  }
}

// Actions Creators

export function requestUser(gitName) {
  console.log('requestUser', gitName);
  return {
    type: REQUEST_USER,
    gitName
  };
}

export function receiveUser(gitName, user, repos) {
  console.log('receiveUser', gitName, user, repos);
  return {
    type: RECEIVE_USER,
    gitName,
    user: user,
    repos: repos,
    receivedAt: Date.now()
  };
}

// Commands

function fetchAllRepos(req) {
  let gitName = req.owner;
  let baseUrl = `https://api.github.com/users/${gitName}/repos?per_page=100`;
  let repos = [];
  let pageNum = 0;

  function requestGitRepos() {
    let url = baseUrl;
    if (pageNum > 1) { url = baseUrl + '&page=' + pageNum; }

    return fetch(url).then(function(res) {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json();
    })
    .then(function(json) {
      repos = repos.concat(json);
      if (json.length === 100) {
        pageNum = pageNum + 1;
        return requestGitRepos();
      }
      console.log('repos', repos);
      return repos;
    })

  }

  return requestGitRepos();

}

export function fetchUserData(req){
  let gitName = req.owner;
  let baseUrl = `https://api.github.com/users/${gitName}`;
  let repos = [];

  return dispatch => {
    dispatch(requestUser(gitName));
    // Fetch all user data and repos
    return Promise.all([fetch(baseUrl), fetchAllRepos(req)])
    .then(function(values) {
      values[0].json()
      .then(json => dispatch(receiveUser(gitName, json, values[1])));
    });
  }
}
