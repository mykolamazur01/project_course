import axios from "axios";

const fetchSingleSubtype = async (instrumentSubtype) => {
    let instrument_subtype_temp = {};
    const instrument_subtype = await axios.get('http://localhost:5000/instrument_subtype/' + instrumentSubtype)
    .then((response) => {
        instrument_subtype_temp = response.data;
        return axios.get('http://localhost:5000/instrument_type/' + instrument_subtype_temp.instrument_type_id);
    }).then((responseType) => {
        return {
            ...instrument_subtype_temp,
            instrument_type_id: {
                name: responseType.data.name,
                instrument_type_id: responseType.data.instrument_type_id
            }
        }
    });
    return instrument_subtype;
}

export default fetchSingleSubtype;

