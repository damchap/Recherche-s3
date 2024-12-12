import React from 'react';
import { TreeSelect } from 'antd';
const { SHOW_PARENT } = TreeSelect;

const AuthorSelect = ({value, setValue, treeData}) => {

    const onChange = (newValue) => {
        setValue(newValue);
    };

    return <TreeSelect showCheckedStrategy={SHOW_PARENT} value={value} showSearch treeCheckable treeData={treeData} placeholder="Please select" style={{ width: "100%" }} onChange={onChange}/>;
};
export default AuthorSelect;