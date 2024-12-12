import { Slider } from "antd";

const AnimationSlider = ({animationOnChangeComplete}) => {

    const marks = {
        2010 : '⃓',
        2011 : '⃓',
        2012 : '⃓',
        2013 : '⃓',
        2014 : '⃓',
        2015 : '⃓',
        2016 : '⃓',
        2017 : '⃓',
        2018 : '⃓',
        2019 : '⃓',
        2020 : '⃓',
        2021 : '⃓',
        2022 : '⃓',
        2023 : '⃓',
        2024 : '⃓',
    };

    return (
        <Slider step={null} marks={marks} defaultValue={2024} min={2010} max={2024} onChangeComplete={animationOnChangeComplete} style={{width: '400px'}}/>
    );
};

export default AnimationSlider;