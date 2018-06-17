import React, { Component } from 'react';
import { Constants } from "../constants/const";
import CreatePost from "./CreatePost";

class Replies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reply: false
        }
    }

    toggleReply = () => {
        const { reply } = this.state;

        this.setState({
            reply: !reply
        })
    };

    render() {
        const { sendPost, postId, replies, commentId } = this.props;
        const { reply } = this.state;
        const { toggleReply } = this;

        return <div>
            <a className="reply" onClick={toggleReply}>Reply</a>
            <div className="reply-container">
                {replies && replies.map(function (reply) {
                    return (<div key={reply.id}>
                        <span className={"user-id"}>{reply.userId}</span>
                        <span className={"user-text"}>{reply.text}</span>
                    </div>);
                })}
                {reply &&
                <CreatePost postId={postId} commentId={commentId} type={Constants.REPLY}
                            sendPost={sendPost}/>}
            </div>
        </div>
    }
}

export default Replies;
