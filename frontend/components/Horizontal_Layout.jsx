const Horizontal_Layout = ({ children, justify = "center",items='center', spacing = "space-x-3 sm:space-x-6", extraStyle = '' }) => {
  const justifyClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }[justify] || 'justify-center'; 
  const itemsClass = {
    top:'items-top',
    center:'items-center',
    bottom:'items-bottom'
  }[items] || 'items-center'; 

  return (
    <div className={`flex  ${justifyClass} ${itemsClass} ${spacing} ${extraStyle} `}>
      {children}
    </div>
  );
};

export default Horizontal_Layout;