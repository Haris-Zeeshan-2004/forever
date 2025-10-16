import Title from "../Components/Title";
import { assets } from "../assets/assets";

const About = () => {
  const handler = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className="border-t border-gray-200 text-2xl text-center pt-8 ">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="flex flex-col md:flex-row my-12 gap-16">
        <img src={assets.about_img} className="w-full md:w-[450px] " alt="" />
        <div className="flex flex-col justify-center gap-6 text-gray-600 md:w-2/4">
          <p>
            Forever was born out of a passion for innovation and a desire to
            revolutionize the way people shop online. Our journey began with a
            simple idea: to provide a platform where customers can easily
            discover, explore, and purchase a wide range of products from the
            comfort of their homes.
          </p>
          <p>
            Since our inception, we've worked tirelessly to curate a diverse
            selection of high-quality products that cater to every taste and
            preference. From fashion and beauty to electronics and home
            essentials, we offer an extensive collection sourced from trusted
            brands and suppliers.
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Our mission at Forever is to empower customers with choice,
            convenience, and confidence. We're dedicated to providing a seamless
            shopping experience that exceeds expectations, from browsing and
            ordering to delivery and beyond.
          </p>
        </div>
      </div>
      <div className=" text-2xl font-medium text-left pt-8 ">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="mt-10">
        <div className="flex text-left justify-center">
          <div className="border border-gray-300 flex flex-col gap-5   py-20 px-16 text-sm">
            <b>Quality Assurance:</b>
            <p className="text-gray-600 ">
              We meticulously select and vet each product to ensure it meets our
              stringent quality standards.
            </p>
          </div>
          <div className="border border-gray-300 flex flex-col gap-5 py-20 px-16 text-sm">
            <b>Convenience:</b>
            <p className="text-gray-600 ">
              With our user-friendly interface and hassle-free ordering process,
              shopping has never been easier.
            </p>
          </div>
          <div className="border border-gray-300 flex flex-col gap-5 py-20 px-16 text-sm">
            <b>Exceptional Customer Service:</b>
            <p className="text-gray-600 ">
              Our team of dedicated professionals is here to assist you the way,
              ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>
      <div className="text-center my-20 ">
        <p className="text-2xl font-medium text-gray-900">
          Subscribe now & get 20% off
        </p>
        <p className="text-gray-400 mt-1 text-center">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
        <form
          onClick={handler}
          className="w-full sm:w-1/2 my-6 flex items-center gap-4 pl-3 mx-auto border"
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full sm:flex-1 outline-none"
          />

          <button
            type="submit"
            className="bg-black text-white text-xs cursor-pointer px-10 py-4"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </div>
  );
};

export default About;
