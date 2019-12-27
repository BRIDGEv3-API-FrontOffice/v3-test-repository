import datasets from './datasets';

class DatasetFactory {
    static build(key, config) { // eslint-disable-line consistent-return
        if (key in datasets) {
            return new datasets[key](config).getDataset();
        }
    }
}

export default DatasetFactory;
