import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
import * as gitnameActions from 'redux/modules/gitname';

@connect(
  state => ({
    sendError: state.gitname.sendError,
    items: state.gitname.items,
    isFetching: state.gitname.isFetching,
    lastUpdated: state.gitname.lastUpdated
  }),
  dispatch => bindActionCreators(gitnameActions, dispatch)
)

//

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
    fetchAllRepos: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    sendError: PropTypes.object,
    formKey: PropTypes.string,
    values: PropTypes.object.isRequired,
    items: PropTypes.array,
    isFetching: PropTypes.bool,
    lastUpdated: PropTypes.string
  };

  render() {
    const { fields: {owner}, formKey, handleSubmit, invalid,
      pristine, fetchAllRepos, submitting, sendError: { [formKey]: sendError }, values, items, isFetching, lastUpdated } = this.props;
    const styles = require('components/GitNameForm/Widgets.scss');

    // console.log('PROPS', sendError, items, isFetching, lastUpdated, submitting);

    return (

      <div className={submitting ? styles.loading : ''}>
        <div className={styles.ownerCol}>
          <input type="text" className="form-control" {...owner}/>
          {owner.error && owner.touched && <div className="text-danger">{owner.error}</div>}
        </div>
        <div className={styles.buttonCol}>
          <button className="btn btn-success"
                  onClick={handleSubmit(() => fetchAllRepos(values)
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
        <div>ITEMS</div>
        <div>{items}</div>

        {submitting && <div>submitting</div>}
      </div>
    );
  }
}
