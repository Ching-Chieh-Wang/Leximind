const HorizontalLayout = ({ children, justify = "center", spacing = "space-x-3 sm:space-x-6", extraStyle = '' }) => {
  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }[justify] || 'justify-center'; // Default to 'justify-center'

  return (
    <div className={`flex flex-row ${justifyClass} align-middle items-center ${spacing} ${extraStyle}`}>
      {children}
    </div>
  );
};

export default HorizontalLayout;