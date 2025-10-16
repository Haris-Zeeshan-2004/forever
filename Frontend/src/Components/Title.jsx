const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <p className="text-gray-500">
        {text1} <span className="text-gray-700 font-medium">{text2}</span>
      </p>
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] text-center bg-gray-700"></p>
    </div>
  );
};

export default Title;
