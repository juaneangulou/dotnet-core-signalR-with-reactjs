import React, { Component } from 'react'
import * as SignalR from '@aspnet/signalr';


export default class MyChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            message: '',
            hubConnection: null,
            messages: []

        }
    }
    componentDidMount = () => {
        const username = window.prompt('Your name:', 'John');
        const hubConnection = new SignalR.HubConnectionBuilder().withUrl("https://localhost:44378/chatHub")
            .configureLogging(SignalR.LogLevel.Information)
            .build();
        this.setState({ hubConnection, username }, () => {
            this.state.hubConnection
                .start()
                .then(() => console.log('Connection started!'))
                .catch(err => console.log('Error while establishing connection :('));
            this.state.hubConnection.on("ReceiveMessage", function (user, message) {
                var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                var encodedMsg = user + " says " + msg;
                var li = document.createElement("li");
                li.textContent = encodedMsg;
                document.getElementById("messagesList").appendChild(li);
            });


        })
    }

sendMessage(){
   
    this.state
    .hubConnection.invoke("SendMessage", this.state.username, this.state.message).catch(function (err) {
        return console.error(err.toString());
    });
}
    render() {


        return (
            <div>
                <label>Message</label> <br/>
                <input type="text" id="messageInput" onChange={(e)=>{
                    console.log(e.target.value);
                    this.setState({message: e.target.value})
                }} />
                 <br/>
                <button onClick={()=>{
                    this.sendMessage();
                }}>Send Message</button>
                 <br/>
                Mis mensajes
                <ul id="messagesList">

                </ul>
            </div>
        )
    }
}
