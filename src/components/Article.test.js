import React from 'react';
import { shallow } from 'enzyme';

import Article from './Article';
import { sampleArticles } from '../setupTests';

const [article] = sampleArticles;

const articleEditedDate = new Date(article.edited);

describe('Article tests', () => {
  describe('Article content tests', () => {
    let comp;
    beforeEach(() => {
      comp = shallow(<Article article={article} />);
    });

    test('Has title', () => {
      expect(
        comp.findWhere(n => n.type() && n.text() === article.title)
      ).toHaveLength(1);
    });

    test('Has extract', () => {
      expect(
        comp.findWhere(n => n.type() && n.text() === article.extract)
      ).toHaveLength(1);
    });

    test('Has date', () => {
      expect(
        comp.findWhere(
          n => n.type() && n.text() === articleEditedDate.toLocaleString()
        )
      ).toHaveLength(1);
    });
  });

  describe('PropTypes', () => {
    test('Has PropTypes defined', () => {
      expect(Article).toHaveProperty('propTypes');
    });
  });
});
