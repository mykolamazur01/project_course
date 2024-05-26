import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, List, ListItem, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const CartDialog = ({ order }) => {
    const [open, setOpen] = useState(false);
    const [orderInCart, setOrderInCart] = useState([]);
    useEffect(() => {
        const fetchOrders = async () => {
            const dataOD = await axios.get(`http://localhost:5000/order_detail`);
            const orderMax = dataOD.data.items.map(order => {
                return order.order_detail_id
            }).reduce((a, b) => Math.max(a, b), 0)
            const order_details = order.map((order, index) => {
                return {
                    order_detail_id: orderMax + index + 1,
                    instrument: order.instrument,
                    amount: order.amount,
                    store: order.store
                }
            })
            setOrderInCart(order_details)
        }

        fetchOrders();
    }, [order])

    const handleOpen = () => {
        setOpen(true);
    }

    const onClose = () => {
        setOpen(false);
    }

    const onOrder = async () => {
        const orders = await axios.get(`http://localhost:5000/order`);
        const orderMax = orders.data.items.map(order => {
            return order.order_id
        }).reduce((a, b) => Math.max(a, b), 0)
        const orderRes = {
            order_id: orderMax + 1,
            customer_id: 1,
            order_date: new Date().toISOString().slice(0, 10),
            employee_id: 1,
        }
        const order_details = orderInCart.map((order,index) => {
            return {
                order_id: orderMax + index + 1,
                order_detail_id: order.order_detail_id,
                amount: order.amount,
                store_id: order.store.store_id,
                instrument_in_store_id: order.instrument_in_store_id
            }
        })
        setOpen(false);
    }

    return (
        <div>
        <Button onClick={handleOpen} color="primary">Cart</Button>
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">Cart</DialogTitle>
            <DialogContent>
            <List>
                {orderInCart?.map((orderItem) => (
                <ListItem key={orderItem?.instrument.music_instrument_id}>
                    <TextField 
                        id="outlined-basic" 
                        label="Instrument" 
                        variant="outlined" 
                        value={orderItem?.instrument.name} 
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField 
                        id="outlined-basic" 
                        label="Amount" 
                        variant="outlined" 
                        value={orderItem?.amount}
                        sx={{width: 80}}
                        onChange={(e) => {
                            setOrderInCart(orderInCart.map((order) => {
                                if (order.order_detail_id === orderItem.order_detail_id) {
                                    order.amount = e.target.value
                                    orderItem.amount = e.target.value
                                }
                                return order
                            }))
                        }}
                    />
                    <FormControl variant="outlined">
                        <InputLabel id="demo-simple-select-label">Store</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={orderItem.store.address}
                            label="Store"
                            onChange={(e) => {
                                setOrderInCart(orderInCart.map((order) => {
                                    if (order.order_detail_id === orderItem.order_detail_id) {
                                        order.store.store_id = e.target.value.store_id
                                        order.store.address = e.target.value.address
                                        order.instrument_in_store_id = orderItem.instrument.allowedAmountInStores.find(store => store.store_id.address === e.target.value.address).instrument_in_store_id
                                        orderItem.store.address = e.target.value
                                    }
                                    return order
                                }))
                            }}
                        >
                            {orderItem?.instrument.allowedAmountInStores.map((store) => (
                                <MenuItem key={store.store_id.store_id} value={store.store_id}>{store.store_id.address}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </ListItem>
                ))}
            </List>
            </DialogContent>
            <DialogActions>
            <Button onClick={onClose} color="primary">
                Close
            </Button>
            <Button onClick={onOrder} color="primary">
                Order
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
};

export default CartDialog;