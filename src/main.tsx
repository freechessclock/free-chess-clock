import { render } from 'preact'
import App from './app'
import './index.css'

import "./i18n";

render(<App />, document.getElementById('app') as HTMLElement)
