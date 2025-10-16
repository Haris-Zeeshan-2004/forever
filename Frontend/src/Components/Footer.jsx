import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="my-5 mt-40 text-sm">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14">
        <div>
          <img className="w-32 mb-5" src={assets.logo} alt="" />
          <p className="text-gray-600 w-full md:w-2/3">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat
            neque vel animi eos, nam, sit tempore quos sequi numquam architecto
            atque omnis, quam reiciendis adipisci facilis maxime totam modi
            commodi!
          </p>
        </div>

        <div>
          <p className="text-2xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-2xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>+92-300-0000000</li>
            <li>Harisdev@gmail.com</li>
            <li className="cursor-pointer">Instagram</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center">
        <hr className="text-gray-300" />
        <p className="mt-6 text-sm">
           Copyright © 2025 @ Haris Zeeshan - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
