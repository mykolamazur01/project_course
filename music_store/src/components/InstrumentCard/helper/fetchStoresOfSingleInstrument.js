import axios from "axios";

const fetchStoresOfSingleInstrument = async (instrument_in_store_ids) => {

    const instrument_in_storeRes = await Promise.all(instrument_in_store_ids.map(async(instrument_in_store) => {
        let instrument_in_store_temp = {};
        const instrument_in_storeRes = await axios.get('http://localhost:5000/instrument_in_store/' + instrument_in_store)
            .then((response) => {
                instrument_in_store_temp = response.data
                return axios.get('http://localhost:5000/music_store/' + instrument_in_store_temp.store_id);
            }).then((responseStore) => {
                return {
                    instrument_in_store_id: instrument_in_store_temp.instrument_in_store_id,
                    music_instrument_id: instrument_in_store_temp.music_instrument_id,
                    amount: instrument_in_store_temp.amount,
                    store_id: {
                        store_id: responseStore.data.store_id,
                        address: responseStore.data.address,
                        city_id: responseStore.data.city_id,
                    }
                }
            })
            .catch((error) => {
                console.error('Error fetching material data:', error);
            });
        return {
            instrument_in_store_id: instrument_in_storeRes.instrument_in_store_id,
            music_instrument_id: instrument_in_storeRes.music_instrument_id,
            amount: instrument_in_storeRes.amount,
            store_id: {
                store_id: instrument_in_storeRes.store_id.store_id,
                address: instrument_in_storeRes.store_id.address,
                city_id: instrument_in_storeRes.store_id.city_id,
            }
        }
    }));

    return instrument_in_storeRes;
};
export default fetchStoresOfSingleInstrument;