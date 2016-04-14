import fetch from 'isomorphic-fetch';
const REQUEST_REPOS = 'redux-example/gitname/REQUEST_REPOS';
const RECEIVE_REPOS = 'redux-example/gitname/RECEIVE_REPOS';

const initialState = {
  loaded: false,
  isFetching: false,
  didInvalidate: false,
  lastUpdated: 1,
  items: [],
  editing: {},
  sendError: {}
};

// Reducer

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_REPOS:
      console.log('reducer - REQUEST_REPOS', action);
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_REPOS:
      console.log('reducer - RECEIVE_REPOS', action);
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.repos,
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

export function requestRepos(gitName) {
  console.log('requestRepos', gitName);
  return {
    type: REQUEST_REPOS,
    gitName
  };
}

export function receiveRepos(gitName, json) {
  console.log('receiveRepos', gitName, json);
  return {
    type: RECEIVE_REPOS,
    gitName,
    repos: json,
    receivedAt: Date.now()
  };
}

export function fetchAllRepos(req) {
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
      return repos;
    })

  }

  return dispatch => {
    dispatch(requestRepos(gitName));
    dispatch(receiveRepos(gitName, repos));
    return requestGitRepos()
      .then(res => dispatch(receiveRepos(gitName, res)));
  };
}
