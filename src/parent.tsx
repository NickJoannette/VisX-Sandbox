import React, { useState } from 'react';
import VisibleComponent from "./visibleComponent";
import './testStyles.css';
import ComponentExplanation from "./componentExplanation";




type ParentProps = {};

type ParentState = {CE : ComponentExplanation}

class Parent extends React.Component<ParentProps,ParentState> {

    constructor(props: {} | Readonly<{}>) {
        super(props);
        this.state = {CE: new ComponentExplanation(0)}
    }

    componentDidMount(): void {
        console.log("Parent mounted")
        this.state.CE.mounted = true;
    }

    render(){
        return (
            this.state.CE.render()
        )
    }
}

export default Parent