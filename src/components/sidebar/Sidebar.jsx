import "./sidebar.css"; // Importing the CSS file for styling the Sidebar component
import { assets } from "../../assets/assets"; // Importing assets like icons from a specific path
import { useContext, useState } from "react"; // Importing hooks from React
import { Context } from "../../context/Context"; // Importing the Context for state management

const Sidebar = () => {
    // useState hook to manage the extended state of the sidebar
	const [extended, setExtended] = useState(false);
    // useContext hook to get functions and values from Context
	const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

    // Function to load a previous prompt
	const loadPreviousPrompt = async (prompt) => {
		setRecentPrompt(prompt); // Set the current prompt in context
		await onSent(prompt); // Send the prompt using the onSent function
	};

	return (
		<div className="sidebar"> 
			<div className="top">
				<img
					src={assets.menu_icon}
					className="menu"
					alt="menu-icon"
					onClick={() => {
						setExtended((prev) => !prev); // Toggle the extended state of the sidebar
					}}
				/>
				<div className="new-chat">
					<img src={assets.plus_icon} alt="" onClick={() => {
                        newChat(); // Start a new chat
                    }} />
					{extended ? <p>New Chat</p> : null} {/* Show "New Chat" text if extended */}
				</div>
				{extended ? (
					<div className="recent">
						<p className="recent-title">Recent</p>
						{prevPrompts.map((item, index) => {
							return (
								<div onClick={() => {
                                    loadPreviousPrompt(item); // Load the previous prompt on click
                                }} className="recent-entry" key={index}>
									<img src={assets.message_icon} alt="" />
									<p>{item.slice(0, 18)}...</p> {/* Show truncated prompt */}
								</div>
							);
						})}
					</div>
				) : null} {/* Show recent prompts if extended */}
			</div>
			<div className="bottom">
				<div className="bottom-item recent-entry">
					<img src={assets.question_icon} alt="" />
					{extended ? <p>Help</p> : null} {/* Show "Help" text if extended */}
				</div>
				<div className="bottom-item recent-entry">
					<img src={assets.history_icon} alt="" />
					{extended ? <p>Activity</p> : null} {/* Show "Activity" text if extended */}
				</div>
				<div className="bottom-item recent-entry">
					<img src={assets.setting_icon} alt="" />
					{extended ? <p>Settings</p> : null} {/* Show "Settings" text if extended */}
				</div>
			</div>
		</div>
	);
};

export default Sidebar; // Exporting the Sidebar component as default
