import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom'
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageInputFlat,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import {v4 as uuidv4} from 'uuid';
import "./globals.css";
const apiKey = '';
var channel = null;

const chatClient = StreamChat.getInstance(apiKey);
var userID = uuidv4();
const url = 'https://c644278dc85a.ngrok.io/';
var o = [];
var start = 0;

function LChat() {
    const [state, setState] = useState({
        loading: true
      });
    useEffect(async ()=>{
        await chatClient.setGuestUser( 
            { 
                id: userID, 
                name: 'Guest', 
                image: 'https://getstream.io/random_svg/?name=Guest', 
            }
        );
        userID = 'guest-' + userID
        fetch(url+'/create', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            body: JSON.stringify({ user: userID }) // body data type must match "Content-Type" header
        })
        .then(() => {
            setState({...state, loading: false})
            channel = chatClient.channel("messaging", userID)
        }
        )
    }, [])
    return (
        <>
        {state.loading == true ? <div style= {{display:"flex", "alignItems": "center", "justifyContent": "center", "minHeight": "75vh", "minWidth": "100%"}}><div className="lds-ring" /> </div>
            : 
            <div className="str-chat" style={{ height: 'unset' }}>
            <Chat client={chatClient}>
                <Channel channel={chatClient.channel("messaging", userID)}>
                    <div className="str-chat__main-panel" style={{ height: '75vh' }}>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput Input={MessageInputFlat} focus />
                    </div>
                <Thread />
                </Channel>
            </Chat>
            </div>
        }
        </>
    );
  }

function Suggestion(props) {
    const [state, setState] = useState({
        channel: true,
        loading: true
      });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function channelwait() {
        if (start == 1) {
            while(o.length == 0){
                await sleep(200);
            }
            setState({...state, loading:false})
            channel.on("message.new", async (event) => { 
                let ocopy = o
                if (event.user.id != "gpt-3-user-id") {
                    setState({...state, loading: true});
                    while (ocopy == o) {
                        await sleep(200);
                    }
                    setState({...state, loading:false})
                }
            });
            return
        }
        else start = 1;
        while (channel == null){
            await sleep(200);
        }
        console.log("Channel detected")
        setState({...state, channel: false})
        channel.watch()
        channel.on("message.new", (event) => { 
            // handle new message event
            if (event.user.id != "gpt-3-user-id") {
                setState({...state, loading: true});
                fetch(url+'/suggest', {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    body: JSON.stringify({ user: userID }) // body data type must match "Content-Type" header
                })
                .then((resp) => resp.json())
                .then(function(response) {
                    o = [response['o1'], response['o2'], response['o3']]
                    setState({...state, loading:false})
                })
            }

        }); 
    }
    async function handlesuggestion(e) {
        e.preventDefault();
        var val = document.getElementById("suggestion" + props.number).value
        console.log(val)
        await channel.send_message({text:val})
    }
    useEffect(()=>{ channelwait(); }, [])
    return (
        <>
        {state.loading == true ? <svg
                role="img"
                width="300"
                height="157"
                aria-labelledby="loading-aria"
                viewBox="0 0 300 157"
                preserveAspectRatio="none"
                >
                <title id="loading-aria">Loading...</title>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    clipPath="url(#clip-path)"
                    style={{"fill": 'url("#fill")'}}
                ></rect>
                <defs>
                    <clipPath id="clip-path">
                        <rect x="0" y="0" rx="3" ry="3" width="67" height="11" /> 
                        <rect x="76" y="0" rx="3" ry="3" width="300" height="11" /> 
                        <rect x="127" y="48" rx="3" ry="3" width="53" height="11" /> 
                        <rect x="187" y="48" rx="3" ry="3" width="72" height="11" /> 
                        <rect x="18" y="48" rx="3" ry="3" width="100" height="11" /> 
                        <rect x="0" y="70" rx="3" ry="3" width="240" height="11" /> 
                        <rect x="18" y="23" rx="3" ry="3" width="140" height="11" /> 
                        <rect x="166" y="23" rx="3" ry="3" width="200" height="11" /> 
                        <rect x="299" y="76" rx="0" ry="0" width="0" height="1" /> 
                        <rect x="250" y="70" rx="3" ry="3" width="110" height="11" /> 
                        <rect x="1" y="91" rx="3" ry="3" width="131" height="11" /> 
                        <rect x="75" y="111" rx="3" ry="3" width="191" height="11" /> 
                        <rect x="244" y="91" rx="3" ry="3" width="113" height="11" /> 
                        <rect x="41" y="131" rx="3" ry="3" width="158" height="11" /> 
                        <rect x="3" y="131" rx="3" ry="3" width="29" height="11" />
                    </clipPath>
                    <linearGradient id="fill">
                    <stop
                        offset="0.599964"
                        stopColor="#f3f3f3"
                        stopOpacity="1"
                    >
                        <animate
                        attributeName="offset"
                        values="-2; -2; 1"
                        keyTimes="0; 0.25; 1"
                        dur="2s"
                        repeatCount="indefinite"
                        ></animate>
                    </stop>
                    <stop
                        offset="1.59996"
                        stopColor="#ecebeb"
                        stopOpacity="1"
                    >
                        <animate
                        attributeName="offset"
                        values="-1; -1; 2"
                        keyTimes="0; 0.25; 1"
                        dur="2s"
                        repeatCount="indefinite"
                        ></animate>
                    </stop>
                    <stop
                        offset="2.59996"
                        stopColor="#f3f3f3"
                        stopOpacity="1"
                    >
                        <animate
                        attributeName="offset"
                        values="0; 0; 3"
                        keyTimes="0; 0.25; 1"
                        dur="2s"
                        repeatCount="indefinite"
                        ></animate>
                    </stop>
                    </linearGradient>
                </defs>
                </svg>
            :
            <div id= {"suggest"+props.number} className = "div-suggest" onClick={async (e) => {await handlesuggestion(e);}} style={{"display":"flex"}}>
                <h3 className="large-number" id={"suggestion"+ props.number}>{o[props.number-1]}</h3>
            </div>
        }
        </>
    );
}

ReactDOM.render(
    <LChat/>,
    document.getElementById('react-target')
);
ReactDOM.render(
    <Suggestion number="1"/>,
    document.getElementById('o1')
);
ReactDOM.render(
    <Suggestion number="2"/>,
    document.getElementById('o2')
);
ReactDOM.render(
    <Suggestion number="3"/>,
    document.getElementById('o3')
);