import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../Components/RelatedProducts";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [image, setImage] = useState("");
  const [productData, setProductData] = useState(null);
  const [size, setsize] = useState("");

  useEffect(() => {
    if (products && productId) {
      const foundProduct = products.find(
        (item) => String(item._id) === String(productId)
      );

      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.image[0]);
        // console.log(foundProduct);
      }
    }
  }, [productId, products]);

  if (!productData) {
    return <div>Loading product...</div>;
  }

  const handleAddToCart = () => {
    if (productData.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }
    if (!size) {
      toast.error("Please select a size");
      return;
    }
    addToCart(productData._id, size);
  };

  return productData ? (
    <div className="border-t-2 border-gray-200 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((img, index) => (
              <img
                src={img}
                key={index}
                onClick={() => setImage(img)}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img src={image} alt={productData.name} className="w-full" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 h-3" />
            <img src={assets.star_icon} alt="" className="w-3 h-3" />
            <img src={assets.star_icon} alt="" className="w-3 h-3" />
            <img src={assets.star_icon} alt="" className="w-3 h-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3 h-3" />
            <p className="pl-2">(122)</p>
          </div>

          <p className="text-3xl mt-5 font-medium">
            {currency}
            {productData.price}{" "}
          </p>
          <p className="mt-5 text-gray-500 md:w-/5">
            {" "}
            {productData.description}{" "}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setsize(item)}
                  className={`py-2 px-4 bg-gray-100 border border-gray-300 cursor-pointer ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={productData.stock === 0}
            className={`text-sm px-8 py-3 rounded transition transform hover:scale-105 hover:shadow-md duration-300 ${
              productData.stock === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {productData.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
          </button>
          <hr className="mt-8 text-gray-400  sm:w-4/5" />
          <div className="flex flex-col mt-5 text-gray-500 text-sm gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex">
          <b className="border border-gray-300  py-3 px-5 text-sm">
            Discription
          </b>
          <p className="border border-gray-300 py-3 px-5 text-sm">
            Reviews (122)
          </p>
        </div>
        <div className="border border-gray-300 text-sm text-gray-500 flex flex-col gap-4 py-6 px-6">
          <p>
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p>
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p>
        </div>
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
