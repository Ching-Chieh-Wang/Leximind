import { getGlobalDialog } from '@/services/DialogService';

export const ErrorHandle = async (message, isRefreshOnOk=true) => {
  const refershPage = () => { isRefreshOnOk? window.location.reload():()=>{} };
  try {
    // Await the global showDialog so it's ready
    const showDialog = await getGlobalDialog();
    showDialog({
      title: "Error",
      description: message? message: 'Unexpected error, please try again later!',
      onOk: refershPage,
    });
  } catch (err) {
    console.error("Error in ErrorHandle:", err);
  }
};