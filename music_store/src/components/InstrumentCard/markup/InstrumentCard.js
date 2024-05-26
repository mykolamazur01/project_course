import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import axios from 'axios';
import Characteristic from "../../../ui/Characteristic";
import styles from './InstrumentCard.module.css';
import { Fragment, useEffect, useState } from 'react';
import { Button, Chip, Stack } from '@mui/material';
import InstrumentEditDialog from '../../InstrumentInfoDialog/InstrumentEditDialog';

import fetchSingleSubtype from '../helper/fetchSingleSubtype';
import fetchSignleInstrument from '../helper/fetchSingleInstrument';
import fetchMaterialsOfSingleInstrument from '../helper/fetchMaterialsOfSingleInstrument';
import fetchSingleManufacturer from '../helper/fetchSingleManufacturer';
import fetchCharacteristicsOfSingleInstrument from '../helper/fetchCharacteriscticsOfSignleInstrument';
import fetchStoresOfSingleInstrument from '../helper/fetchStoresOfSingleInstrument';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default function InstrumentCard({ addToCartHandler, instrumentProp, reloadInstrumentList }) {
  const [manufacturer, setManufacturer] = useState({});
  const [instrumentSubtype, setInstrumentSubtype] = useState({});
  const [instrument, setInstrument] = useState(instrumentProp);
  const [materials, setMaterials] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [instruments_in_store, setInstrumentsInStore] = useState([]);
  const [instrumentInOrder, setInstrumentInOrder] = useState([]);
  const [allowedAmountInStores, setAllowedAmountInStores] = useState([]);
  const [openSybtype, setOpenSubtype] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const dataOD = await axios.get(`http://localhost:5000/order_detail`);
      const orders = dataOD.data.items.filter(order => instrumentProp.instrument_in_store_ids.includes(order.instrument_in_store_id));
      setInstrumentInOrder(orders)
      const dataIIS = await fetchStoresOfSingleInstrument(instrument.instrument_in_store_ids)
      setInstrumentsInStore([...dataIIS]);
    }
    fetchOrders();
  }, [])


  const onExpandedManufacturerHandler = async (event, expanded) => {
    if (expanded) {
      const data = await fetchSingleManufacturer(instrument.manufacturer_id)
      setManufacturer(data);
    }
  }

  const onExpandedSubtypeHandler = async(event, expanded) => {
    setOpenSubtype(expanded);
    if (expanded) {
      const subtype = await fetchSingleSubtype(instrument.instrument_subtype_id)
      setInstrumentSubtype(subtype);
    }
  }

  const onDeleteMusicInstrument = async (event) => {
    const res = await axios.delete(`http://localhost:5000/music_instrument/`) + instrument.music_instrument_id;
    reloadInstrumentList();
  }

  const onExpandedMaterialHandler = async (event, expanded) => {
    if (expanded) {
      const data = await fetchMaterialsOfSingleInstrument(instrument.material_ids)
      setMaterials([...data]);
      
    }
  }
  const onExpandedStoresHandler = async (event, expanded) => {
    if (expanded) {
      
    }
  }

  const onCloseInstrumentEditHandler = async() => {
    const data = await fetchSignleInstrument(instrument.music_instrument_id)
    const subtype = await fetchSingleSubtype(data.instrument_subtype_id)
    setInstrument(data);
    setInstrumentSubtype(subtype);
  }

  const onExpandedCharacteristicsHandler = async (event, expanded) => {
    if (expanded) {
      const data = await fetchCharacteristicsOfSingleInstrument(instrument.characteristic_ids)
      setCharacteristics([...data]);
    }
  }

  const orderInstrumentHandle = async () => {
    const instrumentToCart = {
      ...instrument,
      allowedAmountInStores: allowedAmountInStores,
    }
    addToCartHandler(instrumentToCart);
  }

  const onExpandedInstrument = async (event, expanded) => {
    await onExpandedSubtypeHandler(null, true);
    const allowedAmountTest = instruments_in_store.map((element) => {
      const allowedAmount = element.amount - instrumentInOrder.filter(order => order.instrument_in_store_id === element.instrument_in_store_id).reduce((acc, order) => acc + order.amount, 0);
      if(allowedAmount > 0) {
        return {
          amount: allowedAmount,
          store_id: element.store_id,
          instrument_in_store_id: element.instrument_in_store_id
        }
      }
    }).filter((element) => element !== undefined)
    setAllowedAmountInStores(allowedAmountTest)
  }

  return (
    <Fragment>
      <Accordion onChange={onExpandedInstrument} className={styles.instrumentCard}>
        <AccordionSummary>
          <h2>{instrument?.name}</h2>
        </AccordionSummary>
        <AccordionDetails>
            <Accordion expanded={openSybtype} onChange={onExpandedSubtypeHandler}>
              <AccordionSummary>
                <h3>Subtype</h3>
              </AccordionSummary>
              <AccordionDetails>
                <Characteristic name={'Name'} value={instrumentSubtype?.name} />
                <Characteristic name={'Type'} value={instrumentSubtype?.instrument_type_id?.name} />
              </AccordionDetails>
            </Accordion>
            <Characteristic name={'Height'} value={instrument?.height} />
            <Characteristic name={'Width'} value={instrument?.width} />
            <Characteristic name={'Weight'} value={instrument?.weight} />
            <Characteristic name={'Length'} value={instrument?.length} />
            <Accordion onChange={onExpandedManufacturerHandler}>
              <AccordionSummary>
                <h3>Manufacturer</h3>
              </AccordionSummary>
              <AccordionDetails>
                <Characteristic name={'Name'} value={manufacturer?.name} />
                <Characteristic name={'Country'} value={manufacturer?.country_id?.name} />
              </AccordionDetails>
            </Accordion>
            <Accordion onChange={onExpandedMaterialHandler}>
              <AccordionSummary>  
                <h3>Materials</h3>
              </AccordionSummary>
              <AccordionDetails>
                  {materials.map((element) => {
                      return <Chip key={element?.material_id} label={element?.name} />
                    })   
                  }
              </AccordionDetails>
            </Accordion>
            <Accordion onChange={onExpandedCharacteristicsHandler}>
              <AccordionSummary>  
                <h3>Characteristics</h3>
              </AccordionSummary>
              <AccordionDetails>
                  {characteristics.map((element) => {
                      return <Characteristic name={element.name} value={element.value}/>
                    })   
                  }
              </AccordionDetails>
            </Accordion>
            <Accordion onChange={onExpandedStoresHandler}>
              <AccordionSummary>  
                <h3>Available at</h3>
              </AccordionSummary>
              <AccordionDetails>
                  {allowedAmountInStores.map((element) => {
                      if(element !== undefined) { 
                        return <Chip key={element?.store_id?.address} label={element?.store_id?.address} />
                      }
                    })   
                  }
              </AccordionDetails>
            </Accordion>
            <Characteristic name={'Price'} value={instrument?.price} />
            <InstrumentEditDialog instrumentProp={instrument} onCloseHandlerProp={onCloseInstrumentEditHandler}/>
            <Button onClick={onDeleteMusicInstrument} variant="contained" color="error">Delete</Button>
            <Button 
              disabled={allowedAmountInStores.length <= 0} 
              onClick={orderInstrumentHandle} 
              variant="contained" 
              color="primary"
            >Buy</Button>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
}