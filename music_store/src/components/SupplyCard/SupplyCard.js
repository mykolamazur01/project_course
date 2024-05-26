import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default function SupplyCard({ supplyProp }) {
  const [supply, setSupply] = useState(supplyProp);
  const [instruments, setInstruments] = useState([]);
  const [supplyDetails, setSupplyDetails] = useState([]);
  const [shipmentInvoices, setShipmentInvoices] = useState([]);

  
  const expendedSuppkyHandle = async (event, expanded) => {
    const dataSD = await axios.get(`http://localhost:5000/supply_detail`);
      const supply_detailsData = await Promise.all(dataSD.data.items.filter(supply_detail => {
        return supplyProp.supply_detail_ids.includes(supply_detail.supply_detail_id)
      }).map(async (supply_detail) => {
          const shipment_invoice = await axios.get(`http://localhost:5000/shipment_invoice`);
          const shipment_invoiceData = shipment_invoice.data.items.filter(shipment_invoice => {
            return supply_detail.shipment_invoice_ids.includes(shipment_invoice.shipment_invoice_id)
          });
          return {
            ...supply_detail,
            shipment_invoice_ids: shipment_invoiceData
          }
        })
      
      );
      setSupply((prev) => {
        const supply_details = supply.supply_detail_ids.map((supply_detail_id) => {
          return supply_detailsData.find((supply_detail) => supply_detail.supply_detail_id === supply_detail_id)
        });
        const newSupply = {
          ...prev,
          supply_detail_ids: supply_details
        }
        return newSupply;
      })
  }

  // const onExpandedManufacturerHandler = async (event, expanded) => {
  //   if (expanded) {
  //     const data = await fetchSingleManufacturer(instrument.manufacturer_id)
  //     setManufacturer(data);
  //   }
  // }

  // const onExpandedSubtypeHandler = async(event, expanded) => {
  //   setOpenSubtype(expanded);
  //   if (expanded) {
  //     const subtype = await fetchSingleSubtype(instrument.instrument_subtype_id)
  //     setInstrumentSubtype(subtype);
  //   }
  // }

  // const onDeleteMusicInstrument = async (event) => {
  //   const res = await axios.delete(`http://localhost:5000/music_instrument/`) + instrument.music_instrument_id;
  //   reloadInstrumentList();
  // }

  // const onExpandedMaterialHandler = async (event, expanded) => {
  //   if (expanded) {
  //     const data = await fetchMaterialsOfSingleInstrument(instrument.material_ids)
  //     setMaterials([...data]);
      
  //   }
  // }
  // const onExpandedStoresHandler = async (event, expanded) => {
  //   if (expanded) {
      
  //   }
  // }

  // const onCloseInstrumentEditHandler = async() => {
  //   const data = await fetchSignleInstrument(instrument.music_instrument_id)
  //   const subtype = await fetchSingleSubtype(data.instrument_subtype_id)
  //   setInstrument(data);
  //   setInstrumentSubtype(subtype);
  // }

  // const onExpandedCharacteristicsHandler = async (event, expanded) => {
  //   if (expanded) {
  //     const data = await fetchCharacteristicsOfSingleInstrument(instrument.characteristic_ids)
  //     setCharacteristics([...data]);
  //   }
  // }

  // const orderInstrumentHandle = async () => {
  //   const instrumentToCart = {
  //     ...instrument,
  //     allowedAmountInStores: allowedAmountInStores,
  //   }
  //   addToCartHandler(instrumentToCart);
  // }

  // const onExpandedInstrument = async (event, expanded) => {
  //   await onExpandedSubtypeHandler(null, true);
  //   const allowedAmountTest = instruments_in_store.map((element) => {
  //     const allowedAmount = element.amount - instrumentInOrder.filter(order => order.instrument_in_store_id === element.instrument_in_store_id).reduce((acc, order) => acc + order.amount, 0);
  //     if(allowedAmount > 0) {
  //       return {
  //         amount: allowedAmount,
  //         store_id: element.store_id,
  //         instrument_in_store_id: element.instrument_in_store_id
  //       }
  //     }
  //   }).filter((element) => element !== undefined)
  //   setAllowedAmountInStores(allowedAmountTest)
  // }

  return (
    <Fragment>
      <Accordion onChange={expendedSuppkyHandle} key={supply.supply_id}>
        <AccordionSummary>
          <h2>{supply.supply_number}</h2>
        </AccordionSummary>
        <AccordionDetails>
            <Accordion onChange={onExpandedDistributorHandler}>
              <AccordionSummary>
                <h3>Distributor</h3>
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