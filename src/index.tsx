import React from 'react';
import { render } from 'react-dom';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

import Example from './Pie';
import './index.css';

render(
    <Example width={600} height={600} />,
    document.getElementById('root'),
);
