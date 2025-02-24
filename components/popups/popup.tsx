import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import 'reactjs-popup/dist/index.css';

interface CustomModalPopupNodeProps {
    isOpen: boolean; // boolean value that determines if the popup is open or not
    onClose: () => void; // function that closes the popup
    id : string; // id of the node
}

interface Paragraph {
    paraId: string;
    paraText: string;
}

export default function PopUp({isOpen, onClose, id}: CustomModalPopupNodeProps) {
    
    const [paras, setPara] = useState<Paragraph[]>([]); // state variable to hold the paragraphs data
    // console.log(id);
    


    // fetch the data from the API endpoint
    useEffect(() => {
        fetch(`http://localhost:3000/api/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }) // fetch the data from the API endpoint
        .then(response => { // handle if the response is not ok
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response;
        })
        .then((res) => res.json()) // convert the response to JSON
        .then((data) => setPara(data)) // set the data to the state variable
        .catch((error) => console.log("Error fetching data from the API: ", error)); // log any errors
    }, []); 
    

    const paragraphs = paras.map((para) => {
        return (
            <div key={para.paraId}>
                <p>{para.paraText}</p>
            </div>
        );
    }

    )
    return (
        
            <Popup  position="right center"
                 modal
                 open={isOpen}
                 onClose={onClose}
            >
                <h1>Popup content here !!</h1>
                {paragraphs}
    
            </Popup>

    )
}