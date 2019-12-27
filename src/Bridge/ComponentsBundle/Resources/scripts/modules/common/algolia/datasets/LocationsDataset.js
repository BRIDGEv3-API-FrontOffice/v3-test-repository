import autocomplete from 'algolia-autocomplete.js/dist/autocomplete.js';
import { debounce } from 'lodash';
const objectAssign = require('object-assign');

class LocationsDataset {
    constructor(config = {}) {
        if ('object' !== typeof config.index || config.index === '') {
            throw new Error('Index must be an algoliasearch object');
        }

        this.index = config.index;
        delete config.index;

        this.config = objectAssign({
            header: '',
            footer: '',
            suggestion: '',
            options: {}
        }, config);
    }

    getDataset() {
        return {
            source: debounce(autocomplete.sources.hits(
                this.index,
                objectAssign({ filters: 'active=1 AND hasStoreLocatorPage = 1' }, this.config.options)
            ), this.config.debounceDuration),
            name: 'locations',
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
                            name: suggestion._highlightResult.name.value,
                            city: suggestion.localisation.city.name,
                            country: suggestion.localisation.country.name,
                            postalCode: suggestion.localisation.postalCode
                        };

                        return this.replaceInTemplate(this.config.suggestion, variables);
                    }

                    return null;
                }
            }
        };
    }

    replaceInTemplate(template, variables = {}) {
        return template.replace(/\{(\w+)\}/g, (string, key) => {
            return variables[key] || '';
        });
    }
}

export default LocationsDataset;
