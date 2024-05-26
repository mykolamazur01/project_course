import axios from "axios";

const fetchCharacterisctics = async () => {

    const characteristicsRes = await axios.get('http://localhost:5000/characteristic/')
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error('Error fetching characteristic data:', error);
        });
    return characteristicsRes;
};
export default fetchCharacterisctics;