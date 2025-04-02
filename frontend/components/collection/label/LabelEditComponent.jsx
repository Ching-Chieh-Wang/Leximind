import { useState } from "react";
import FormCancelButton from "@/components/buttons/FormCancelButton";
import FormSubmitButton from "@/components/buttons/FormSubmitButton";
import Horizontal_Layout from "@/components/Horizontal_Layout";
import ErrorMsg from "@/components/msg/ErrorMsg";
import Vertical_Layout from "@/components/Vertical_Layout";

import { useCollection } from '@/context/collection/CollectionContext';
import createLabeRequest from '@/api/label/CreateLabel';
import { PrivateCollectionStatus } from "@/context/collection/types/status/PrivateCollectionStatus";
import { updateLabelRequest } from "@/api/label/UpdateLabel";
import { ErrorHandle } from "@/utils/ErrorHandle";

const LabelEditComponent = () => {
  const { labels, editingLabelIdx, id, status, createLabel, updateLabel, startCreateLabelSession, startUpdateLabelSession, cancelEditSession,createLabelSubmit, updateLabelSubmit } = useCollection();
  const [name, setName] = useState(status == PrivateCollectionStatus.UPDATING_LABEL ? labels[editingLabelIdx].name : '');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleUpsert = async (e) => {
    e.preventDefault();
    if (status === PrivateCollectionStatus.CREATING_LABEL) {
      createLabelSubmit();
      const [label, error] = await createLabeRequest(id, {name});
      if (error) {
        if (error.invalidArguments) {
          const errors = {};
          error.invalidArguments.forEach((argument) => {
            if (!errors[argument.path]) {
              errors[argument.path] = argument.msg; // Store only the first error for each field
            }
          });
          setFieldErrors(errors);
        }
        startCreateLabelSession(editingLabelIdx)
      }
      else {
        createLabel(label)
      }
    }
    else if (status === PrivateCollectionStatus.UPDATING_LABEL) {
      if(name===labels[editingLabelIdx].name)return cancelEditSession();
      updateLabelSubmit();
      const [label, error] = await updateLabelRequest(id, labels[editingLabelIdx].id, { name });
      if (error) {
        if (error.invalidArguments) {
          const errors = {};
          error.invalidArguments.forEach((argument) => {
            if (!errors[argument.path]) {
              errors[argument.path] = argument.msg; // Store only the first error for each field
            }
          });
          setFieldErrors(errors);
        }
        else{
          ErrorHandle("Failed to update label, please try again later!");
        }
        startUpdateLabelSession(editingLabelIdx);
      }
      else {
        updateLabel(label)
      }
    }
    else return console.error("No status supported now for:", status)
  };

  const handleNameChange = (e) => {
    const input = e.target.value;
    if (input.length > 50) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name cannot exceed 50 characters',
      }));
    } else {
      setFieldErrors((prevErrors) => {
        const { name, ...rest } = prevErrors;
        return rest;
      });
      setName(input);
    }
  }

  return (
    <td colSpan={3} className="align-middle px-2 xl:px6 py-4 bg-gray-100">
      <form onSubmit={handleUpsert}>
        <Vertical_Layout>
          <Vertical_Layout spacing="space-y-0.5">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder={labels[editingLabelIdx]?.name}
              className="border border-gray-300 rounded px-2 py-1 "
              required
              autoFocus='on'
            />
          </Vertical_Layout>
          {fieldErrors.name && <ErrorMsg> {fieldErrors.name}</ErrorMsg>}
          <Horizontal_Layout>
            <FormSubmitButton isLoading={status === PrivateCollectionStatus.UPDATE_LABEL_SUBMIT || status === PrivateCollectionStatus.CREATE_LABEL_SUBMIT}>
              {status === PrivateCollectionStatus.CREATING_LABEL || status === PrivateCollectionStatus.CREATE_LABEL_SUBMIT ? 'Create' : 'Update'}
            </FormSubmitButton>
            <FormCancelButton onClick={cancelEditSession}>
              Cancel
            </FormCancelButton>
          </Horizontal_Layout>
        </Vertical_Layout>
      </form>
    </td>
  );
};

export default LabelEditComponent;