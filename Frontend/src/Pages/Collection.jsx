import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../Components/Title";
import ProductItem from "../Components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [filterproducts, setFilterProducts] = useState([]);
  const [Category, setCategory] = useState([]);
  const [SubCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [filters, setFilters] = useState(false);

  const ToggleCategory = (e) => {
    if (Category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const ToggleSubCategory = (e) => {
    if (SubCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productCopy = products.slice();

    if (Category.length > 0) {
      productCopy = productCopy.filter((item) =>
        Category.includes(item.category)
      );
    }

    if (SubCategory.length > 0) {
      productCopy = productCopy.filter((item) =>
        SubCategory.includes(item.subcategory)
      );
    }

    if (showSearch && search) {
      productCopy = productCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sortType) {
      case "low-high":
        productCopy = productCopy.sort((a, b) => a.price - b.price);
        break;

      case "high-low":
        productCopy = productCopy.sort((a, b) => b.price - a.price);
        break;

      default:
        break;
    }

    setFilterProducts(productCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [Category, SubCategory, sortType, search, showSearch, products]);

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-200">
      <div className="min-w-60">
        <p
          onClick={() => setFilters(!filters)}
          className="my-2 flex items-center text-xl gap-2 cursor-pointer"
        >
          FILTERS{" "}
          <img
            className={`h-3 sm:hidden ${filters ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div
          className={`border border-gray-400 pl-5 py-3 mt-6 ${
            filters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input type="checkbox" value="Men" onChange={ToggleCategory} />
              Men
            </p>
            <p className="flex gap-2">
              <input type="checkbox" value="Women" onChange={ToggleCategory} />
              Women
            </p>
            <p className="flex gap-2">
              <input type="checkbox" value="Kids" onChange={ToggleCategory} />
              Kids
            </p>
          </div>
        </div>

        <div
          className={`border border-gray-400 pl-5 py-3 my-5 ${
            filters ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                value="Topwear"
                onChange={ToggleSubCategory}
              />
              Topwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value="Bottomwear"
                onChange={ToggleSubCategory}
              />
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                value="Winterwear"
                onChange={ToggleSubCategory}
              />
              Winterwear
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between mb-2 text-base sm:text-2xl">
          <Title text1="ALL" text2="COLLECTIONS" />

          <select
            className="border-2 border-gray-400 px-2 py-3 text-sm"
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {(filterproducts || []).map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
