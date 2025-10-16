import Title from "../Components/Title";

const Contact = () => {
  const handler = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="border-t border-gray-200 text-2xl text-center pt-10">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="flex flex-col md:flex-row justify-center my-12 gap-10 mb-28">
        
        <iframe
          title="Our Store Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.163521088656!2d74.33457157430247!3d31.49218884853616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919043fb52276b5%3A0x2682e1fa63fcd065!2sEVS%20Training%20Institute%20Lahore!5e0!3m2!1sen!2s!4v1759842639165!5m2!1sen!2s"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full md:w-[480px]"
        ></iframe>

        <div className="flex flex-col justify-center gap-6 text-gray-600 items-start">
          <b className="text-gray-600 font-semibold text-xl">Our Store</b>
          <p className="text-gray-500">
            547 Ferozepur road
            <br /> Lahore, Pakistan
          </p>
          <div className="text-gray-500 flex flex-col">
            <p>Tel: (042) 555-01324455</p>
            <p>Email: admin@forever.com</p>
          </div>
          <b className="text-gray-600 font-semibold text-xl">
            Careers at Forever
          </b>

          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 cursor-pointer hover:bg-black hover:text-white transition-all duration-300">
            Explore Jobs
          </button>
        </div>
      </div>

      <div className="text-center my-20">
        <p className="text-2xl font-medium text-gray-900">
          Subscribe now & get 20% off
        </p>
        <p className="text-gray-400 mt-1 text-center">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
        <form
          onSubmit={handler} 
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

export default Contact;
