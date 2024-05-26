import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControl } from '@mui/material';
import axios from 'axios';

const MaterialsEditDialog = ({onClose}) => {
    
    const [open, setOpen] = useState(false);
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const materialRes = await axios.get('http://localhost:5000/material');
                setMaterials(materialRes.data.items);
            } catch (error) {
                console.error('Error fetching material data:', error);
            }
        }
        fetchMaterials();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleMaterialChange = (characteristic, name) => {
        setMaterials((prev) => {
            return prev.map((item) => {
                if (item.material_id === characteristic.material_id) {
                    return {...item, name: name};
                }
                return item;
            });
        
        });
    };

    const deleteMaterialsHandler = (name) => {
        setMaterials((prevMaterials) => {
            return prevMaterials.filter((element) => {
                return element.name !== name;
            })
        })
    }

    const handleSave = () => {
        setOpen(false);
        console.log(materials);
        //onClose();
    };

    const addMaterialHandler = () => {
        setMaterials((prevMaterials) => {
            return [...prevMaterials, {
                material_id: prevMaterials.sort((a, b) => b.material_id - a.material_id)[0].material_id + 1,
                name: ''
            }]
        });
    }

    return (
        <>
        <Button onClick={handleOpen}>Edit Materials</Button>
        <Dialog open={open}>
            <DialogTitle>Edit Materials</DialogTitle>
            <DialogContent>
                {materials.map((material) => {
                    return (
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <FormControl key={material.material_id} sx={{ m: 1, minWidth: 150, display: "flex", justifyContent: "center" }}>
                            
                            <TextField
                                label='Material'
                                value={material.name}
                                onChange={(e) => handleMaterialChange(material, e.target.value)}
                            />
                            <Button onClick={(event) => {deleteMaterialsHandler(material.name)}} color='error'>Delete material</Button>   
                        </FormControl>
                        </Box> 
                    )
                })}   
                <Button onClick={addMaterialHandler} color="primary">Add material</Button>    
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default MaterialsEditDialog;