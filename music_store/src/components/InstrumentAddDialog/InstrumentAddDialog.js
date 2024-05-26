import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, InputLabel, FormControl, Box, MenuItem } from '@mui/material';
import axios from 'axios';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import fetchCharacterisctics from '../InstrumentCard/helper/fetchCharacterisctics';
import CharacteristicsEditDialog from '../CharacteristicEditDialog/CharacteristicsEditDialog';

function InstrumentAddDialog({ handleClose }) {
    const [open, setOpen] = useState(false);
    const [instrument, setInstrument] = useState({});
    const [characteristics, setCharacteristics] = useState([]);
    const [characteristicsOfSingleInstrument, setCharacteristicsOfSingleInstrument] = useState([]);
    const [characteristicsForSelect, setCharacteristicsForSelect] = useState([]);

    useEffect(() => {
        if(open){
            const fetchAllCharacterisctics = async () => {
                const data = await fetchCharacterisctics();
                setCharacteristics(data.items);
            }
            fetchAllCharacterisctics();
        }
    }, [open]);

    const addCharacteristicHandler = () => {
        setCharacteristicsOfSingleInstrument((prevCharacteristics) => {
            return [...prevCharacteristics, {
                characteristic_id: null,
                name: '',
                value: ''
            }]
        });
    }

    const handleCharacteristicsClose = () => { 
        const fetchAllCharacterisctics = async () => {
            const data = await fetchCharacterisctics();
            setCharacteristics(data.items);
        }
        fetchAllCharacterisctics();
    }

    const deleteCharacteristicHandler = (name) => {
        setCharacteristicsOfSingleInstrument((prevCharacteristics) => {
            return prevCharacteristics.filter((element) => {
                return element.name !== name;
            })
        })
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleInstrumentNameChange = (event) => {
        setInstrument((prev) => {
            return {
                ...prev,
                name: event.target.value
            };
        });
    };

    const handleAddInstrument = () => {
        // const newInstrument = axios.post('http://localhost:3001/music_instrument', {
        //     //needs finishing
        //     name: instrument.name,
        //     weight: instrument.weight,
        //     width: instrument.width,
        //     height: instrument.height,
        //     manufacturer_id: instrument.manufacturer_id,
        //     instrument_subtype_id: instrument.subtype_id,
        //     number_in_store: instrument.numberInStore,
        //     instrument_in_store_ids: instrument.instruments_in_store,
        //     characteristic_ids: instrument.characteristics,
        //     material_ids: instrument.materials,
        // });
        console.log(instrument);
        console.log(characteristicsOfSingleInstrument);
        setOpen(false);
        //handleClose();
    };

    const handleWeightChange = (event) => {
        setInstrument((prev) => {
            return {
                ...prev,
                weight: event.target.value
            };
        });
    };

    const handleWidthChange = (event) => {
        setInstrument((prev) => {
            return {
                ...prev,
                width: event.target.value
            };
        });
    };

    const handleHeightChange = (event) => {
        setInstrument((prev) => {
            return {
                ...prev,
                height: event.target.value
            };
        });
    };

    const handleManufacturerChange = async (event) => {
        const manufacturers = await axios.get('http://localhost:3001/manufacturer');
        const manufacturer_id = manufacturers.find((manufacturer) => manufacturer.name === event.target.value).manufacturer_id;
        setInstrument((prev) => {
            return {
                ...prev,
                manufacturer_id: manufacturer_id
            };
        });
    };

    const handleSubtypeChange = (event) => {
        const subtypes = axios.get('http://localhost:3001/instrument_subtype');
        const subtype_id = subtypes.find((subtype) => subtype.name === event.target.value).instrument_subtype_id;
        setInstrument((prev) => {
            return {
                ...prev,
                subtype_id: subtype_id
            };
        });
    };

    const handleNumberInStoreChange = (event) => {
        setInstrument((prev) => {
            return {
                ...prev,
                numberInStore: event.target.value
            };
        });
    };

    return (
        <div>
            <Button variant="contained" sx={{ borderRadius: '100%', height: '60px', width: '25px' }} color="primary" onClick={handleOpen}>
                <AddCircleOutlineIcon color='white'/>
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Instrument</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Instrument Name"
                        value={instrument.name}
                        onChange={handleInstrumentNameChange}
                        fullWidth
                    />
                    <TextField
                        label="Weight"
                        value={instrument.weight}
                        onChange={handleWeightChange}
                        fullWidth
                    />
                    <TextField
                        label="Width"
                        value={instrument.width}
                        onChange={handleWidthChange}
                        fullWidth
                    />
                    <TextField
                        label="Height"
                        value={instrument.height}
                        onChange={handleHeightChange}
                        fullWidth
                    />
                    <TextField
                        label="Manufacturer"
                        value={instrument.manufacturer}
                        onChange={handleManufacturerChange}
                        fullWidth
                    />
                    <TextField
                        label="Subtype"
                        value={instrument.subtype}
                        onChange={handleSubtypeChange}
                        fullWidth
                    />
                    <TextField
                        label="Number in Store"
                        value={instrument.numberInStore}
                        onChange={handleNumberInStoreChange}
                        fullWidth
                    />
                    {characteristicsOfSingleInstrument.map((characteristic) => {
                    return (
                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <FormControl key={characteristic.characteristic_id} sx={{ m: 1, minWidth: 150, display: "flex", justifyContent: "center" }}>
                            <InputLabel id="characteristic-select-label">Characteristic</InputLabel>
                            <Select id="characteristic-select" 
                                    labelId="characteristic-select-label"
                                    label="Characteristics"
                                    value={characteristic?.name}
                                    onOpen={(event) => {
                                        setCharacteristicsForSelect([...characteristics.filter((element) => {
                                            return !characteristicsOfSingleInstrument.map((elem) => elem.name).includes(element.name);
                                        }), characteristic]);
                                    }}
                                    onChange={(event) => {
                                        setCharacteristicsOfSingleInstrument((prevCharacteristics) => {
                                            return prevCharacteristics.map((element) => {
                                                if(element.characteristic_id === characteristic.characteristic_id){
                                                    return {
                                                        characteristic_id: characteristics.find((characteristic_inner) => characteristic_inner.name === event.target.value).characteristic_id,
                                                        name: event.target.value,
                                                        value: characteristic.value
                                                    }
                                                }
                                                return element;
                                            })
                                        })
                                    }}
                            >
                                {characteristicsForSelect.map((characteristic) => {
                                    return (
                                        <MenuItem key={characteristic?.characteristic_id} value={characteristic?.name}>
                                            {characteristic?.name}
                                        </MenuItem>
                                    )
                                })}
                            </Select>
                            <TextField
                                value={characteristic?.value}
                                fullWidth
                                onChange={(event) => {
                                    setCharacteristicsOfSingleInstrument((prevCharacteristics) => {
                                        return prevCharacteristics.map((element) => {
                                            if(element.characteristic_id === characteristic.characteristic_id){
                                                return {
                                                    characteristic_id: characteristic.characteristic_id,
                                                    name: characteristic.name,
                                                    value: event.target.value
                                                }
                                            }
                                            return element;
                                        })
                                    })
                                }}
                            />
                            <Button onClick={(event) => {deleteCharacteristicHandler(characteristic.name)}} color='error'>Delete characteristic</Button>   
                        </FormControl>
                        </Box> 
                    )})}
                    <Button onClick={addCharacteristicHandler} color="primary">Add characteristic</Button>  
                    <CharacteristicsEditDialog onClose={handleCharacteristicsClose}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddInstrument} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default InstrumentAddDialog;