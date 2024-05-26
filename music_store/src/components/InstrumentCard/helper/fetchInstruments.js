import axios from "axios";

const fetchInstruments = async () => {
    try {
        const data = await axios.get('http://localhost:5000/music_instrument')
            .then((response) => { 
                return response.data; 
            })
            .catch((error) => {
                console.error('Error fetching instrument data:', error);
            });
        
        return data;
    } catch (error) {
        console.error('Error fetching instruments:', error);
    }
};

export default fetchInstruments;