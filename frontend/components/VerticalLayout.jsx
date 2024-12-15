const VerticalLayout = ({ children, extraStyle, spacing="space-y-5",  }) => {
  return (
    <div className={`flex flex-col justify-center ${spacing} ${extraStyle}`}>
      {children}
    </div>
  );
};

export default VerticalLayout;