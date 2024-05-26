import axios from "axios";

const fetchSignleInstrument = async (id) => {
    try {
        const response = await axios.get('http://localhost:5000/music_instrument/' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching instruments:', error);
    }
}

export default fetchSignleInstrument;