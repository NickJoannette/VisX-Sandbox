import React, {FunctionComponent } from 'react';
import { render } from 'react-dom';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import App from './App';
import VisibleComponent from './visibleComponent';
import ComponentExplanation from './componentExplanation';
import Parent from './parent';
import styles from './mystyle.module.css';

import { animated, useTransition, interpolate } from 'react-spring';
import Pie, { ProvidedProps, PieArcDatum } from '@visx/shape/lib/shapes/Pie';
import { scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { GradientPinkBlue } from '@visx/gradient';
import letterFrequency, { LetterFrequency } from '@visx/mock-data/lib/mocks/letterFrequency';
import browserUsage, { BrowserUsage as Browsers } from '@visx/mock-data/lib/mocks/browserUsage';


var slide = 0;

// data and types
type BrowserNames = keyof Browsers;

interface BrowserUsage {
    label: BrowserNames;
    usage: number;
}

const letters: LetterFrequency[] = letterFrequency.slice(0, 4);
const browserNames = Object.keys(browserUsage[0]).filter(k => k !== 'date') as BrowserNames[];
const browsers: BrowserUsage[] = browserNames.map(name => ({
    label: name,
    usage: Number(browserUsage[0][name]),
}));

// accessor functions
const usage = (d: BrowserUsage) => d.usage;
const frequency = (d: LetterFrequency) => d.frequency;

// color scales
const getBrowserColor = scaleOrdinal({
    domain: browserNames,
    range: [
        'rgba(234,235,255,0.7)',
        'rgba(234,235,255,0.6)',
        'rgba(234,235,255,0.5)',
        'rgba(234,235,255,0.4)',
        'rgba(234,235,255,0.3)',
        'rgba(234,235,255,0.2)',
        'rgba(234,235,255,0.1)',
    ],
});
const getLetterFrequencyColor = scaleOrdinal({
    domain: letters.map(l => l.letter),
    range: ['rgba(60,69,93,0.9)', 'rgba(60,69,93,0.8)', 'rgba(60,69,93,0.6)', 'rgba(60,69,93,0.4)'],
});

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export type PieProps = {
    width: number;
    height: number;
    margin?: typeof defaultMargin;
    animate?: boolean;
};

export default function Example({
                                    width,
                                    height,
                                    margin = defaultMargin,
                                    animate = true,
                                }: PieProps) {
    const [selectedBrowser, setSelectedBrowser] = React.useState<string | null>(null);
    const [selectedAlphabetLetter, setSelectedAlphabetLetter] =  React.useState<string | null>(null);

    if (width < 10) return null;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const centerY = innerHeight / 2;
    const centerX = innerWidth / 2;
    const donutThickness = 50;

    return (
        <svg width={width} height={height}>
            <GradientPinkBlue id="visx-pie-gradient" />
            <rect rx={14} width={width} height={height} fill='rgba(0,0,0,1.0)' />
            <Group top={centerY + margin.top} left={centerX + margin.left}>
                <Pie
                    data={
                        selectedBrowser ? browsers.filter(({ label }) => label === selectedBrowser) : browsers
                    }
                    pieValue={usage}
                    outerRadius={radius}
                    innerRadius={radius - donutThickness}
                    cornerRadius={3}
                    padAngle={0.005}
                >
                    {pie => (
                        <AnimatedPie<BrowserUsage>
                            {...pie}
                            animate={animate}
                            getKey={arc => arc.data.label}
                            onClickDatum={({ data: { label } }) =>
                                animate &&
                                setSelectedBrowser(selectedBrowser && selectedBrowser === label ? null : label)
                            }
                            getColor={arc => getBrowserColor(arc.data.label)}
                        />
                    )}
                </Pie>
                <Pie
                    data={
                        selectedAlphabetLetter
                            ? letters.filter(({ letter }) => letter === selectedAlphabetLetter)
                            : letters
                    }
                    pieValue={frequency}
                    pieSortValues={() => -1}
                    outerRadius={radius - donutThickness * 1.3}
                >
                    {pie => (
                        <AnimatedPie<LetterFrequency>
                            {...pie}
                            animate={animate}
                            getKey={({ data: { letter } }) => letter}
                            onClickDatum={({ data: { letter } }) =>
                                animate &&
                                setSelectedAlphabetLetter(
                                    selectedAlphabetLetter && selectedAlphabetLetter === letter ? null : letter,
                                )
                            }
                            getColor={({ data: { letter } }) => getLetterFrequencyColor(letter)}
                        />
                    )}
                </Pie>
            </Group>
            {animate && (
                <text
                    textAnchor="end"
                    x={width - 16}
                    y={height - 16}
                    fill="white"
                    fontSize={11}
                    fontWeight={300}
                    pointerEvents="none"
                >
                    Portfolio View
                </text>
            )}
        </svg>
    );
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
    // enter from 360° if end angle is > 180°
    startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
    endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
    opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
    startAngle,
    endAngle,
    opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
    animate?: boolean;
    getKey: (d: PieArcDatum<Datum>) => string;
    getColor: (d: PieArcDatum<Datum>) => string;
    onClickDatum: (d: PieArcDatum<Datum>) => void;
    delay?: number;
};

function AnimatedPie<Datum>({
                                animate,
                                arcs,
                                path,
                                getKey,
                                getColor,
                                onClickDatum,
                            }: AnimatedPieProps<Datum>) {
    const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(
        arcs,
        getKey,
        // @ts-ignore react-spring doesn't like this overload
        {
            from: animate ? fromLeaveTransition : enterUpdateTransition,
            enter: enterUpdateTransition,
            update: enterUpdateTransition,
            leave: animate ? fromLeaveTransition : enterUpdateTransition,
        },
    );
    return (
        <>
            {transitions.map(
                ({
                     item: arc,
                     props,
                     key,
                 }: {
                    item: PieArcDatum<Datum>;
                    props: AnimatedStyles;
                    key: string;
                }) => {
                    const [centroidX, centroidY] = path.centroid(arc);
                    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

                    return (
                        <g key={key}>
                            <animated.path
                                // compute interpolated path d attribute from intermediate angle values
                                d={interpolate([props.startAngle, props.endAngle], (startAngle, endAngle) =>
                                    path({
                                        ...arc,
                                        startAngle,
                                        endAngle,
                                    }),
                                )}
                                fill={getColor(arc)}
                                onClick={() => onClickDatum(arc)}
                                onTouchStart={() => onClickDatum(arc)}
                            />
                            {hasSpaceForLabel && (
                                <animated.g style={{ opacity: props.opacity }}>
                                    <text
                                        fill="white"
                                        x={centroidX}
                                        y={centroidY}
                                        dy=".33em"
                                        fontSize={11}
                                        textAnchor="middle"
                                        pointerEvents="none"
                                    >
                                        {getKey(arc)}
                                    </text>
                                </animated.g>
                            )}
                        </g>
                    );
                },
            )}
        </>
    );
}


type CardProps = {
    title: string,
    paragraph: string
}
// the clock's state has one field: The current time, based upon the
// JavaScript class Date
type ClockState = {
    input: string
    time: Date
}

// Clock has no properties, but the current state is of type ClockState
// The generic parameters in the Component typing allow to pass props
// and state. Since we don't have props, we pass an empty object.
export class Clock extends React.Component<{}, ClockState> {

    // The tick function sets the current state. TypeScript will let us know
    // which ones we are allowed to set.
    tick() {
        this.setState({
            time: new Date()
        });
    }

    // Before the component mounts, we initialise our state
    componentWillMount() {
        this.tick();
    }

    // After the component did mount, we set the state each second.
    componentDidMount() {
        setInterval(() => this.tick(), 1000);
    }

    // render will know everything!
    render() {
        return <p>The current time is {this.state.time.toLocaleTimeString()}</p>
    }
}

// we can use children even though we haven't defined them in our CardProps
export const Card: FunctionComponent<CardProps> = ({ title, paragraph, children }) => <aside>
    <h2>{ title }</h2>
    <p>
        { paragraph }
    </p>
    { children }
</aside>

const el = <Card title="Welcome!" paragraph="To this example" />









type NoticeProps = {
    msg: string
}

export class Notice extends React.Component<NoticeProps> {

    constructor(props: NoticeProps) {
        super(props)
    }

    static defaultProps = {
        msg: 'Hello everyone!'
    }

    render() {
        return <p>{ this.props.msg }</p>
    }
}

const noticeEl = <Notice /> // Will compile in TS 3.0






type WrapperProps = {
    clockEl : Clock
}

export class Wrapper extends React.Component {


    render() {
        return <div style={ { display: 'flex' } }>
            { this.props.children }
        </div>
    }
}

const pieEl = <Example width={900} height={900}/>
export class Button extends React.Component<{},{clicks:number}> {
    constructor(props: {} | Readonly<{}>){
        super(props);
        this.state = {
            clicks: 0
        }
    }

    handleClick(event: MouseEvent) {
        event.preventDefault();

        this.setState((prevState) => ({
            // @ts-ignore
            clicks: prevState.clicks + 1
              }));

        //this.setState({clicks:this.state.clicks+1 })
        //alert(event.currentTarget.tagName); // alerts BUTTON
    }

    render(){
        const mystyle = {
            color: "white",
            backgroundColor: "DodgerBlue",
            padding: "10px",
            fontFamily: "Arial"
        };
        return (

            <div>
                <div style={{float:"left"}}>
                    {true ? <Example width={500} height={500}/> : null}
                </div>
                <div style={{float:"left"}}>
                    <button className={styles.button1}
                        // @ts-ignore
                            onClick={this.handleClick.bind(this)}>
                        <h2>Button1 + {this.state.clicks}</h2>
                    </button>
                </div>

            </div>
        )
        // @ts-ignore
      /*  return (<button id="button1" onClick={this.handleClick.bind(this)}>
            <h2>Button1 + {this.state.clicks}</h2>
        </button>
        )*/
    }
}




render (<Button />,document.getElementById('wrap'))

// Nothing should be rendered!
/*
console.log("Clicks")
render(<Parent />,document.getElementById('root'))
*/