import React, { Component } from 'react';
import CreatePost from "./CreatePost";
import { Constants } from "../constants/const";
import Replies from "./Replies";

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: false,
            reply: false
        };
    }

    toggleComment = (event) => {
        event.preventDefault();
        const { comment } = this.state;

        this.setState({ comment: !comment });
    };

    render() {
        const { comments, sendPost, postId } = this.props;
        const { toggleComment } = this;
        const { comment } = this.state;

        return <div>
            <a className="comment" onClick={toggleComment}>Comment</a>
            <div className="comment-container">
                {comments && comments.map(function (comment) {
                    return (<div key={comment.id}>
                        <span className={"user-id"}>{comment.userId}</span>
                        <span className={"user-text"}>{comment.text}</span>
                        <Replies postId={postId} commentId={comment.id} replies={comment.replies} sendPost={sendPost}/>
                    </div>);
                })}
                {comment && <CreatePost postId={postId} type={Constants.COMMENT} sendPost={sendPost}/>}
            </div>
        </div>;
    }
}

export default Comments;
