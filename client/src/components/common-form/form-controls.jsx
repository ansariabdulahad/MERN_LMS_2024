import React from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const FormControls = ({ formControls = [], formData, setFormData }) => {

    const renderComponentByType = (getControlItem) => {

        let element = null;
        let currentControlItemValue = formData[getControlItem.name] || '';

        // handle on change value
        const handleOnChange = (event) => {
            setFormData({
                ...formData,
                [getControlItem.name]: event.target.value
            });
        }

        switch (getControlItem.componentType) {
            case "input":
                element = <Input
                    id={getControlItem.name}
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    type={getControlItem.type}
                    value={currentControlItemValue}
                    onChange={handleOnChange}
                />
                break;

            case "select":
                element = <Select
                    onValueChange={(value) => setFormData({
                        ...formData,
                        [getControlItem.name]: value
                    })}
                    value={currentControlItemValue}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={getControlItem.label} />
                    </SelectTrigger>

                    <SelectContent>
                        {
                            getControlItem.options && getControlItem.options.length > 0 &&
                            getControlItem.options.map((optionItem) => (
                                <SelectItem
                                    key={optionItem.id}
                                    value={optionItem.id}
                                >
                                    {optionItem.label}
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
                break;

            case "textarea":
                element = <Textarea
                    id={getControlItem.name}
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    value={currentControlItemValue}
                    onChange={handleOnChange}
                />
                break;

            default:
                element = <Input
                    id={getControlItem.name}
                    name={getControlItem.name}
                    placeholder={getControlItem.placeholder}
                    type={getControlItem.type}
                    value={currentControlItemValue}
                    onChange={handleOnChange}
                />
                break;
        };

        return element;
    }

    return (
        <div className='flex flex-col gap-3'>
            {
                formControls.map((controlItem) => (
                    <div
                        key={controlItem.name}
                    >
                        <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
                        {
                            renderComponentByType(controlItem)
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default FormControls