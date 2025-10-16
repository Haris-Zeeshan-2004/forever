import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, Delivery_Fee, GetCartAmount } = useContext(ShopContext);

  const subTotal = GetCartAmount();
  const total = subTotal + Delivery_Fee;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-5 text-sm">
        <div className="flex flex-col gap-2 sm:flex-row justify-between">
          <p>SubTotal</p>
          <p>
            {currency} {subTotal}.00
          </p>
        </div>
        <hr className="text-gray-300 " />
        <div className="flex flex-col gap-2 sm:flex-row justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {Delivery_Fee}.00
          </p>
        </div>
        <hr className="text-gray-300 " />
        <div className="flex flex-col gap-2 sm:flex-row justify-between">
          <b>Total</b>
          <b>
            {currency} {total}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
