import { Button, TextField } from "@mui/material";
import { FC, useEffect, useState } from "react";

type Customer = {
  numItems: number;
  inLine: boolean;
};

type Cashier = {
  lane: number;
  line: Customer[];
};

const defaultLanes = [
  { lane: 0, line: [{ numItems: 4, inLine: true }, { numItems: 7, inLine: true }] },
  { lane: 1, line: [] },
  { lane: 2, line: [{ numItems: 6, inLine: true }] },
  { lane: 3, line: [] },
  { lane: 4, line: [{ numItems: 1, inLine: true }] },
];

const ShoppingQueue: FC = () => {
  const [itemsInCart, setItemsInCart] = useState(0);
  const [lanes, setLanes] = useState(defaultLanes);

  const checkout = () => {
    const newCustomer = {
      numItems: itemsInCart, 
      inLine: false,
    };
    const intialItemsValue = lanes[0].line.length ? lanes[0].line.reduce((acc, curr) => acc + curr.numItems, 0) : 0;
    const smallestLine = { lane: 0, totalItems: intialItemsValue };
    const tempLanes = lanes.slice();
    tempLanes.forEach((cashier, idx) => {
      console.log(idx, cashier.line);
      if (cashier.line.length < 1 && !newCustomer.inLine) {
        newCustomer.inLine = true;
        cashier.line.push(newCustomer);
      }
      let itemsInLine = 0;
      cashier.line.forEach((customer) => {
        itemsInLine += customer.numItems;
      });
      if (itemsInLine < smallestLine.totalItems) {
        smallestLine.lane = idx;
        smallestLine.totalItems = itemsInLine;
      }
    });
    if (!newCustomer.inLine) {
        newCustomer.inLine = true;
        tempLanes[smallestLine.lane].line.push(newCustomer);
    }
    setLanes(tempLanes);
  };

  return (
    <>
      <div className="user-input">
        <TextField
          placeholder="Number of items"
          value={itemsInCart || ""}
          style={{ width: "170px", padding: "20px" }}
          type={"number"}
          onChange={(e) => setItemsInCart(parseInt(e.currentTarget.value))}
        />
        <Button
          onClick={checkout}
          variant="contained"
          style={{ margin: "30px" }}
        >
          Checkout
        </Button>
      </div>
      <div style={{ height: "25%" }} />
      <div style={{ display: "flex" }}>
        {lanes.map((cashier, i) => {
          return (
            <div key={i}>
              <div className="cashier">{cashier.lane + 1}</div>
              {cashier.line.map((customer: Customer) => {
                return <div className="customer">{customer.numItems}</div>;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ShoppingQueue;
