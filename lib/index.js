/************* DEPENDENCIES *************/

import React, { createContext, Component } from 'react';
import PropTypes from "prop-types";
import GlobalState from './index';


/************* HELPERS *************/

/* @callback _mapStateToProps
** @param {Object} state - object representing entire global application state
** @returns {Object} object representing the portion of state to be combined with props
*/
const _mapStateToProps = state => state;

const _toCamelCase = str => str[0].toLowerCase() + str.slice(1);


/************* EXPORTS *************/

export const { Provider, Consumer } = createContext();

/* Attaches global state (or some portion of it) to the props of a given component
** @param {class} C - React Component
** @param  {cb} [cb = _mapStateToProps] - Retrieves a portion of state as props
** @returns {func} React Component containing props from global state
*/
export const connect = (C, cb = _mapStateToProps) => props => <Consumer children={state => <C {...cb(state)}{...props} />} />


/************************************************************/
/** GLOBAL STATE COMPONENT (view PropTypes for @param info)**/
/************************************************************/

export default class GlobalState extends Component {
  constructor(props) {
    super(props);
    this._stackComponents = this._stackComponents.bind(this);
    this._getMethods = this._getMethods.bind(this);
  }

  _getMethods(C, context) {
    const ignoredPrototypes = ["constructor", "render"];
    return Object.getOwnPropertyNames(C.prototype).reduce((obj, key) => {
      if (!ignoredPrototypes.includes(key)) obj[key] = Object.create(C.prototype)[key].bind(context);
      return obj;
    }, {})
  }

  _stackComponents(components, globalState = {}) {
    if (!components.length) return <Provider value={globalState}>{this.props.children}</Provider>
    const C = components[0];
    const _render = context => {
      const componentName = _toCamelCase(context.constructor.name);
      globalState = {
        ...globalState,
        [componentName]: {
          ...context.state,
          ...this._getMethods(C, context)
        }
      }
      return this._stackComponents(components.slice(1), globalState)
    }
    return <C render={_render} />
  }

  render() {
    return this._stackComponents(this.props.components);
  }
}

GlobalState.propTypes = {
  components: PropTypes.arrayOf(PropTypes.func),
  children: PropTypes.element.isRequired
}
GlobalState.defaultProps = {
  components: []
}
