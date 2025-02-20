'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Card from '@/components/Card';
import FormCancelButton from '@/components/buttons/FormCancelButton';
import FormOKButton from '@/components/buttons/FormOKButton';
import WarningIcon from '@/components/icons/WarningIcon';
import SuccessIcon from '@/components/icons/SuccessIcon';
import Horizontal_Layout from '@/components/Horizontal_Layout';
import Vertical_Layout from '@/components/Vertical_Layout';

const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [isShow, setIsShow] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [type, setType] = useState(null);
  const [handleOK, setHandleOk] = useState(null);
  const [handleCancel, setHandleCancel] = useState(null);

  const showDialog = ({title, description, type = 'warning', onOk = null, onCancel=null}) => {
    setIsShow(true);
    setHandleOk(() => onOk);
    setHandleCancel(()=>onCancel)
    setTitle(title);
    setType(type);
    setDescription(description);
  };

  const clearDialog = () => {
    setIsShow(false);
    setTitle(null);
    setType(null);
    setDescription(null);
    setHandleOk(null);
  };

  // Disable scrolling when the dialog is displayed
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
      {/* Parent container with relative positioning */}
      <div style={{ position: 'relative' }}>
        {/* Children components */}
        {children}

        {/* Render the dialog when isShow is true */}
        {isShow && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              minHeight: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(5px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if(handleCancel)handleCancel();
              else clearDialog();
            }}
          >
            <Card type="form" onClick={(e) => e.stopPropagation()}>
              {/* Dialog Header */}
              <Horizontal_Layout>
                <div
                  className="rounded-full border border-gray-300 flex items-center justify-center p-4"
                  style={{ color: type === 'warning' ? 'red' : 'green' }}
                >
                  {type === 'warning' ? (
                    <WarningIcon size={25} />
                  ) : (
                    <SuccessIcon size={25} />
                  )}
                </div>
                <Vertical_Layout spacing='space-y-0.5'>
                  <p className="font-bold text-lg text-gray-900">{title}</p>
                  <p className="text-sm text-gray-700 mt-2">{description}</p>
                </Vertical_Layout>
              </Horizontal_Layout>

              {/* Dialog Footer */}
              <Horizontal_Layout>
                {handleCancel && (
                  <FormCancelButton onClick={()=>{
                    handleCancel();
                    clearDialog();
                  }}>Cancel</FormCancelButton>
                )}
                {handleOK && <FormOKButton
                  onClick={() => {
                    handleOK();
                    clearDialog();
                  }}
                  color={type === 'warning' ? 'red' : 'green'}
                >
                  OK
                </FormOKButton>}
              </Horizontal_Layout>
            </Card>
          </div>
        )}
      </div>
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