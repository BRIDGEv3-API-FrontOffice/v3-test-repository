import algoliasearch from 'algoliasearch/dist/algoliasearch.min.js';
import placesAutocompleteDataset from 'places.js/index.js';
import { debounce } from 'lodash';
const objectAssign = require('object-assign');

class PlacesDataset {
    constructor(config = {}) {
        this.config = objectAssign({
            header: '',
            footer: '',
            suggestion: '',
            options: {}
        }, config);
    }

    getDataset() {
        const ds = placesAutocompleteDataset(
            objectAssign({
                algoliasearch: algoliasearch,
                templates: {
                    header: ({ query }) => {
                        if (this.config.header) {
                            return this.replaceInTemplate(this.config.header, { query });
                        }

                        return null;
                    },
                    footer: ({ query }) => {
                        if (this.config.footer) {
                            return this.replaceInTemplate(this.config.footer, { query });
                        }

                        return null;
                    },
                    suggestion: (suggestion) => {
                        if (this.config.suggestion) {
                            const variables = {
                                name: suggestion.highlight.name,
                                country: suggestion.highlight.country,
                                administrative: suggestion.highlight.administrative,
                                postalCode: suggestion.postcode
                            };

                            return this.replaceInTemplate(this.config.suggestion, variables);
                        }

                        return null;
                    },
                    value: (suggestion) => {
                        return suggestion.name;
                    }
                }
            }, this.config.options)
        );

        ds.source = debounce(ds.source, this.config.debounceDuration);

        return ds;
    }

    replaceInTemplate(template, variables = {}) {
        return template.replace(/\{(\w+)\}/g, (string, key) => {
            return variables[key] || '';
        });
    }
}

export default PlacesDataset;
