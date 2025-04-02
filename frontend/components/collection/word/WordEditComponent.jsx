'use client';
import { useState } from 'react';
import Card from '@/components/Card';
import FormSubmitButton from '@/components/buttons/FormSubmitButton';
import FormCancelButton from '@/components/buttons/FormCancelButton';
import Horizontal_Layout from '@/components/Horizontal_Layout';
import Vertical_Layout from '@/components/Vertical_Layout';
import ErrorMsg from '@/components/msg/ErrorMsg';

import { useCollection } from '@/context/collection/CollectionContext';
import { PrivateCollectionStatus } from '@/context/collection/types/status/PrivateCollectionStatus';
import { updateWordRequest } from '@/api/word/UpdateWord';
import { createWordRequest } from '@/api/word/CreateWord';


const WordEditComponent = () => {
    const {
        status,
        viewingWordIdx,
        words,
        id,
        createWord,
        updateWord,
        cancelEditSession,
        createWordSubmit,
        startCreateWordSession
    } = useCollection();
    const [name, setName] = useState(status === PrivateCollectionStatus.UPDATING_WORD ? words[viewingWordIdx].name : '');
    const [description, setDescription] = useState(status === PrivateCollectionStatus.UPDATING_WORD ? words[viewingWordIdx].description : '');
    const [imagePath, setImagePath] = useState(status === PrivateCollectionStatus.UPDATING_WORD ? words[viewingWordIdx].image : '');
    const [fieldErrors, setFieldErrors] = useState({})

    const handleUpsert = async (e) => {
        e.preventDefault();
        setFieldErrors({})
        if (status === PrivateCollectionStatus.CREATING_WORD) {
            createWordSubmit();
            const word= {name,description,imagePath};
            const [createdWord,error] = await createWordRequest(id,word);
            if (error){
                if (error.invalidArguments) {
                    const errors = {};
                    error.invalidArguments.forEach((error) => {
                        if (!errors[error.path]) {
                            errors[error.path] = error.msg; // Store only the first error for each field
                        }
                    });
                    setFieldErrors(errors);
                    startCreateWordSession();
                }
            }
            else{
                createWord(createdWord)
            }
        }
        else if (status === PrivateCollectionStatus.UPDATING_WORD) {
            const word={...words[viewingWordIdx], name, description, imagePath};
            updateWord(word)
            updateWordRequest(id,word)
        }
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
                title={status === PrivateCollectionStatus.CREATING_WORD || status === PrivateCollectionStatus.CREATE_WORD_SUBMIT ? 'Create new word' : 'Update word'}
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
                        required
                        onChange={handleNameChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg w-full p-2.5"
                        placeholder="Enter word name"
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
{/* 
                <Vertical_Layout spacing='space-y-1'>
                    <label className=" text-sm font-medium text-gray-900">
                        Image
                    </label>
                    <input type="file"
                        className="w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" 
                    />
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                    <ErrorMsg>{fieldErrors.image}</ErrorMsg>


                </Vertical_Layout> */}



                    <Horizontal_Layout extraStyle='items-center'>
                        <FormCancelButton onClick={cancelEditSession}>
                            Cancel
                        </FormCancelButton>
                        <FormSubmitButton isLoading={status === PrivateCollectionStatus.CREATE_WORD_SUBMIT}>
                            {status === PrivateCollectionStatus.CREATING_WORD || status === PrivateCollectionStatus.CREATE_WORD_SUBMIT ? 'Create' : 'Update'}
                        </FormSubmitButton>
                    </Horizontal_Layout>
            </Card>
        </form>
    );
};

export default WordEditComponent;