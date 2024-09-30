import { createContext, useState } from "react"; // Importing createContext and useState from React
import runChat from "../config/Gemini"; // Importing the runChat function from Gemini configuration

export const Context = createContext(); // Creating a context to be used for state management

const ContextProvider = (props) => {
    // useState hooks to manage various states within the context
	const [input, setInput] = useState(""); // State for input value
	const [recentPrompt, setRecentPrompt] = useState(""); // State for the most recent prompt
	const [prevPrompts, setPrevPrompts] = useState([]); // State for storing previous prompts
	const [showResults, setShowResults] = useState(false); // State to control the visibility of results
	const [loading, setLoading] = useState(false); // State to indicate loading status
	const [resultData, setResultData] = useState(""); // State to store the result data

    // Function to delay the display of each character in the result
	const delayPara = (index, nextWord) => {
		setTimeout(function () {
			setResultData((prev) => prev + nextWord); // Append nextWord to the resultData state
		}, 10 * index); // Delay by 10 milliseconds multiplied by the index
	};

    // Function to start a new chat
    const newChat = () => {
        setLoading(false); // Reset loading state
        setShowResults(false); // Reset results visibility state
    }

    // Function to handle sending the prompt
	const onSent = async (prompt) => {
		setResultData(""); // Clear previous result data
		setLoading(true); // Set loading state to true
		setShowResults(true); // Show results container
        let response; // Variable to store the chat response
        if(prompt !== undefined){
            response = await runChat(prompt); // Run chat with provided prompt
            setRecentPrompt(prompt); // Set the recent prompt to the provided prompt
        } else {
            setPrevPrompts(prev => [...prev, input]); // Add input to previous prompts
            setRecentPrompt(input); // Set the recent prompt to the input value
            response = await runChat(input); // Run chat with input value
        }
		
		try {
			// Process the response and format it
			let responseArray = response.split("**"); // Split response by double asterisks for bold formatting
            let newResponse = "";
			for (let i = 0; i < responseArray.length; i++) {
				if (i === 0 || i % 2 !== 1) {
					newResponse += responseArray[i]; // Add non-bold parts
				} else {
					newResponse += "<b>" + responseArray[i] + "</b>"; // Add bold parts
				}
			}
			let newResponse2 = newResponse.split("*").join("<br/>"); // Replace single asterisks with line breaks
			let newResponseArray = newResponse2.split(""); // Split response into characters
			for (let i = 0; i < newResponseArray.length; i++) {
				const nextWord = newResponseArray[i];
				delayPara(i, nextWord + ""); // Display each character with delay
			}
		} catch (error) {
			console.error("Error while running chat:", error); // Log error
		} finally {
			setLoading(false); // Set loading state to false
			setInput(""); // Clear input field
		}
	};

    // Context value to be provided to consuming components
	const contextValue = {
		prevPrompts,
		setPrevPrompts,
		onSent,
		setRecentPrompt,
		recentPrompt,
		input,
		setInput,
		showResults,
		loading,
		resultData,
		newChat,
	};

    // Providing the context value to children components
	return (
		<Context.Provider value={contextValue}>{props.children}</Context.Provider>
	);
};

export default ContextProvider; // Exporting ContextProvider component as default
