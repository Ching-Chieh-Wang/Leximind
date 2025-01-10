const Block = ({children}) => {
  return (
    <div className="inline-flex items-center justify-center h-10 rounded-md border border-gray-400 bg-gray-100 px-1 sm:px-2 md:px-3 font-medium text-slate-90 lg:text-lg gap-x-2 hover:bg-gray-300">
        {children}
    </div>
  )
}

export default Block