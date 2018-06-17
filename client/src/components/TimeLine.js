import React from 'react';
import Comments from "./Comments";

const TimeLine = (props) => {
    const { timeline, sendPost } = props;

    return timeline && timeline.length ? <div>
        {timeline.map(function (post) {
            return (<div className="post" key={post.id}>
                <span className={"user-id"}>{post.userId}</span>
                <span className={"user-text"}>{post.text}</span>
                <Comments postId={post.id} comments={post.comments} sendPost={sendPost}/>
            </div>);
        })}
    </div> : null;
};

export default TimeLine;
