import React, { Component } from 'react';
import './App.css';

const API_HOST = 'localhost';
const API_PORT =  8889;
const API_PATH = `http://${API_HOST}:${API_PORT}`;

const myFetch = async (url, data = {}, method) => await (await fetch(url, {
  method,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: method === 'GET' ? undefined : JSON.stringify(data)
})).json();

const get = async url => await myFetch(url, null, 'GET');
const patch = async (url, data) => await myFetch(url, data, 'PATCH');
const post = async (url, data) => await myFetch(url, data, 'POST');

class App extends Component {
  state = {
    todos: [],
    editing: null
  };

  async componentDidMount() {
    this.reloadTodos();
  }

  reloadTodos = async () => {
    const todos = await get(`${API_PATH}/todo`);
    this.setState({todos});
  }

  addTodo = async () => {
    const newTodo = await post(`${API_PATH}/todo`, {
      label: 'New'
    });

    this.setState({
      todos: [...this.state.todos, newTodo],
      editing: newTodo.id
    });
  }

  updateItemEditing = (id, editing) => this.setState({
    editing: editing ? id : null
  });

  updateItem = async (id, data) => {
    const updatedItem = await patch(`${API_PATH}/todo/${id}`, data);
    this.setState({
      todos: this.state.todos.map(item => item.id === id ? updatedItem : item)
    });
  };

  deleteItem = async id => {
    await patch(`${API_PATH}/todo/${id}`, {deleted: false});
    this.setState({
      todos: this.state.todos.filter(item => item.id !== id)
    });
  };

  render() {
    const {todos = [], editing} = this.state;

    return (
      <div className="App">
        <ul>
          {todos.map(({id, label, complete}) => (
            <li key={id} className={complete ? 'complete' : ''}>
              {editing === id ? (
                <input 
                  value={label} 
                  onChange={({target: {value: label}}) => this.updateItem(id, {label})}
                  onKeyPress={e => {
                    if (e.key === 'Enter') this.updateItemEditing(id, false);
                  }}
                />
              ) : (
                <span onClick={() => this.updateItemEditing(id, true)}>{label}</span>
              )}
              <button onClick={() => this.updateItem(id, {complete: !complete})}>{complete ? 'Not done' : 'Done'}</button>
              <button onClick={() => this.deleteItem(id, {deleted: true})}>Delete</button>
            </li>
          ))}
          <li class="add">
            <button onClick={this.addTodo}>Add</button>
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
