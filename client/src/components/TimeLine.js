import React, { Component } from 'react';
import Comments from "./Comments";

class TimeLine extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: false
        };
    }

    render() {
        const { timeline, sendPost } = this.props;

        return timeline && timeline.length ? <div>
            {timeline.map(function (post) {
                return (<div className="post" key={post.id}>
                    <span className={"user-id"}>{post.userId}</span>
                    <span className={"user-text"}>{post.text}</span>
                    <Comments postId={post.id} comments={post.comments} sendPost={sendPost}></Comments>
                </div>);
            })}
        </div> : null;
    }
}

export default TimeLine;
