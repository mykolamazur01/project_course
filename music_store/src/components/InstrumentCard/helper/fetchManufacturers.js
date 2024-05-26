import axios from "axios";

const fetchManufacturers = async () => {
    try {
        const response = await axios.get('http://localhost:5000/manufacturer');
        const data = response.data.items;
        return data.map((manufacturer) => {
            return {
                name: manufacturer.name,
                manufacturer_id: manufacturer.manufacturer_id,
                country_id: manufacturer.country_id
            }
        });
    } catch (error) {
        console.error('Error fetching manufacturers:', error);
    }
};
export default fetchManufacturers;