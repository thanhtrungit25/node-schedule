import React, { Component } from 'react';
import moment from 'moment';

export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: props.posts
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      posts: props.posts
    };
  }

  render() {
    return (
      <div className="scheduled-posts">
        <h2 className="text-center">Scheduled Posts</h2>

        <hr className="my-4" />

        {this.state.posts.map((post, index) => {
          return (
            <div
              className="post mr-auto ml-auto col-xs-12 col-sm-12 col-md-8 col-lg-6"
              key={index}
            >
              <div className="card">
                {post.type_of === 'photo' && (
                  <img className="card-img-top" src={post.media} />
                )}

                <div className="card-body">
                  <h5 className="card-title">Hello</h5>

                  <h6 className="card-subtitle mb-2 text-muted">
                    Page Name: Tien thanh law
                  </h6>

                  <h6 className="card-subtitle mb-2 text-muted">
                    Publish at:{' '}
                    {moment
                      .unix(post.schedule_time)
                      .format('MMMM Do YYYY, h:mm:ss a')}
                  </h6>

                  <h6 className="card-subtitle mb-2 text-muted">
                    Post Type: {post.type_of === 'text' ? 'Text' : 'Media'}
                  </h6>
                  <div className="actions">
                    <a
                      href="#"
                      className="card-link"
                      onClick={this.props.deletePost.bind(this, post._id)}
                    >
                      Delete
                    </a>
                    <a
                      href="#"
                      className="card-link"
                      onClick={this.props.publish.bind(this, post._id)}
                    >
                      Publish
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
