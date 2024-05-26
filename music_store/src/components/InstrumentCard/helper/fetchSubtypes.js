import axios from "axios";

const fetchSubtypes = async () => {
    try {
        const response = await axios.get('http://localhost:5000/instrument_subtype');
        const data = response.data.items;
        return data.map((subtype) => {
            return {
                name: subtype.name,
                instrument_subtype_id: subtype.instrument_subtype_id,
                instrument_type_id: subtype.instrument_type_id
            }
        });
    } catch (error) {
        console.error('Error fetching instrument subtypes:', error);
    }
};
export default fetchSubtypes;