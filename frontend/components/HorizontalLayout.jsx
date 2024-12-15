const HorizontalLayout = ({ children, extraStyle, spaceing="space-x-3 sm:space-x-6"}) => {
  return (
    <div className={`flex flex-row justify-center align-middle items-center ${spaceing} ${extraStyle||''}`}>
      {children}
    </div>
  );
};


export default HorizontalLayout;