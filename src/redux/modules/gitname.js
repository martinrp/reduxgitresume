import fetch from 'isomorphic-fetch';
const REQUEST_POSTS = 'redux-example/gitname/REQUEST_POSTS';
const RECEIVE_POSTS = 'redux-example/gitname/RECEIVE_POSTS';

const initialState = {
  loaded: false,
  isFetching: false,
  didInvalidate: false,
  lastUpdated: '10/05/2013',
  items: [1, 2, 3],
  editing: {},
  sendError: {}
};

// Reducer

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_POSTS:
      console.log('reducer - REQUEST_POSTS', action);
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      console.log('reducer - RECEIVE_POSTS', action);
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

export function requestPosts(gitName) {
  return {
    type: REQUEST_POSTS,
    gitName
  };
}

export function receivePosts(gitName, json) {
  console.log('receivePosts', gitName, json);
  return {
    type: RECEIVE_POSTS,
    gitName,
    repos: json.data.children.map(child => child.data),
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
    dispatch(requestPosts(gitName));
    return requestGitRepos()
      .then(res => dispatch(receivePosts(gitName, res)));
  };
}
