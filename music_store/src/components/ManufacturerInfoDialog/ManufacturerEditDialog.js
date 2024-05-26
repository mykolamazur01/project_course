import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import axios from 'axios';
import fetchManufacturers from '../InstrumentCard/helper/fetchManufacturers';
import fetchSingleManufacturer from '../InstrumentCard/helper/fetchSingleManufacturer';

const ManufacturersEditDialog = ({onClose}) => {
    
    const [open, setOpen] = useState(false);
    const [manufacturers, setManufacturers] = useState([]);
    const [countries, setCountries] = useState([]);

    useEffect(() => {

        const fetchManufacturersRes = async () => {
            try {
                const manufacturers = await fetchManufacturers();
                const manufacturersRes = await Promise.all(manufacturers.map(async (manufacturer) => {
                    const fullManufacturer = await fetchSingleManufacturer(manufacturer.manufacturer_id);
                    return fullManufacturer;
                }));
                setManufacturers(manufacturersRes);
                const data = await axios.get('http://localhost:5000/country');
                setCountries(data.data.items);
            } catch (error) {
                console.error('Error fetching manufacturers:', error);
            }
        }
        fetchManufacturersRes();

    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleManufacturerChange = (manufacturer, name) => {
        setManufacturers((prev) => {
            return prev.map((item) => {
                if (item.manufacturer_id === manufacturer.manufacturer_id) {
                    return {...item, name: name};
                }
                return item;
            });
        
        });
    };

    const deleteManufacturerHandler = (name) => {
        setManufacturers((prevManufacturers) => {
            return prevManufacturers.filter((element) => {
                return element.name !== name;
            })
        })
    }

    const handleOpenCountry = async (event) => {
        
    }

    const handleSave = () => {
        setOpen(false);
        console.log(manufacturers);
        console.log(countries);
        //onClose();
    };

    const addManufacturerHandler = () => {
        setManufacturers((prevManufacturers) => {
            return [...prevManufacturers, {
                manufacturer_id: prevManufacturers.sort((a, b) => b.manufacturer_id - a.manufacturer_id)[0].manufacturer_id + 1,
                name: '',
                country_id: 0
            }]
        });
    }

    return (
        <>
        <Button onClick={handleOpen}>Edit Manufacturers</Button>
        <Dialog open={open}>
            <DialogTitle>Edit Manufacturer</DialogTitle>
            <DialogContent>
                {manufacturers.map((manufacturer) => {
                    return (
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <FormControl key={manufacturer.manufacturer_id} sx={{ m: 1, minWidth: 150, display: "flex", justifyContent: "center" }}>
                            
                            <TextField
                                label='Manufacturer'
                                value={manufacturer.name}
                                onChange={(e) => handleManufacturerChange(manufacturer, e.target.value)}
                            />
                            <Select
                                labelId="country-select-label"
                                id="country-select"
                                label="Countries"
                                value={manufacturer.country_id.name}
                                onChange={
                                    (event) => {
                                        setManufacturers((prev) => {
                                            return prev.map((item) => {
                                                if (item.name === manufacturer.name) {
                                                    return {...item, country_id: {name: event.target.value, ...item.country_id}};
                                                }
                                                return item;
                                        });
                                    })
                                }}
                                onOpen={handleOpenCountry}
                            >
                                {countries.map((country) => (
                                    
                                    <MenuItem key={country?.country_id} value={country?.name}>
                                        {country?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Button onClick={(event) => {deleteManufacturerHandler(manufacturer.name)}} color='error'>Delete manufacturer</Button>   
                        </FormControl>
                        </Box> 
                    )})} 
                <Button onClick={addManufacturerHandler} color="primary">Add manufacturer</Button>    
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default ManufacturersEditDialog;