import { assets } from "../assets/assets";

const OurPolices = () => {
  return (
    <div className="flex flex-col sm:flex-row text-xs sm:text-sm md:text-base text-gray-800  justify-around gap-12 sm:gap-2 py-20">
      <div>
        <img className="w-12 m-auto mb-4" src={assets.exchange_icon} alt="" />
        <p className="font-semibold text-center">Easy Exchange Policy</p>
        <p className="text-gray-400 text-center">
          We offer hassle free exchange policy
        </p>
      </div>
      <div>
        <img className="w-12 m-auto mb-4" src={assets.quality_icon} alt="" />
        <p className="font-semibold text-center">7 Days Return Policy</p>
        <p className="text-gray-400 text-center">
          We provide 7 days free return policy
        </p>
      </div>
      <div>
        <img className="w-12 m-auto mb-4" src={assets.support_img} alt="" />
        <p className="font-semibold text-center">Best customer support</p>
        <p className="text-gray-400 text-center">
          we provide 24/7 customer support
        </p>
      </div>
    </div>
  );
};

export default OurPolices;
