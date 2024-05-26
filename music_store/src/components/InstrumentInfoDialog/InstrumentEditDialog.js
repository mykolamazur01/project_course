import React, { Fragment, useEffect, useState } from 'react';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import axios from 'axios';
import fetchSingleSubtype from '../InstrumentCard/helper/fetchSingleSubtype';
import fetchSubtypes from '../InstrumentCard/helper/fetchSubtypes';
import fetchMaterials from '../InstrumentCard/helper/fetchMaterials';
import fetchMaterialsOfSingleInstrument from '../InstrumentCard/helper/fetchMaterialsOfSingleInstrument';
import fetchSingleManufacturer from '../InstrumentCard/helper/fetchSingleManufacturer';
import fetchManufacturers from '../InstrumentCard/helper/fetchManufacturers';
import fetchCharacterisctics from '../InstrumentCard/helper/fetchCharacterisctics';
import fetchCharacteristicsOfSingleInstrument from '../InstrumentCard/helper/fetchCharacteriscticsOfSignleInstrument';
import CharacteristicsEditDialog from '../CharacteristicEditDialog/CharacteristicsEditDialog';
import MaterialsEditDialog from '../MaterialsEditDialog/MaterialsEditDialog';
import ManufaturersEditDialog from '../ManufacturerInfoDialog/ManufacturerEditDialog';
import SubtypeEditDialog from '../SubtypeEditDialog/SubtypeEditDialog';

