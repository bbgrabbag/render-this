import React, { createContext } from 'react';
import PropTypes from "prop-types";

const { Provider, Consumer } = createContext();

const _mapStateToProps = state => state;

const _stackComponents = (components, children, state = {}) => {
  if (!components.length) return <Provider value={state}>{children}</Provider>
  const C = components[0];
  return <C render={props => _stackComponents(components.slice(1), children, { ...state, ...props })} />
}

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
