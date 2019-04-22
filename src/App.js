import React, { Component } from 'react';
import styled from 'styled-components';

import data from './seed.json';
import IndexBar from './components/IndexBar';
import Article from './components/Article';
import Editor from './components/Editor';

const Title = styled.h1`
  text-align: center;
`;

const ButtonBar = styled.div`
  margin: 40px;
`;

// Create a Map containing the articles (the keys are section labels)
const populateArticleMap = articles => {
  const collection = new Map();

  articles.forEach(article => {
    const label = article.title[0].toUpperCase();
    if (collection.has(label)) {
      collection.get(label).push(article);
    } else {
      collection.set(label, [article]);
    }
  });

  return collection;
};

class App extends Component {
  constructor() {
    super();

    /*
      This code is responsible for setting up our data store.
      We read in the data from seed.json and place it in this Map object.

      The Map is a data structure that stores key-value pairs. In this instance,
      the keys are section labels (first letter of the title) and the values are
      arrays of the articles that appear in each section. Note that the section
      is determined by the first letter of the article's title.

      The Map does return keys in the order they are created, but the original
      article store is not in order, so you will need to sort both the section
      headings and the titles when you display them.
    */

    this.collection = populateArticleMap(data);

    // Initialize the App state
    this.state = {
      mode: 'view',
      currentArticle: undefined
    };

    this.handleEditorReturn = this.handleEditorReturn.bind(this);
  }

  handleEditorReturn(newArticle) {
    if (newArticle) {
      if (this.state.currentArticle) {
        // Not a cancel
        // This is a replacement, remove the old article
        const oldArticle = this.state.currentArticle;
        const section = this.collection.get(oldArticle.title[0].toUpperCase());
        const index = section.findIndex(
          item => item.title === oldArticle.title
        );
        if (index > -1) {
          section.splice(index, 1);
        }
      }

      // Add the new article
      const label = newArticle.title[0].toUpperCase();
      if (this.collection.has(label)) {
        this.collection.get(label).push(newArticle);
      } else {
        this.collection.set(label, [newArticle]);
      }

      // Load the new article as the current one
      this.setState({ currentArticle: newArticle });
    }

    // Switch to the browsing view
    this.setState({ mode: 'view' });
  }

  render() {
    const { currentArticle, mode } = this.state;

    // We are "viewing"
    if (mode === 'view') {
      // Create our buttons, we will pick which ones to show based on the
      // state of currentArticle
      const newButton = (
        <button
          onClick={() => this.setState({ mode: 'edit', currentArticle: null })}
        >
          New Article
        </button>
      );
      const editButton = (
        <button onClick={() => this.setState({ mode: 'edit' })}>
          Edit Article
        </button>
      );

      // Show the article if we have a current article
      let contents;
      if (currentArticle) {
        contents = (
          <div>
            <Article article={currentArticle} />
            <ButtonBar>
              {newButton} {editButton}
            </ButtonBar>
          </div>
        );
      } else {
        contents = <ButtonBar>{newButton}</ButtonBar>;
      }

      return (
        <div>
          <Title>Simplepedia</Title>
          <IndexBar
            collection={this.collection}
            currentArticle={currentArticle}
            select={article => this.setState({ currentArticle: article })}
          />
          {contents}
        </div>
      );
    }

    // We are "editing"
    return (
      <div>
        <Title>Simplepedia</Title>
        <Editor article={currentArticle} complete={this.handleEditorReturn} />
      </div>
    );
  }
}

export default App;
export { populateArticleMap, data }; // To facilitate testing
