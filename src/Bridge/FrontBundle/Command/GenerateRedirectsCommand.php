<?php
// src/Bridge/FrontBundle/Command/GenerateRedirectsCommand.php
namespace Bridge\FrontBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOExceptionInterface;
use Symfony\Component\Yaml\Yaml;
use Bridge\FrontBundle\DataObject\Redirection;

class GenerateRedirectsCommand extends Command
{
    private const YAML_FILE_NAME = 'app/config/redirects.yml';

    private $useRawUrls = false;

    private $override = false;

    public function setUseRawUrls($useRawUrls)
    {
        $this->useRawUrls = $useRawUrls;
    }

    public function setOverride($override)
    {
        $this->override = $override;
    }

    protected function configure()
    {
        $this
        ->setName('generate-redirects')

        //arguments
        ->addArgument('csv-path', InputArgument::REQUIRED, 'The input csv file (with ; separator).')

        //options
        ->addOption('override', 'o', InputOption::VALUE_NONE, 'Completely rewrites the redirects.yml file, overriding all redirects')
        ->addOption('output', null, InputOption::VALUE_REQUIRED, 'Output YAML file path', self::YAML_FILE_NAME)
        ->addOption('raw-urls', 'r', InputOption::VALUE_NONE, 'Do not perform urldecode on source & target urls')

        ->setDescription('Generate redirects in a redirect.yml file for this Front. A csv file is needed')

        // the "--help" option description
        ->setHelp('This command allows you to generate a redirects.yml file with a given input csv file.');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        // outputs lines
        $output->writeln([
            '<--------------------------------------------',
            '             Redirects Maker                 ',
            '-------------------------------------------->',
        ]);

        $csvFileName = $input->getArgument('csv-path');
        $yamlFileName = $input->getOption('output');

        $this->override = $input->getOption('override');
        $this->useRawUrls = $input->getOption('raw-urls');
        
        $summary = $this->merge($csvFileName, $yamlFileName, $output);

        $output->writeln(['',
            ' Summary',
            "<info>   - {$summary['counter']['nonOverride']} new redirects have been added",
            "   - {$summary['counter']['override']} redirects have been overwritten</info>",
        ]);

        if (!empty($summary['errors'])) {
            $output->writeln(['','   - Some errors have been found:']);
            $output->write('<error>');
            foreach ($summary['errors'] as $err) {
                $output->writeln('   - '.$err);
            }
            $output->write('</error>');
        }
        
        $output->writeln('-------------------------------------------');
    }

    /** Merges content of a CSV file containing redirects into a YAML file
     * @param string $csvFileName input CSV filename
     * @param string $yamlFileName output YAML filename
     * @param OutputInterface $output output stream to display content
     */
    private function merge(string $csvFileName, string $yamlFileName, OutputInterface $output)
    {
        $output->writeln('<comment>CSV Path: '.$csvFileName.'</comment>');
        $output->writeln('<comment>Output Path: '.$yamlFileName.'</comment>');

        $summary = [
            'counter' => ['override' => 0, 'nonOverride' => 0],
            'errors' => []
        ];

        $output->writeln(['',
            ' Retrieving csv Data...',
        ]);
        
        try {
            $importedRedirects = $this::fromCsvFile($csvFileName);
            $newRedirects = $importedRedirects['result'];
            $summary['errors'] = $importedRedirects['errors'];

            $output->writeln(['',
                ' Generating Yaml File with Data...',
            ]);

            $existing = [];

            if (!$this->override) {
                $existing = $this::fromYamlFile($yamlFileName);
            }

            foreach ($newRedirects as $url => $redirection) {
                $counter = 'nonOverride';
                if (array_key_exists($url, $existing)) {
                    $counter = 'override';
                }
                $summary['counter'][$counter]++;
                $existing[$url] = $redirection;
            }

            $allRedirects = [];
            $redirectNumber=0;
            foreach ($existing as $redirection) {
                $allRedirects[(string)++$redirectNumber] = $redirection->getYamlArrayOutput();
            }
            $yamlStr = Yaml::dump($allRedirects, Yaml::DUMP_OBJECT_AS_MAP);

            try {
                $yamlFile = fopen($yamlFileName, 'w');
                fwrite($yamlFile, $yamlStr);
                return $summary;
            } finally {
                fclose($yamlFile);
            }
        } catch (Exception $e) {
            $output->write($e);
        }
    }

    private function fromCsvFile(string $csvFileName)
    {
        $fileSystem = new Filesystem();
        $fileExist = $fileSystem->exists($csvFileName);
        $result = [];
        $errors = [];

        if (!$fileExist) {
            throw new \Exception('File not found at '.$csvFileName);
        }

        try {
            $file = fopen($csvFileName, "r");
            if ($file === false) {
                throw new \Exception('An error occured when opening the file at ' . $csvFileName);
            }
            // ignore first line (column headers)
            fgetcsv($file, 1024, ';');
            $line = 1;
            while ($tab = fgetcsv($file, 1024, ';')) {
                $line++;
                $columns = count($tab);
                if (3 !== $columns) {
                    throw new \Exception('CSV syntax error at line ' . $line . ' in ' . $csvFileName);
                }
                $fromUrl = $tab[0];
                $redirectUrl = $tab[1];
                $permanent = $tab[2];
                if (empty(trim($fromUrl)) || empty(trim($redirectUrl))) {
                    $errors[] = "Line $line: Missing \"From\" or \"To\" value";
                    continue;
                }
                if (!$this->useRawUrls) {
                    $fromUrl = urldecode($fromUrl);
                    $redirectUrl = urldecode($redirectUrl);
                }
                $redirection = new Redirection($fromUrl, $redirectUrl, $permanent);
                $result[$redirection->getFromUrl()] = $redirection;
            }
            return ['result' => $result, 'errors' => $errors];
        } finally {
            fclose($file);
        }
    }

    private function fromYamlFile(string $yamlFileName)
    {
        $result = [];
        $fileSystem = new Filesystem();
        $fileExist = $fileSystem->exists($yamlFileName);
        if (!$fileExist) {
            throw new \Exception('File not found at '.$yamlFileName);
        }
        $content = file_get_contents($yamlFileName);
        $yamlResult = Yaml::parse($content);
        //file not empty ?
        if ($yamlResult !== null) {
            foreach ($yamlResult as $yaml) {
                $redirection = new Redirection(
                    $yaml['path'],
                    $yaml['defaults']['path'],
                    $yaml['defaults']['permanent']
                );
                $result[$redirection->getFromUrl()] = $redirection;
            }
        }
        return $result;
    }
}