const InstrumentEditDialog = ({ instrumentProp, onCloseHandlerProp }) => {

    const [open, setOpen] = React.useState(false);
    const [instrument, setInstrument] = useState(instrumentProp);
    const [instrumentSubtype, setInstrumentSubtype] = useState({});
    const [instrumentSubtypes, setInstrumentSubtypes] = useState([]);
    const [materialsNamesOfSingleInstrument, setMaterialsNamesOfSingleInstrument] = useState([]);
    const [materialsOfSingleInstrument, setMaterialsOfSingleInstrument] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [manufacturer, setManufacturer] = useState({});
    const [manufacturers, setManufacturers] = useState([]);
    const [characteristics, setCharacteristics] = useState([]);
    const [characteristicsOfSingleInstrument, setCharacteristicsOfSingleInstrument] = useState([]);
    const [characteristicsForSelect, setCharacteristicsForSelect] = useState([]);


    useEffect(() => {
        if(open){    
            const fetchSubtype = async () => {
                if(instrumentProp?.instrument_subtype_id){
                    const response = await fetchSingleSubtype(instrumentProp.instrument_subtype_id)
                    setInstrumentSubtype(response);
                }
            }
            fetchSubtype();
        }
    }, [open]);

    useEffect(() => {
        if(open){
            const fetchMaterials = async () => {
                if(instrumentProp?.material_ids){
                    const data = await fetchMaterialsOfSingleInstrument(instrumentProp.material_ids)
                    setMaterialsOfSingleInstrument(data);
                    setMaterialsNamesOfSingleInstrument(data.map((element) => element.name));
                }
            }
            fetchMaterials();
        }
    }, [open]);

    useEffect(() => {
        if(open){
            const fetchCharacteristics = async () => {
                if(instrumentProp?.characteristic_ids){
                    const data = await fetchCharacteristicsOfSingleInstrument(instrumentProp.characteristic_ids)
                    setCharacteristicsOfSingleInstrument(data);
                    data.map((characteristic) => {setCharacteristicsForSelect([...characteristics.filter((element) => {
                        return !data.map((elem) => elem.name).includes(element.name);
                    }), characteristic])});
                }
                
            }
            fetchCharacteristics();
            const fetchAllCharacterisctics = async () => {
                const data = await fetchCharacterisctics();
                setCharacteristics(data.items);
            }
            fetchAllCharacterisctics();
            
            
        }
    }, [open]);

    useEffect(() => {
        if(open){
            const fetchManufacturer = async () => {
                if(instrumentProp?.manufacturer_id){
                    const response = await fetchSingleManufacturer(instrumentProp.manufacturer_id)
                    setManufacturer(response);
                }
            }
            fetchManufacturer();
        }
    }, [open]);

    const onOpenMaterialHandler = async (event) => {
        const data = await fetchMaterials();
        setMaterials([...data.items]);
    }
    const onOpenCharacteristicHandler = async (characteristic) => {
        
    }

    const handleSave = async() => {
        // const updateInstrument = await axios.put('http://localhost:5000/music_instrument/' + instrument.music_instrument_id, {
        //     name: instrument.name,
        //     instrument_subtype_id:  instrumentSubtype.instrument_subtype_id,
        //     price: instrument.price,
        //     height: instrument.height,
        //     length: instrument.length,
        //     width: instrument.width,
        //     weight: instrument.weight,
        //     material_ids: materialsOfSingleInstrument.map((element) => {
        //         return element.material_id
        //     }),
        //     characteristic_ids: characteristicsOfSingleInstrument.map((element) => {
        //         return {
        //             characteristic_id: element.characteristic_id,
        //             value: element.value
        //         }
        //     }),
        //     manufacturer_id: manufacturer.manufacturer_id,
        //     instrument_in_store_ids: instrument.instrument_in_store_ids,
        //     number_in_store: instrument.number_in_store,

        // });
        const updateInstrument = {
            name: instrument.name,
            instrument_subtype_id:  instrumentSubtype.instrument_subtype_id,
            price: instrument.price,
            height: instrument.height,
            length: instrument.length,
            width: instrument.width,
            weight: instrument.weight,
            material_ids: materialsOfSingleInstrument.map((element) => {
                return element.material_id
            }),
            characteristic_ids: characteristicsOfSingleInstrument.map((element) => {
                return {
                    characteristic_id: element.characteristic_id,
                    value: element.value
                }
            }),
            manufacturer_id: manufacturer.manufacturer_id,
            instrument_in_store_ids: instrument.instrument_in_store_ids,
            number_in_store: instrument.number_in_store,

        };
        console.log(updateInstrument)
        onCloseHandlerProp();
        setOpen(false);
    };
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        
    };
    const onDeleteMaterialHandler = (material) => {
        setMaterialsOfSingleInstrument((prevMaterials) => {
            return prevMaterials.filter((element) => {
                return element.name !== material;
            })    
        });
        setMaterialsNamesOfSingleInstrument((prevMaterials) => {
            return prevMaterials.filter((element) => {
                return element !== material;
            })    
        });
    }

    const addCharacteristicHandler = () => {
        setCharacteristicsOfSingleInstrument((prevCharacteristics) => {
            return [...prevCharacteristics, {
                characteristic_id: null,
                name: '',
                value: ''
            }]
        });
    }

    const deleteCharacteristicHandler = (name) => {
        setCharacteristicsOfSingleInstrument((prevCharacteristics) => {
            return prevCharacteristics.filter((element) => {
                return element.name !== name;
            })
        })
    }
    const onChangeMaterailSelectHandler = (event) => {
        const {
          target: { value },
        } = event;
        setMaterialsNamesOfSingleInstrument(
          typeof value === 'string' ? value.split(',') : value,
        );
        setMaterialsOfSingleInstrument(
            materials.filter((element) => {
                return value.includes(element.name);
            })
        );
      };

    const handleOpenSubtype = async () => {
        const data = await fetchSubtypes();
        setInstrumentSubtypes(data);
    }
    const handleOpenManufacturer = async () => {
        const data = await fetchManufacturers();
        setManufacturers(data);
    }

    return (
        <>
        <Button variant="outlined" onClick={handleClickOpen}>
            Edit
        </Button>
        <Dialog open={open} onClose={handleClose}>
            
            <DialogTitle>Edit Music Instrument</DialogTitle>
            <DialogContent>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <TextField
                        label="Name"
                        value={instrument?.name}
                        fullWidth
                        onChange={(event) => setInstrument((prevInstrument) => {
                            return {
                                ...prevInstrument,
                                name: event.target.value
                            }
                        })}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <TextField
                        label="Price"
                        value={instrument?.price}
                        fullWidth
                        onChange={(event) => setInstrument((prevInstrument) => {
                            return {
                                ...prevInstrument,
                                price: event.target.value
                            }
                        })}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <TextField
                        label="Height"
                        value={instrument?.height}
                        fullWidth
                        onChange={(event) => setInstrument((prevInstrument) => {
                            return {
                                ...prevInstrument,
                                height: event.target.value
                            }
                        })}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <TextField
                        label="Length"
                        value={instrument?.length}
                        fullWidth
                        onChange={(event) => setInstrument((prevInstrument) => {
                            return {
                                ...prevInstrument,
                                length: event.target.value
                            }
                        })}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <TextField
                        label="Width"
                        labelId="width-label"
                        value={instrument?.width}
                        fullWidth
                        onChange={(event) => setInstrument((prevInstrument) => {
                            return {
                                ...prevInstrument,
                                width: event.target.value
                            }
                        })}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="instrument_subtype-select-label">Subtype</InputLabel>
                    <Select
                        labelId="instrument_subtype-select-label"
                        id="instrument_subtype-select"
                        label="Subtypes"
                        value={instrumentSubtype.name}
                        onChange={
                            (event) => {
                                setInstrumentSubtype(instrumentSubtypes.find((subtype) => subtype.name === event.target.value));
                            }
                        }
                        onOpen={handleOpenSubtype}
                    >
                        {instrumentSubtypes.map((subtype) => (
                            
                            <MenuItem key={subtype?.instrument_subtype_id} value={subtype?.name}>
                                {subtype?.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <SubtypeEditDialog />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="manufacturer-select-label">Manufacturer</InputLabel>
                    <Select
                        labelId="manufacturer-select-label"
                        id="manufacturer-select"
                        label="Manufacturers"
                        value={manufacturer?.name}
                        onChange={
                            (event) => {
                                setManufacturer(manufacturers.find((manufacturer) => manufacturer.name === event.target.value));
                            }
                        }
                        onOpen={handleOpenManufacturer}
                    >
                        {manufacturers.map((manufacturer) => (
                            
                            <MenuItem key={manufacturer?.manufacturer_id} value={manufacturer?.name}>
                                {manufacturer?.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <ManufaturersEditDialog />
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="materials-chip-label">Materials</InputLabel>
                    <Select
                    labelId="materials-chip-label"
                    id="materials-chip"
                    multiple
                    value={materialsNamesOfSingleInstrument}
                    onOpen={onOpenMaterialHandler}
                    onChange={onChangeMaterailSelectHandler}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((element) => {
                                return <Chip key={element} label={element} onDelete={(event) => onDeleteMaterialHandler(element)} />
                            })}
                        </Box>
                    )}
                    >
                    {materials?.map((material) => (
                        <MenuItem
                        key={material?.name}
                        value={material?.name}
                        >
                            {material?.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <MaterialsEditDialog />
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
                    )
                })}   
                <Button onClick={addCharacteristicHandler} color="primary">Add characteristic</Button>  
                <CharacteristicsEditDialog />      
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default InstrumentEditDialog;