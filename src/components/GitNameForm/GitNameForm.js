import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import * as gitnameActions from 'redux/modules/gitname';
import _ from 'underscore';

@connect(
  state => ({
    sendError: state.gitname.sendError,
    repos: state.gitname.repos,
    user: state.gitname.user,
    isFetching: state.gitname.isFetching,
    lastUpdated: state.gitname.lastUpdated
  }),
  dispatch => bindActionCreators(gitnameActions, dispatch)
)

@reduxForm({
  form: 'widget',
  fields: ['owner']
})

export default class GitNameForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    fetchUserData: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired,
    sendError: PropTypes.object,
    formKey: PropTypes.string,
    user: PropTypes.object,
    repos: PropTypes.array,
    isFetching: PropTypes.bool,
    lastUpdated: PropTypes.number
  };

  render() {
    const { fields: {owner}, formKey, handleSubmit, invalid,
      pristine, fetchUserData, submitting, sendError: { [formKey]: sendError }, 
      values, user, repos, isFetching, lastUpdated } = this.props;
    const styles = require('components/GitNameForm/Gitform.scss');

    function userLoaded(){
      return user && user.login && user.login.length > 0;
    }

    function getUserCodeSplit(){

      let languages = {};
      let langPerc = [];
      let repoNum = 0;

      // Split into language popularity
      _.each(repos, function(repo, i) {
        if (repo.language) {
          repoNum++;
          if (repo.language in languages) {
            languages[repo.language]++;
          } else {
            languages[repo.language] = 1;
          }
        }
      });

      // Get repo total / language percentage
      langPerc = _.map(languages, function(num, lang) {
        return { 
          'language': lang,
          'perc': parseInt((num / repoNum) * 100, 10)
        }
      });

      return _.sortBy(langPerc, function(obj){ return -obj.perc; });
    }

    return (
      <div>

        <div className={submitting ? styles.loading : ''}>
          <div className={'col-md-10'}>
            <input type="text" className="form-control" {...owner}/>
            {owner.error && owner.touched && <div className="text-danger">{owner.error}</div>}
          </div>
          <div className={'col-md-2 button-col'}>
            <button className="btn"
              onClick={handleSubmit(() => fetchUserData(values)
                .then(result => {
                  if (result && typeof result.error === 'object') {
                    return Promise.reject(result.error);
                  }
                })
              )}
              disabled={pristine || invalid || submitting}>
              <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Send
            </button>
            {sendError && <div className="text-danger">{sendError}</div>}
          </div>
        </div>

        {userLoaded() && <div className={'col-md-12'}>
          <img src={user.avatar_url} className="img-responsive" alt={user.login + 'Avatar'}></img>
          <h2>{user.login}</h2>
          <h4>{user.url}</h4>
          <h3>Languages</h3>
          <div>
            {_.map(getUserCodeSplit(), function(obj, i) {
              return <p>{obj.language} &#45; {obj.perc}&#37;</p>;
            })}
          </div>
        </div>}

      </div>
    );
  }
}
