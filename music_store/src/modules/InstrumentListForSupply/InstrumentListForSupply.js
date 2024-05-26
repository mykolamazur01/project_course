import React, { useState, useEffect, Fragment } from 'react';
import InstrumentCard from '../../components/InstrumentCard/markup/InstrumentCard';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Checkbox, CssBaseline, Divider, Drawer, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Pagination, Select } from '@mui/material';
import axios from 'axios';
import InstrumentAddDialog from '../../components/InstrumentAddDialog/InstrumentAddDialog';
import CartDialog from '../../components/CartDialog/CartDialog';

const InstrumentListForSupply = () => {

    const [supplies, setSupplies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [supplyStatuses, setSupplyStatuses] = useState([]);
    const [instruments, setInstruments] = useState([]);
    const [supplyDetails, setSupplyDetails] = useState([]);
    const [shipmentInvoices, setShipmentInvoices] = useState([]);
    const [checkedSubtypes, setCheckedSubtypes] = useState([]);
    const [prefilteredInstruments, setPrefilteredInstruments] = useState([]);
    const [cart, setCart] = useState([])

    useEffect(() => {
        const fetchInstruments = async () => {
            try {
                axios.get('http://localhost:5000/music_instrument').then((response) => {
                    setInstruments(response.data.items);
                    setPrefilteredInstruments(response.data.items)
                    setTotalPages(Math.ceil(response.data.items.length / 10));
                }).catch((error) => {
                    console.error('Error fetching instrument data:', error);
                });                  
            } catch (error) {
                console.error('Error fetching instruments:', error);
            }
        };
        fetchInstruments();

        const fetchSubtypes = async () => {
            try {
                axios.get('http://localhost:5000/instrument_subtype').then((response) => {
                    setSubtypes(response.data.items);
                    setCheckedSubtypes(response.data.items.map(subtype => {
                        return {
                            instrument_subtype_id: subtype.instrument_subtype_id,
                            checked: false
                        }
                    }));
                }).catch((error) => {
                    console.error('Error fetching instrument data:', error);
                });                  
            } catch (error) {
                console.error('Error fetching instruments:', error);
            }
        };
        fetchSubtypes();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const reloadInstrumentList = async () => {
        try {
            axios.get('http://localhost:5000/music_instrument').then((response) => {
                setInstruments(response.data.items);
                setPrefilteredInstruments(response.data.items)
                setTotalPages(Math.ceil(response.data.items.length / 10));
            }).catch((error) => {
                console.error('Error fetching instrument data:', error);
            });                  
        } catch (error) {
            console.error('Error fetching instruments:', error);
        }
    }

    const onCloseAddInstrumentDialog = async() => {
        try {
            axios.get('http://localhost:5000/music_instrument').then((response) => {
                setInstruments(response.data.items);
                setTotalPages(Math.ceil(response.data.items.length / 10));
            }).catch((error) => {
                console.error('Error fetching instrument data:', error);
            });                  
        } catch (error) {
            console.error('Error fetching instruments:', error);
        }
    }

    const addToCartHandler = (instrument) => {
        setCart((prev) => {
            return [...prev, {
                instrument: instrument,
                amount: 1,
                store:{
                    store_id: instrument.allowedAmountInStores[0].store_id.store_id,
                    address: instrument.allowedAmountInStores[0].store_id.address
                },
                instrument_in_store_id: instrument.allowedAmountInStores[0].instrument_in_store_id
            }]
        })
    }

    return (
        <Fragment>
        
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                width: 200,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 200,
                    boxSizing: 'border-box',
                },
                }}
                variant="permanent"
                anchor="left"
            >
                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                <FormLabel component="legend">Subtypes</FormLabel>
                    <FormGroup>
                    {subtypes.map((subtype, index) => (
                        <FormControlLabel
                        control={
                            <Checkbox 
                                checked={checkedSubtypes[index].checked}
                                onChange={(event) => {
                                    setCheckedSubtypes((prev) => {
                                        let checkedSubtypesAcc = [...prev]
                                        checkedSubtypesAcc[index].checked = event.target.checked
                                        return checkedSubtypesAcc
                                    })
                                    setInstruments((prev) => {
                                        let instrumentsAcc = []
                                        checkedSubtypes.forEach((subtype) => {
                                            if(subtype.checked){
                                                instrumentsAcc = [...instrumentsAcc, ...prefilteredInstruments.filter(instrument => instrument.instrument_subtype_id === subtype.instrument_subtype_id)]
                                            }
                                        })
                                        const checkingForEmpty = checkedSubtypes.filter(subtype => subtype.checked === true)
                                        if(checkingForEmpty.length === 0){
                                            instrumentsAcc = prefilteredInstruments
                                        }
                                        return instrumentsAcc
                                    })
                                }} 
                                name={subtype.name}    
                            />
                        }
                        label={subtype.name}
                        />
                    ))}
                    </FormGroup>
                </FormControl>
                <Divider />
            </Drawer>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
            >
                <CartDialog order={cart}/>
                <InstrumentAddDialog handleClose={onCloseAddInstrumentDialog}/>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filteringBy}
                    onChange={(event) => {
                        setFilteringBy(event.target.value)
                        if(event.target.value === 'Ascending Price'){
                            setInstruments((prev) => {
                                return prev.sort((a, b) => a.price - b.price)
                            })
                        } else if(event.target.value === 'Descending Price'){
                            setInstruments((prev) => {
                                return prev.sort((a, b) => b.price - a.price)
                            })
                        }
                    }}
                >
                    {filters.map((filter) => (  
                        <MenuItem key={filter} value={filter}>{filter}</MenuItem>
                    ))}
                </Select>
                <Box sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                    {
                        instruments?.map(instrument => {
                            return (
                                <Grid item xs={3} key={instrument?.music_instrument_id}>
                                    <InstrumentCard addToCartHandler={addToCartHandler} reloadInstrumentList={reloadInstrumentList} instrumentProp={{...instrument}} />
                                </Grid>
                            )
                        })
                    }
                    </Grid>
                 </Box>
                 <Pagination
                             count={totalPages}
                             page={currentPage}
                             onChange={(event, page) => handlePageChange(page)}
                         />
            </Box>
        </Box>
        </Fragment>
    );
}

export default InstrumentListForSupply;