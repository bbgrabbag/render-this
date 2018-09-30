# Render This

## Lightweight React State Management Library

Author **Ben Turner**

---

`npm i render-this`

---

### What?
`render-this` is a [React](https://reactjs.org/) state management tool for easily managing large or complex nested states. Additionally, it reduces the boilerplate code necessary for tools like [Redux](https://www.npmjs.com/package/redux).

---

### How?
`render-this` aggregates all the states and methods of arbitrarily many React components into a single consumable object, accessible via a very simple function called [`connect`](#§-connect)

---

### Why?
The philosophy of `render-this` is *keep things simple*. 

So you have a component. You want its state and methods to be available to all other components regardless of their location in the tree. You likely have two options:
 * Refactor it into redux using reducers/action creators.
   * **BUT** This requires a lot of boilerplate and perhaps learning a whole new design pattern.
 * Use the new `Context` API and create your own global state component.
   * This can get large and unwieldy fast.
   * Even with multiple smaller ones the `Provider` components start stacking up.
  
`render-this` essentially does this the second option for you. You simply broadcast which components you want to be globally available and all states/methods will be combined into a single consumable object accessible through [`connect`](#§-connect)

---

### Get Started 

First, wrap the application in the [`GlobalState`](#api-reference) component. 
```js
import GlobalState from "render-this";

ReactDOM.render(
  <GlobalState>
    <App />
  <GlobalState />
)

```

In order for a component to communicate with GlobalState, simply return its `this` value from render props:
```js
class Auth extends Component {
  constructor() {
    super()
    this.state = {
      user: null
    }
    // GlobalState binds each method for you
  }
  login(user) {
    this.setState({ user })
  }
  logout() {
    this.setState({ user: null })
  }
  render() {
    // GlobalState needs `this` in order to access its state and methods. 
    return this.props.render(this);
  }
}
```

Next just add `Auth` to the `components` array prop on [`GlobalState`](#api-reference): 
```js
import GlobalState from "render-this";

ReactDOM.render(
  //each component must be class-based!
  <GlobalState components={[Auth]}>
    <App />
  <GlobalState />
)
```

Elsewhere in your app, use the [`connect`](#§-connect) function to access all the methods on `Auth` as well as its current state. Notice that the props passed to login is called `auth`, which is just the camelCased name of the component `Auth` (the next version will allow for custom naming).

By default the entire state is passed down, but you can explicitly pick and choose which part of state you need. See  [`connect`](#§-connect) below.

```js
import { connect } from "render-this";

function Login(props) {
  return (
    <form onSubmit={() => props.auth.login({ username: "btdev" })}>
      <input type="text" placeholder="Username"/>
      <button>Login</button>
      <button type="button" onClick={props.auth.logout}>Logout, {props.auth.user && props.auth.user.username}</button>
    </form>
  )
}

export default connect(Login);

```

This pattern can be repeated as many times as you wish for any number of components. Just add them to the `components` array prop in `GlobalState`

```js
import GlobalState from "render-this";

ReactDOM.render(
  <GlobalState components={[Auth, Images, Comments]}>
    <App />
  <GlobalState />
)
```

In this example, `connect` would attach an object to props which looks something like this:
```js
console.log(props)
/*  {
//    auth: { /* ... */ },
//    images: { /* ... */ },
//    comments: { /* ... */}
//  }
```

--- 
### API Reference

### § `<GlobalState>`
Wrapper component which provides a React App with global state.

#### Props

| Name | Type | Default Value | Description
| --- | --- | --- | --- |
`components` *[optional]*| `Array` | `[]` | Array of React class-based components to be added to the global state.
| `children` *[required]* | `element` | `N/A` | The portion of the React tree to which the global state will be exposed

---

### § `connect`
HOC which adds global state object to props.

#### Args

| Name | Type | Default Value | Description
| --- | --- | --- | --- |
`Component` *[required]*| `React Component` | `N/A` | React Component to be provided props containing the global state. 
| `mapStateToProps` *[optional]* | `callback` | `state => state` | The portion of the React tree to which the global state will be exposed. Must return a javascript object.

```js
// will attach only the state.auth object onto props of <Login>
connect(Login, state => state.auth);
```

---
### Changelog

- 9/29 - Initial commit and README

---

### Upcoming Features

- Ability to add custom names of keys of the global state object instead of the default camelCased component name

- Built-in normalization method for easily flattening nested data.