import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Chip, FormHelperText } from '@material-ui/core';
import { Controller } from 'react-hook-form';

const weekdays = [
    { id: 2, label: 'Thứ 2' },
    { id: 3, label: 'Thứ 3' },
    { id: 4, label: 'Thứ 4' },
    { id: 5, label: 'Thứ 5' },
    { id: 6, label: 'Thứ 6' },
    { id: 7, label: 'Thứ 7' }
];

// const useStyles = makeStyles(theme => ({
//     formControl: {
//         margin: theme.spacing(1),
//         minWidth: 200,
//     }
//     }));

export default function SelectWeekdays({errors, control}) {
    // const classes = useStyles();

    return (
        <FormControl fullWidth error={!!errors.days}>
            <InputLabel id="select-weekdays-label" >
                Ngày
            </InputLabel>
            <Controller
                as={<Select
                        multiple
                        input={<Input id="select-weekdays"/>}
                        renderValue={selected => (selected.map(value => (
                            <Chip key={value+7} label={value} color='primary' size='small' />
                        )))}
                        // value={selected}
                        // onChange={e => {                    
                        //     setSelected(e.target.value)
                        //     if (e.target.value.length > 0) clearError('days')}
                        // }                        
                        // inputProps={{
                        //     inputRef: ref => {
                        //         if(!ref) return;
                        //         register({name: "days", value: ref.value})
                        //     }
                        // }}   
                    >                   
                        {weekdays.map(d => (
                            <MenuItem key={d.id} value={d.id}>
                                {d.label}
                            </MenuItem>
                        ))}
                    </Select>}
                name="days"
                control={control}
            />
            <FormHelperText>{errors.days?.message}</FormHelperText>
        </FormControl>
    );
}