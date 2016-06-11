import { configure } from '@kadira/storybook';

function loadStories() {
    require('../stories/table');
}

configure(loadStories, module);