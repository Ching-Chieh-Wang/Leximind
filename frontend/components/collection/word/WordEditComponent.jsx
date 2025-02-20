'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import FormSubmitButton from '@/components/buttons/FormSubmitButton';
import FormCancelButton from '@/components/buttons/FormCancelButton';
import { useCollection } from '@/context/CollectionContext';
import Horizontal_Layout from '@/components/Horizontal_Layout';
import Vertical_Layout from '@/components/Vertical_Layout';
import ErrorMsg from '@/components/msg/ErrorMsg';

const WordEditComponent = () => {
    const {
        status,
        viewingWordIdx,
        words,
        id,
        createWord,
        updateWord,
        cancelEditSession,
    } = useCollection();
    const [name, setName] = useState(status === 'updatingWord' ? words[viewingWordIdx].name : '');
    const [description, setDescription] = useState(status === 'updatingWord' ? words[viewingWordIdx].description : '');
    const [imagePath, setImagePath] = useState(status === 'updatingWord' ? words[viewingWordIdx].image : '');
    const [fieldErrors, setFieldErrors] = useState({})

    const handleUpsert = async (e) => {
        e.preventDefault();
        setFieldErrors({})
        if (status === 'creatingWord') {
            const data = await createWord(`/api/protected/collections/${id}/words`, name, description, imagePath||'')
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
        else if (status === 'updatingWord') updateWord(`/api/protected/collections/${id}/words/${words[viewingWordIdx].id}`, name, description, imagePath||'')
        else {
            console.error('status not found', status)
            return
        }
        
    };

    const handleNameChange = (e) => {
        const input = e.target.value;

        // Validate the input for name length
        if (input.length > 100) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Name cannot exceed 100 characters',
            }));
        } else {
            setFieldErrors((prevErrors) => {
                const { name, ...rest } = prevErrors; // Remove the name error if it exists
                return rest;
            });
            setName(input);
        }
    };

    const handleDescriptionChange = (e) => {
        const input = e.target.value;

        // Validate the input for description length
        if (input.length > 500) {
            setFieldErrors((prevErrors) => ({
                ...prevErrors,
                description: 'Description cannot exceed 500 characters',
            }));
        } else {
            setFieldErrors((prevErrors) => {
                const { description, ...rest } = prevErrors; // Remove the description error if it exists
                return rest;
            });
            setDescription(input);
        }
    };
    const handleImageChange = () => {
        return null
    }

    return (
        <form onSubmit={handleUpsert}>
            <Card
                type="card"
                title={status === 'creatingWord' || status === 'createWordLoading' ? 'Create new word' : 'Update word'}
            >
                {fieldErrors.general && <ErrorMsg>{fieldErrors.general}</ErrorMsg>}
                {/* Name Input */}
                <Vertical_Layout spacing='space-y-1'>
                    <label className="block  text-sm font-medium text-gray-900">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                        placeholder="Enter word name"
                        required
                        autoComplete="on"
                        autoFocus="on"
                    />
                    <ErrorMsg>{fieldErrors.name}</ErrorMsg>

                </Vertical_Layout>

                {/* Description Input */}
                <Vertical_Layout spacing='space-y-1'>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium  text-gray-900"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows="2"
                        value={description}
                        onChange={handleDescriptionChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg h-24 w-full p-2.5"
                        placeholder="Enter word description"
                        required
                    ></textarea>
                    <ErrorMsg>{fieldErrors.description}</ErrorMsg>
                </Vertical_Layout>

                <Vertical_Layout spacing='space-y-1'>
                    <label className=" text-sm font-medium text-gray-900">
                        Image
                    </label>
                    <input type="file"
                        className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" 
                    />
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                    <ErrorMsg>{fieldErrors.image}</ErrorMsg>


                </Vertical_Layout>



                    <Horizontal_Layout extraStyle='items-center'>
                        <FormCancelButton onClick={cancelEditSession}>
                            Cancel
                        </FormCancelButton>
                        <FormSubmitButton isLoading={status === 'createWordLoading'}>
                            {status === 'creatingWord' || status === 'createWordLoading' ? 'Create' : 'Update'}
                        </FormSubmitButton>
                    </Horizontal_Layout>
            </Card>
        </form>
    );
};

export default WordEditComponent;