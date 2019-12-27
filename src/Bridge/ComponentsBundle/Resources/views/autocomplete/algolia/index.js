import Component from '@components/scripts/base/Component';
import autocomplete from 'algolia-autocomplete.js/dist/autocomplete.js';
import algoliasearch from 'algoliasearch/dist/algoliasearch.min.js';
import DatasetFactory from '@components/scripts/modules/common/algolia/DatasetFactory';

const objectAssign = require('object-assign');

class AutocompleteAlgolia extends Component {
    getDefaultAttributes() {
        return {
            datasets: {},
            autocomplete: {
                autoselect: false,
                autoselectOnBlur: false,
                hint: false,
                debug: false,
                openOnFocus: false,
                minLength: 3,
                debounceDuration: 500,
                cssClasses: {
                    root: 'lf-autocomplete-algolia',
                    prefix: 'lf-autocomplete-algolia'
                }
            }
        };
    }

    init() {
        this.inputQuery = this.el.querySelector('[data-lf-search-query]');
        this.buttonSubmit = this.el.querySelector('[data-lf-autocomplete-submit]');

        if (this.inputQuery) {
            const index = algoliasearch(this.attr.api.algoliaApplicationId, this.attr.api.algoliaApiKey).initIndex(this.attr.algoliaIndexName);
            const autocompleteDatasets = this.createDatasets(this.attr.datasets, index);

            const autocompleteSelector = this.el.querySelector('[data-lf-autocomplete]');
            if (autocompleteSelector) {
                autocompleteSelector.parentNode.removeChild(autocompleteSelector);
            }
            this.dataset = autocompleteDatasets;
            autocomplete(this.inputQuery, this.attr.autocomplete, autocompleteDatasets)
                .on('autocomplete:selected', this.onSelected.bind(this));
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        this.inputQuery.form.submit();
    }

    createDatasets(datasets, index) {
        return Object.keys(datasets).map((dataset) => {
            const suggestionEl = this.el.querySelector(`[data-lf-autocomplete-${dataset}-suggestion]`);

            if (!suggestionEl) {
                throw new Error(`Missing element [data-lf-autocomplete-${dataset}-suggestion] in template`);
            }

            const config = objectAssign({
                index: index,
                debounceDuration: this.attr.autocomplete.debounceDuration,
                suggestion: suggestionEl.outerHTML,
                footer: dataset === 'places' && this.buttonSubmit ? this.buttonSubmit.outerHTML : null
            }, datasets[dataset]);

            return DatasetFactory.build(dataset, config);
        }, []);
    }

    onSelected(event, suggestion, datasetName) {
        event.preventDefault();
        if (datasetName === 'locations') {
            window.location.replace(`/${suggestion.seoId}-${suggestion.slug}`);
        } else if (datasetName === 'places') {
            this.inputQuery.setAttribute('data-lf-search-query-value', suggestion.name);
            this.el.querySelector('[data-lf-search-latitude]').value = suggestion.latlng.lat || '';
            this.el.querySelector('[data-lf-search-longitude]').value = suggestion.latlng.lng || '';
            this.inputQuery.form.submit();
        }
    }
}

export default AutocompleteAlgolia;
