import {createContext,useState} from "react";

const Place = createContext();

const PlaceContext = ({children}) => {
    const [selectedCity,setSelectedCity] = useState("Bangalore");
    const [locationId,setLocationId] = useState("ce505be1-7fbe-4a37-9dcc-540bcb3c745b");
    return (
        <Place.Provider value={{selectedCity,setSelectedCity,locationId,setLocationId}}>
            {children}
        </Place.Provider>
    )
}

export {Place,PlaceContext}