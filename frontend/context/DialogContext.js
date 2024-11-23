'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Card from '@/components/Card';
import FormCancelButton from '@/components/buttons/FormCancelButton';
import FormOKButton from '@/components/buttons/FormOKButton';
import WarningIcon from '@/components/icons/WarningIcon';
import SuccessIcon from '@/components/icons/SuccessIcon';
const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [isShow, setIsShow] = useState(false);
  const [title, setTitle] = useState(null)
  const [description, setDescription] = useState(null)
  const [type, setType] = useState(null);
  const [handleOK, setHandleOk] = useState(null);

  const showDialog = (title, description, type = 'warning', onConfirm = null,) => {
    setIsShow(true)
    setHandleOk(() => onConfirm);
    setTitle(title);
    setType(type);
    setDescription(description)
  };

  const clearDialog = () => {
    setIsShow(false);
    setTitle(null);
    setType(null)
    setDescription(null);
    setHandleOk(null);
  };

  // Side effect: Disable scrolling when the warning is displayed
  useEffect(() => {
    if (isShow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isShow]);


  return (
    <DialogContext.Provider value={{ showDialog }}>
      {isShow && (

        <div
          className="fixed flex h-screen inset-0 z-50 justify-center items-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)',
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent click events from propagating to the dialog
            clearDialog(); // Clear the warning when the background is clicked
          }}
        >
          <Card type="form" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between space-x-4">
              {/* Left Side: Logo */}
              <div
                className="rounded-full border border-gray-300 flex items-center justify-center p-4"
                style={{ color: type === 'warning' ? 'red' : 'green' }} // Dynamically apply the color here
              >
                {
                  {
                    warning: <WarningIcon size={25} />,
                    success: <SuccessIcon size={25} />,
                  }[type] || null
                }
              </div>
              <div className="text-left">
                <p className="font-bold text-lg text-gray-900">{title}</p>
                <p className="text-sm text-gray-700 mt-2">{description}</p>
              </div>
            </div>


            <div className="flex  space-x-4">
              {handleOK && <FormCancelButton onClick={clearDialog}>Cancel</FormCancelButton>}
              <FormOKButton
                onClick={() => {
                  if (handleOK) handleOK();
                  clearDialog();
                }}
                color={{
                  warning: 'red',
                  success: 'green',
                }[type] || 'gray'} // Default to 'gray' if the type is unrecognized
              >
                OK
              </FormOKButton>

            </div>
          </Card>
        </div>


      )}
      {children}
    </DialogContext.Provider>
  );
};

// Custom hook for using the context
export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};