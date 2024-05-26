import axios from "axios";

const fetchMaterialsOfSingleInstrument = async (materials) => {

    const materialsRes = await Promise.all(materials.map(async(material) => {
        const materialRes = await axios.get('http://localhost:5000/material/' + material)
            .then((response) => {
                return {
                    material_id: response.data.material_id,
                    name: response.data.name
                };
            })
            .catch((error) => {
                console.error('Error fetching material data:', error);
            });
        
        return {
            material_id: materialRes.material_id,
            name: materialRes.name
        };
    }));
    return materialsRes;
};
export default fetchMaterialsOfSingleInstrument;