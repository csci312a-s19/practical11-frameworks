/*
  Editor implements a form for creating a new article or editing an existing
  article.
  props:
    article: The article to be edited [optional]
    complete: A callback to add or save article
  The complete callback should have one optional argument. Calling complete
  with no arguments cancels the operation. Otherwise complete is invoked with
  the article object to be added or updated.
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ArticleShape } from './Article';

const EditorContainer = styled.div`
  margin: 40px;
`;

const TitleInput = styled.input`
  display: block;
`;

const ExtractInput = styled.textarea`
  margin: 10px 0px;
  display: block;
`;

class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: props.article ? props.article.title : '',
      extract: props.article ? props.article.extract : ''
    };

    // This binding is necessary to make `this` work in the callback, without
    // creating a new callback in each render
    // https://reactjs.org/docs/handling-events.html
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleTitle = this.handleTextUpdate.bind(this, 'title');
    this.handleExtract = this.handleTextUpdate.bind(this, 'extract');
  }

  handleTextUpdate(field, event) {
    this.setState({ [field]: event.target.value });
  }

  handleSave() {
    const now = new Date();
    const newArticle = {
      title: this.state.title,
      extract: this.state.extract,
      edited: now.toISOString()
    };
    this.props.complete(newArticle);
  }

  handleCancel() {
    this.props.complete();
  }

  render() {
    const { title, extract } = this.state;

    return (
      <EditorContainer>
        <TitleInput
          type="text"
          size="45"
          value={title}
          placeholder="Title must be set"
          onChange={this.handleTitle}
        />
        <ExtractInput
          cols="100"
          rows="10"
          value={extract}
          placeholder="Contents"
          onChange={this.handleExtract}
        />
        <div>
          <button disabled={title === ''} onClick={this.handleSave}>
            Save
          </button>{' '}
          <button onClick={this.handleCancel}>Cancel</button>
        </div>
      </EditorContainer>
    );
  }
}

Editor.propTypes = {
  article: ArticleShape,
  complete: PropTypes.func.isRequired
};

Editor.defaultProps = {
  article: null
};

export default Editor;
