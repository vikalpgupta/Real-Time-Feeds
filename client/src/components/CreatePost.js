import React, { Component } from 'react';
import { Constants } from "../constants/const";

class CreatePost extends Component {
    state = {
        text: "",
        disabled: true
    };

    handleChange = (event) => {
        let disabled = true;

        if (event.target.value.trim()) {
            disabled = false;
        }

        this.setState({
            text: event.target.value,
            disabled
        })
    };

    post = () => {
        const { sendPost, type, postId, commentId } = this.props;
        const { text } = this.state;

        sendPost({
            text,
            type,
            postId,
            commentId
        });

        this.setState({
            text: "",
            disabled: true
        })
    };

    getData = () => {
        const { type } = this.props;
        let placeholder, btnText;

        switch (type) {
            case Constants.COMMENT:
                placeholder = "Write your comment here";
                btnText = "Comment";
                break;
            case Constants.POST:
                placeholder = "Write your post here";
                btnText = "Post";
                break;
            case Constants.REPLY:
                placeholder = "Write your reply here";
                btnText = "Reply";
                break;
            default:
                btnText = "Post";
                placeholder = "Write your post here";
        }

        return {
            placeholder,
            btnText
        };
    };

    render() {
        const { text, disabled } = this.state;
        const { post, getData } = this;
        const { placeholder, btnText } = getData();

        return <div>
            <input placeholder={placeholder} value={text} onChange={this.handleChange}
                   type="text"/>
            <button disabled={disabled} onClick={post}>{btnText}</button>
        </div>
    }
}

export default CreatePost;