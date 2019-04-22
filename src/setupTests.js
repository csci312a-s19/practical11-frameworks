import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

configure({ adapter: new Adapter() });

export const sampleArticles = [
  {
    title: 'Alpha Centauri',
    extract: 'An alien diplomat with an enormous egg shaped head',
    edited: new Date('1972-01-29T18:00:40Z').toISOString(),
    id: 1
  },
  {
    title: 'Dominators',
    extract: 'Galactic bullies with funny robot pals.',
    edited: new Date('1968-08-10T18:00:40Z').toISOString(),
    id: 2
  },
  {
    title: 'Cybermen',
    extract:
      'Once like us, they have now replaced all of their body parts with cybernetics',
    edited: new Date('1966-10-08T18:00:40Z').toISOString(),
    id: 3
  },
  {
    title: 'Autons',
    extract: 'Plastic baddies driven by the Nestine consciousness',
    edited: new Date('1970-01-03T18:00:40Z').toISOString(),
    id: 4
  },
  {
    title: 'Daleks',
    extract: 'Evil little pepperpots of death',
    edited: new Date('1963-12-21T18:00:40Z').toISOString(),
    id: 5
  }
];

/* 
    Used to find the variety of buttons seen in use so far.
*/
export const findButton = (comp, labelRegEx) => {
  // Find <input type="button" ... />
  let button = comp
    .find('input[type="button"]')
    .filterWhere(n => labelRegEx.test(n.prop('value')));
  if (button.length === 0) {
    // If that didn't work, look for "<button> ..."
    button = comp
      .find('button')
      .filterWhere(
        n => labelRegEx.test(n.text()) || labelRegEx.test(n.prop('value'))
      );
  }
  return button;
};
