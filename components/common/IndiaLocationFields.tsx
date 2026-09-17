"use client";

import {
    ChevronDown,
} from "lucide-react";

import {
    indiaLocations,
    indianStates,
} from "@/lib/indiaLocations";


type Props = {
    state: string;
    city: string;

    onStateChange:
    (value: string) => void;

    onCityChange:
    (value: string) => void;
};


export default function IndiaLocationFields({
    state,
    city,
    onStateChange,
    onCityChange,
}: Props) {
    const baseCities =
        state
            ? indiaLocations[state] || []
            : [];

    const cities =
        city &&
            !baseCities.includes(city)
            ? [city, ...baseCities]
            : baseCities;


    function handleStateChange(
        value: string
    ) {
        onStateChange(value);

        // Reset city because
        // old city may belong to
        // another state.
        onCityChange("");
    }


    return (
        <>
            <SelectField
                label="State"
                value={state}
                placeholder="Select state"
                options={
                    indianStates
                }
                onChange={
                    handleStateChange
                }
            />


            <SelectField
                label="City"
                value={city}
                placeholder={
                    state
                        ? "Select city"
                        : "Select state first"
                }
                options={cities}
                disabled={!state}
                onChange={
                    onCityChange
                }
            />
        </>
    );
}


type SelectFieldProps = {
    label: string;
    value: string;
    placeholder: string;
    options: string[];
    disabled?: boolean;

    onChange:
    (value: string) => void;
};


function SelectField({
    label,
    value,
    placeholder,
    options,
    disabled = false,
    onChange,
}: SelectFieldProps) {
    return (
        <div>

            <label className="mb-2 block text-[8px] font-semibold tracking-[0.15em] text-black/40 uppercase">
                {label}
            </label>


            <div className="relative">

                <select
                    required
                    disabled={
                        disabled
                    }
                    value={value}
                    onChange={(
                        event
                    ) =>
                        onChange(
                            event.target.value
                        )
                    }
                    className="h-12 w-full appearance-none border border-black/10 bg-[var(--ostren-off-white)] px-4 pr-10 text-[11px] text-[#111111] outline-none transition focus:border-black disabled:cursor-not-allowed disabled:text-black/30"
                >

                    <option value="">
                        {placeholder}
                    </option>


                    {options.map(
                        (option) => (
                            <option
                                key={
                                    option
                                }
                                value={
                                    option
                                }
                            >
                                {option}
                            </option>
                        )
                    )}

                </select>


                <ChevronDown
                    size={13}
                    strokeWidth={1.4}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black/45"
                />

            </div>

        </div>
    );
}