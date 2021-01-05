import React, { useState } from 'react';
import VisibleComponent from "./visibleComponent";
import './testStyles.css';

const test = "This component can be used for: "
var kx=3;

//

// @ts-ignore
document.getElementById("componentExplanation").addEventListener('click', fadeOutEffect)
// @ts-ignore
document.getElementById("componentExplanation").addEventListener('click', fadeOutEffect2)

function fadeOutEffect() {
    var fadeTarget = document.getElementById("componentExplanation");
    var fadeEffect = setInterval(function () {
        // @ts-ignore
        if (!fadeTarget.style.opacity) {
            // @ts-ignore
                   fadeTarget.style.opacity = String(1);
        }
        // @ts-ignore
        if (fadeTarget.style.opacity > 0) {
            // @ts-ignore
          //     fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 30);

}
function fadeOutEffect2() {
    var fadeTarget = document.getElementById("root");
    var fadeEffect = setInterval(function () {
        // @ts-ignore
        if (!fadeTarget.style.opacity) {
            // @ts-ignore
                 fadeTarget.style.opacity = String(1);
        }
        // @ts-ignore
        if (fadeTarget.style.opacity > 0) {
            // @ts-ignore
              //  fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 30);

}

type MyProps = {};
type MyState = {
    clicks : number
};
class ComponentExplanation extends React.Component<MyProps,MyState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            clicks: 0
        }
    }
    mounted=false;
    clix=0;
    componentWillUnmount() {

        this.mounted=false;
    }


    componentDidMount(): void {
        console.log("Child mounted")
    }

    handleClick() {
        console.log("CLICKED!!!!" + this.mounted)
        if (this.mounted) {
            this.clix = this.clix + 1;
            // @ts-ignore
            this.state.clicks = this.clix;
            console.log("Clix: " + this.clix);
        //    clicks: this.clicks + 1
          //  this.setState((prevState) => ({
          //      clicks: prevState.clicks + 1
         //   }));
            this.forceUpdate();
        }
    }


    render () {
        return (
          <div>
            {test}
            <ul>
                <li>User porftolio breakdowns</li>
                <li>Institutional ownership summaries</li>
            </ul>
              <div id="button1" onClick={this.handleClick.bind(this)}>Next component + {this.state.clicks}</div>
        </div>
      )
    }


}
export default ComponentExplanation