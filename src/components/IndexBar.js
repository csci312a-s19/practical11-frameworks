/*
  IndexBar displays the list of sections (first letter) for the collection of
  articles passed down in its props. Clicking on one of these sections displays
  a list of the available titles in that current section.

  props:
    collection: A Map of articles keyed by section
    select: A callback when article is selected
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ArticleShape } from './Article';

const HorizontalUL = styled.ul`
  list-style: none;
`;

const SectionItem = styled.li`
  display: inline;
  padding: 5px;
  font-weight: bold;
`;

const TitleItem = styled.li``;

/*
  Sections headers sub-component in the IndexBar.
  props:
    sections - the list of the available sections
    setSection - a callback for when a section has been selected
*/
export function IndexSections(props) {
  const { sections, setSection } = props;

  // Build the list of sections
  const sectionItems = sections.map(section => (
    <SectionItem
      key={section}
      onClick={() => {
        setSection(section);
      }}
    >
      {section}
    </SectionItem>
  ));

  return (
    <div>
      <HorizontalUL>{sectionItems}</HorizontalUL>
    </div>
  );
}

IndexSections.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSection: PropTypes.func.isRequired
};

/*
  Title list sub-component in the IndexBar.
  props:
    articles - the list of articles to be displayed
    select - the callback to indicate which title has been selected

  Note that this doesn't know about all articles: just those passed to it.
*/
export function IndexTitles(props) {
  // Sort the articles by title
  const { articles, select } = props;
  articles.sort((a1, a2) => a1.title.localeCompare(a2.title));

  // Assemble the list of titles
  const titles = articles.map(article => (
    <TitleItem
      key={article.title}
      onClick={() => {
        select(article);
      }}
    >
      {article.title}
    </TitleItem>
  ));

  return (
    <div>
      <ul>{titles}</ul>
    </div>
  );
}

IndexTitles.propTypes = {
  articles: PropTypes.arrayOf(ArticleShape).isRequired,
  select: PropTypes.func.isRequired
};

class IndexBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      section: props.currentArticle
        ? props.currentArticle.title[0].toUpperCase()
        : props.collection.keys().next().value
    };

    // This binding is necessary to make `this` work in the callback, without
    // creating a new callback in each render
    // https://reactjs.org/docs/handling-events.html
    this.handleSectionChange = this.handleSectionChange.bind(this);
  }

  // Possibly return new state in response to changes in props. Used instead of
  // the deprecated componentWillReceiveProps lifecycle method
  static getDerivedStateFromProps(props, state) {
    // If we have a (new) current article and have not changed the current
    // section (i.e. it is falsy), update the section. This handles a race condition in
    // component creation and updates to currentArticle.
    if (props.currentArticle && !state.section) {
      return { section: props.currentArticle.title[0].toUpperCase() };
    }
    return null;
  }

  handleSectionChange(newSection) {
    if (newSection !== this.state.section) {
      this.setState({ section: newSection });
      this.props.select(); // Deselect any current article
    }
  }

  render() {
    const { collection, select } = this.props;
    const { section } = this.state;

    // Conditionally create the title list if we have a selected section
    let titles;
    if (section) {
      const articles = collection.get(section);
      titles = <IndexTitles articles={articles} select={select} />;
    } else {
      titles = <p style={{ textAlign: 'center' }}>Select a section</p>;
    }

    return (
      <div>
        <IndexSections
          sections={Array.from(collection.keys()).sort()}
          setSection={this.handleSectionChange}
        />
        {titles}
      </div>
    );
  }
}

IndexBar.propTypes = {
  collection: PropTypes.instanceOf(Map).isRequired,
  select: PropTypes.func.isRequired,
  currentArticle: ArticleShape
};

IndexBar.defaultProps = {
  currentArticle: null
};

export default IndexBar;
