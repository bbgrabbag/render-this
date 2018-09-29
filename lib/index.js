import React, { createContext, createElement } from 'react';
import PropTypes from "prop-types";

const { Provider, Consumer } = createContext();

/************* HELPERS *************/

const _mapStateToProps = state => state;

const _getMethods = (C, context) => {
  const ignoredPrototypes = ["constructor", "render"];
  return Object.getOwnPropertyNames(C.prototype).reduce((obj, key) => {
    if (!ignoredPrototypes.includes(key)) obj[key] = C.prototype[key].bind(context);
    return obj;
  }, {})
}

const _toCamelCase = str => str[0].toLowerCase() + str.slice(1);

const _stackComponents = (components, children, globalState = {}) => {
  if (!components.length) return <Provider value={globalState}>{children}</Provider>
  const C = components[0];
  const _render = (state, context) => {
    const newGlobalState = {
      ...globalState,
      [_toCamelCase(context.constructor.name)]: {
        ...state,
        ..._getMethods(C, context)
      }
    }
    return _stackComponents(components.slice(1), children, newGlobalState)
  }
  return <C render={_render} />
}

/************* EXPORTS *************/

/* Attaches global state (or some portion of it) to the props of a given component
** @param {class} C - React Component
** @param  {cb} [cb = _mapStateToProps] - Retrieves a portion of state as props
** @returns {func} React Component containing props from global state
*/
export const connect = (C, cb = _mapStateToProps) => props => <Consumer children={state => <C {...cb(state)}{...props} />} />

/************************************************************/
/** GLOBAL STATE COMPONENT (view PropTypes for @param info)**/
/************************************************************/

export default function GlobalState({ components, children }) {
  return _stackComponents(components, children);
}

GlobalState.propTypes = {
  components: PropTypes.arrayOf(PropTypes.func).isRequired,
  children: PropTypes.element.isRequired
}
