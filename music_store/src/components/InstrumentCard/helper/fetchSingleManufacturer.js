import axios from "axios";

const fetchSingleManufacturer = async (manufacturer) => {
    let manufacturer_temp = {};
    const manufacturerRes = await axios.get('http://localhost:5000/manufacturer/' + manufacturer)
    .then((response) => {
        manufacturer_temp = response.data;
        return axios.get('http://localhost:5000/country/' + manufacturer_temp.country_id);
    }).then((responseCountry) => {
        return {
            ...manufacturer_temp,
            country_id: {
                name: responseCountry.data.name,
                country_id: responseCountry.data.country_id
            }
        }
    });
    return manufacturerRes;
}

export default fetchSingleManufacturer;

