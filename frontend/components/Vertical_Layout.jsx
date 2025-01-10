const Vertical_Layout = ({ children, extraStyle, spacing="space-y-5",  }) => {
  return (
    <div className={`flex flex-col justify-center ${spacing} ${extraStyle}`}>
      {children}
    </div>
  );
};

export default Vertical_Layout;