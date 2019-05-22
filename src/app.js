import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import './app.scss';
import axios, { post, get } from 'axios';
import toastr from 'toastr';
import Scheduler from './Scheduler';
import Posts from './Posts';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  addToScheduledPosts(post) {
    this.setState({
      posts: [post, ...this.state.posts]
    });
  }

  componentDidMount() {
    this.getPosts(false);
  }

  getPosts(status) {
    get('/posts', {
      params: {
        published: status
      }
    }).then(response => {
      this.setState({ posts: response.data });
    });
  }

  deletePost(id, e) {
    console.log('deletePost', id);
    e.preventDefault();
    axios.delete('/schedule', { params: { id: id } }).then(response => {
      if (response.data.done) {
        this.setState({
          posts: this.state.posts.filter(post => {
            return post._id !== id;
          })
        });
        toastr.success('Posts removed');
      }
    });
  }

  publish(id, e) {
    console.log('publish', id);
    e.preventDefault();
    post('/schedule/publish', {
      id: id
    }).then(response => {
      console.log(response);
      if (response.data.published) {
        this.setState({
          posts: this.state.posts.filter(post => post._id !== id)
        });
        toastr.success('Posts pulished!');
      }
    });
  }

  render() {
    return (
      <div id="app">
        <Scheduler addPost={this.addToScheduledPosts.bind(this)} />
        <hr className="my-4" />
        <Posts
          posts={this.state.posts}
          deletePost={this.deletePost.bind(this)}
          publish={this.publish.bind(this)}
        />
      </div>
    );
  }
}

if (document.getElementById('root') !== null) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
