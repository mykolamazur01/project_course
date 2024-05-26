import axios from "axios";

const fetchCharacteristicsOfSingleInstrument = async (characteristics) => {

    const characteristicsRes = await Promise.all(characteristics.map(async(characteristic) => {
        const characteristicRes = await axios.get('http://localhost:5000/characteristic/' + characteristic.characteristic_id)
            .then((response) => {
                return {
                    characteristic_id: response.data.characteristic_id,
                    name: response.data.name,
                    value: characteristic.value
                };
            })
            .catch((error) => {
                console.error('Error fetching characteristics data:', error);
            });
        
        return {
            characteristic_id: characteristicRes.characteristic_id,
            name: characteristicRes.name,
            value: characteristic.value
        };
    }));
    return characteristicsRes;
};

export default fetchCharacteristicsOfSingleInstrument;