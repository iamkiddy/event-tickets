/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from 'react'
import { ComboboxCountryInput } from './PhoneCombobox'
import { registerLocale } from "i18n-iso-countries"
import enCountries from "i18n-iso-countries/langs/en.json"
import PhoneInput, { type Country } from "react-phone-number-input/input"
import {
    type CountryCallingCode,
    type E164Number,
    getExampleNumber,
    parsePhoneNumber,
  } from "libphonenumber-js"
import examples from "libphonenumber-js/mobile/examples"
import { getCountriesOptions, isoToEmoji, replaceNumbersWithZeros } from './helpers';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils'

type CountryOption = {
    value: Country
    label: string
    indicatif: CountryCallingCode
}

registerLocale(enCountries)

interface PhoneInputProps{
    name: string,
    label?: string,
    className?: string,
    phoneValue?: string,
    onChange?: (value: string) => void,
    disabled?: boolean,
    required?: boolean,
    field?: Record<string, any>
}

export default function PhoneNumberField({
    name, label, className, field, phoneValue, onChange, disabled, required
}: PhoneInputProps) {
    const options = getCountriesOptions()
    const defaultCountry = parsePhoneNumber("+23300000000")?.country 

    const defaultCountryOption = options?.find(
        (option) => option.value === defaultCountry,
    )
    
    const [country, setCountry] = useState<CountryOption>(
        defaultCountryOption || options?.[0],
    )
    const [phoneNumber, setPhoneNumber] = useState<E164Number>(phoneValue as E164Number)
    
    const placeholder = replaceNumbersWithZeros(
        getExampleNumber(country?.value, examples)?.formatInternational() || '',
    )
    
    const onCountryChange = (value: CountryOption) => {
        setPhoneNumber('' as E164Number)
        setCountry(value)
    }

  return (
    <div className={cn(
        'w-full flex flex-col items-start',
        className
    )}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="w-full flex gap-2">
            <ComboboxCountryInput
                value={country ?? {}}
                onValueChange={onCountryChange}
                options={options || []}
                placeholder="Find your country..."
                renderOption={({ option }) =>
                `${isoToEmoji(option.value)} ${option.label}`
                }
                renderValue={(option) => option.label}
                emptyMessage="No country found."
            />
            <PhoneInput
                international
                withCountryCallingCode
                country={(country.value.toUpperCase()) as Country || ''}
                value={phoneNumber}
                inputComponent={Input}
                placeholder={placeholder}
                onChange={(value) => {
                    setPhoneNumber(value as E164Number)
                    onChange?.(phoneNumber?.toString())
                }}
                className="rounded-md h-[45px] w-full"
                name={name}
                disabled={disabled}
                required={required}
                {...field}
            />
        </div>
    </div>
    
  )
}
