import FormCancelButton from "@/components/buttonss/FormCancelButton";
import FormSubmitButton from "@/components/buttonss/FormSubmitButton";
import Horizontal_Layout from "@/components/Horizontal_Layout";
import ErrorMsg from "@/components/msgg/ErrorMsg";
import Vertical_Layout from "@/components/Vertical_Layout";
import { useCollection } from "@/context/CollectionContext";
import { useState } from "react";

const LabelEditComponent = () => {
  const { labels, editingLabelIdx, updateLabel, createLabel, cancelEditSession, id, status } = useCollection();
  const [name, setName] = useState(status == 'updatingLabel' ? labels[editingLabelIdx].name : '');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleUpsert = async (e) => {
    e.preventDefault();
    if (status === 'creatingLabel') {
      const data = await createLabel(`/api/protected/collections/${id}/labels`, name);
      if (data?.errors) {
        const errors = {};
        data.errors.forEach((error) => {
          if (!errors[error.path]) {
            errors[error.path] = error.msg; // Store only the first error for each field
          }
        });
        setFieldErrors(errors);
      }
    }
    else if (status === 'updatingLabel') updateLabel(`/api/protected/collections/${id}/labels/${labels[editingLabelIdx].id}`, name);
    else console.error("No status supported now for:", status)
  };

  const handleNameChange = (e) => {
    const input = e.target.value;

    // Validate the input for name length
    if (input.length > 50) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name cannot exceed 50 characters',
      }));
    } else {
      setFieldErrors((prevErrors) => {
        const { name, ...rest } = prevErrors; // Remove the name error if it exists
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
            <FormSubmitButton isLoading={status === 'createLabelLoading' || status === 'updateLabelLoading'}>
              {status === 'creatingLabel' || status === 'createLabelLoading' ? 'Create' : 'Update'}
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