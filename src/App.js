import React, { Component } from 'react';
import './App.css';
import { UserContext } from "./UserContext";

class InputForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      input: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      input: e.target.value,
    });
  };

  commit = () => {
    this.props.onCommit(this.state.input);
    this.setState({ input: '' });
  };

  render = () => {
    return (
      <div>
        <textarea onChange={this.handleChange} value={this.state.input}/>
        <button type="button" onClick={this.commit}>Comment</button>
      </div>
    );
  };

}

const defaultComments = [];

class CommentTrees extends Component {

  static contextType = UserContext;

  constructor(props) {
    super(props);
  }

  handleNewComment = text => this.props.handleChange([
    ...this.props.comments,
    {
      commentedBy: this.context && this.context.name || 'Unknown',
      text,
      createdAt: new Date().toString(),
      replies: [],
    },
  ]);

  handleCommentChange = index => newComment => this.props.handleChange(this.props.comments.map((comment, i) => (
    i === index ? newComment : comment
  )));

  render = () => {
    const { showAddForm, comments } = this.props;

    return (
      <ul>
        {comments.map((comment, index) => (
          <CommentTree
            key={index}
            comment={comment}
            handleChange={this.handleCommentChange(index)}
          />
        ))}
        {showAddForm && (
          <li>
            <InputForm onCommit={this.handleNewComment} />
          </li>
        )}
      </ul>
    );
  };

}

class CommentTree extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showReplyForm: false,
    }
  }

  toggleReplyForm = () => {
    this.setState(({ showReplyForm }) => ({
      showReplyForm: !showReplyForm,
    }));
  };

  handleRepliesChange = replies => {
    const { comment } = this.props;
    this.props.handleChange({
      ...comment,
      replies,
    });
  };

  render = () => {
    const { comment: { commentedBy, createdAt, text, replies } } = this.props;
    return (
      <React.Fragment>
        <li>
          {text} <small>by {commentedBy} ({createdAt})</small> <a href="#" onClick={this.toggleReplyForm}>Reply</a>
        </li>
        <CommentTrees
          comments={replies}
          showAddForm={this.state.showReplyForm}
          handleChange={this.handleRepliesChange}
        />
      </React.Fragment>
    );
  };

}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { comments: props.contentful.field.getValue() || defaultComments };
  }

  componentDidMount = () => {
    this.props.contentful.field.onValueChanged(value => {
      if (value) {
        this.setState({ comments: value })
      }
    });
  };

  handleChange = comments => {
    this.setState({ comments });
    this.props.contentful.field.setValue(comments);
  };

  render() {
    const { comments } = this.state;
    return (
      <div className="App">
        <CommentTrees
          showAddForm
          comments={comments}
          handleChange={this.handleChange}
        />
      </div>
    );
  }
}

export default App;
