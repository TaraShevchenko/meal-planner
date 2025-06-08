'use client'

import { useState } from 'react'

import { Button } from 'shared/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'shared/ui/Dialog'
import { Input } from 'shared/ui/Input'
import { Text } from 'shared/ui/Text'

import { useUnplannedMeals } from '../../index'

Text

interface CreateUnplannedMealFormProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateUnplannedMealForm({ isOpen, onClose }: CreateUnplannedMealFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
    })
    const { create } = useUnplannedMeals()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await create.mutate(formData)
            setFormData({
                name: '',
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
            })
            onClose()
        } catch (error) {
            console.error('Error creating unplanned meal:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        <Text text="Add Quick Food" variant="subtitle" className="text-white" />
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Name"
                        inputFieldProps={{
                            placeholder: 'Enter food name...',
                            value: formData.name,
                            onChange: (e) => handleInputChange('name', e.target.value),
                            required: true,
                        }}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Calories"
                            inputFieldProps={{
                                type: 'number',
                                placeholder: '0',
                                value: formData.calories,
                                onChange: (e) => handleInputChange('calories', Number(e.target.value)),
                                min: 0,
                            }}
                        />

                        <Input
                            label="Protein (g)"
                            inputFieldProps={{
                                type: 'number',
                                step: '0.1',
                                placeholder: '0',
                                value: formData.protein,
                                onChange: (e) => handleInputChange('protein', Number(e.target.value)),
                                min: 0,
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Fat (g)"
                            inputFieldProps={{
                                type: 'number',
                                step: '0.1',
                                placeholder: '0',
                                value: formData.fat,
                                onChange: (e) => handleInputChange('fat', Number(e.target.value)),
                                min: 0,
                            }}
                        />

                        <Input
                            label="Carbs (g)"
                            inputFieldProps={{
                                type: 'number',
                                step: '0.1',
                                placeholder: '0',
                                value: formData.carbs,
                                onChange: (e) => handleInputChange('carbs', Number(e.target.value)),
                                min: 0,
                            }}
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            text="Cancel"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            text="Add Food"
                            disabled={isSubmitting || !formData.name.trim()}
                            className="flex-1"
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
