/**
 * Demo entry point.
 *
 * Nothing here is Salesforce-specific: `createElement` from the LWC engine is the same bootstrap a
 * Lightning page performs for `c-flow`, so the components under test are the deployable ones.
 */

import { createElement } from 'lwc';
import App from 'demo/app';

const root = document.getElementById('root');

root.textContent = '';
root.appendChild(createElement('demo-app', { is: App }));
