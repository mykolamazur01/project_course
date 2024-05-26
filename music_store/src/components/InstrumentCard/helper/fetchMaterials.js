import axios from "axios";

const fetchMaterials = async () => {

    const materialsRes = await axios.get('http://localhost:5000/material/')
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.error('Error fetching material data:', error);
        });
    return materialsRes;
};
export default fetchMaterials;