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
    const todos = await get(`${API_PATH}/todo`);
    this.setState({todos});
  }

  addItem = async () => {
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
    await patch(`${API_PATH}/todo/${id}`, {deleted: true});
    this.setState({
      todos: this.state.todos.filter(item => item.id !== id)
    });
  };

  render() {
    const {todos = [], editing} = this.state;

    return (
      <List
        todos={todos}
        editing={editing}
        updateItem={this.updateItem}
        updateItemEditing={this.updateItemEditing}
        deleteItem={this.deleteItem}
        addItem={this.addItem}
      />
    );
  }
}

const List = ({todos, editing, updateItem, updateItemEditing, deleteItem, addItem}) => (
  <div className="App">
    <ul>
      {todos.map(item => (
        <ListItem
          {...item}
          editing={editing}
          updateItem={updateItem}
          updateItemEditing={updateItemEditing}
          deleteItem={deleteItem}
        />
      ))}
      <li class="add">
        <button onClick={addItem}>Add</button>
      </li>
    </ul>
  </div>
);

const ListItem = ({id, complete, editing, label, updateItem, updateItemEditing, deleteItem}) => (
  <li key={id} className={complete ? 'complete' : ''}>
    {editing === id ? (
      <input 
        value={label} 
        onChange={({target: {value: label}}) => updateItem(id, {label})}
        onKeyPress={e => {
          if (e.key === 'Enter') updateItemEditing(id, false);
        }}
      />
    ) : (
      <span onClick={() => updateItemEditing(id, true)}>{label}</span>
    )}
    <button onClick={() => updateItem(id, {complete: !complete})}>{complete ? 'Undo' : 'Done'}</button>
    <button onClick={() => deleteItem(id)}>Delete</button>
  </li>
);

export default App;
