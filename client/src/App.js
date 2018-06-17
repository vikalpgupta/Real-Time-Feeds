import React, { Component } from 'react';
import './App.css';
import CreatePost from "./components/CreatePost";
import TimeLine from "./components/TimeLine";
import io from "socket.io-client";
import { Constants } from "./constants/const";
import { URLConstants } from "./constants/urlConst";

const socket = io();

class App extends Component {
    state = {
        userId: window.sessionStorage.getItem("userId"),
        timeline: []
    };

    componentDidMount() {
        const { createUser, getTimeLineData } = this;
        const { userId } = this.state;
        const self = this;

        if (!userId) {
            createUser();
        }

        getTimeLineData();

        socket.on(Constants.RECEIVE_POST, function (body) {
            self.updateTimeLine(body);
        });
    }

    updateTimeLine = (body) => {
        const { postId, commentId, data } = body;
        let { timeline } = this.state;

        if (postId) {
            if (commentId) {
                timeline && timeline.some(function (post, index) {
                    if (post.id === postId) {
                        timeline[index].comments && timeline[index].comments.some(function (comment) {
                            if (comment.id === commentId) {
                                if (!comment.replies) {
                                    comment.replies = [];
                                }
                                comment.replies.push(data);
                                return true;
                            }
                        });
                        return true;
                    }
                });
            } else {
                timeline && timeline.some(function (post) {
                    if (post.id === postId) {
                        if (!post.comments) {
                            post.comments = [];
                        }

                        post.comments.push(data);
                        return true;
                    }
                });
            }
        } else {
            timeline.unshift(data);
        }
        
        this.setState({});
    };

    createUser = async () => {
        const response = await fetch(URLConstants.CREATE_USER);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        window.sessionStorage && window.sessionStorage.setItem("userId", body.userId);
        this.setState({ userId: body.userId });
    };

    getTimeLineData = async () => {
        const response = await fetch(URLConstants.GET_TIMELINE);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        this.setState({ timeline: body.data });
    };

    getSendPostURL(type) {
        let url;

        switch (type) {
            case Constants.COMMENT:
                url = URLConstants.SEND_COMMENT;
                break;
            case Constants.POST:
                url = URLConstants.SEND_POST;
                break;
            case Constants.REPLY:
                url = URLConstants.SEND_REPLY;
                break;
        }

        return url;
    }

    sendPost = async (data) => {
        const { getSendPostURL } = this;
        const { userId } = this.state;
        const { type, text, postId, commentId } = data;

        const response = await fetch(getSendPostURL(type), {
            method: "post",
            body: JSON.stringify({ text, postId, commentId, userId }),
            headers: {
                "content-type": "application/json"
            }
        });

        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        socket.emit(Constants.SEND_POST, body);
    };

    render() {
        const { userId, timeline } = this.state;
        const { sendPost } = this;

        return (
            <div className="App">
                <header className="App-header">
                    <p>{"Logged in as User: " + userId}</p>
                </header>
                <CreatePost sendPost={sendPost} type={Constants.POST}></CreatePost>
                <TimeLine timeline={timeline} sendPost={sendPost}></TimeLine>
            </div>
        );
    }
}

export default App;
