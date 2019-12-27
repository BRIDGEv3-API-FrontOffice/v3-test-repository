<?php

namespace Tests\Bridge\FrontBundle\Command;

use Bridge\FrontBundle\Command\GenerateRedirectsCommand;
use Bridge\FrontBundle\DataObject\Redirection;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Tester\CommandTester;
use Tests\Bridge\FrontBundle\AccessibleTrait;

class GenerateRedirectsCommandTest extends KernelTestCase
{
    use AccessibleTrait;

    protected function setUp()
    {
        $this->mockOutput = $this->createMock(ConsoleOutput::class);
        $this->mockGoodCsvFile = 'tests/Bridge/FrontBundle/Command/templates/goodCsvFile.csv';
        $this->mockBadCsvStruct = 'tests/Bridge/FrontBundle/Command/templates/badCsvStruct.csv';
        $this->mockBadCsvImport = 'tests/Bridge/FrontBundle/Command/templates/badCsvImport.csv';
        $this->mockYamlFile = 'tests/Bridge/FrontBundle/Command/templates/ymlFile.yml';
        $this->mockEmptyYamlFile = 'tests/Bridge/FrontBundle/Command/templates/emptyYmlFile.yml';
        $this->mockURLEncodedCsvFile = 'tests/Bridge/FrontBundle/Command/templates/URLEncodedCsv.csv';
        $this->mockURLNonEncodedCsvFile = 'tests/Bridge/FrontBundle/Command/templates/URLNonEncodedCsv.csv';

        $this->command = new GenerateRedirectsCommand();
    }

    protected function tearDown()
    {
        parent::tearDown();
        self::emptyFile($this->mockEmptyYamlFile);
    }

    private static function emptyFile($fileName)
    {
        try {
            $f = fopen($fileName, "r+");
            ftruncate($f, 0);
        } finally {
            fclose($f);
        }
    }

    public function testExecute()
    {
        $kernel = $this->createKernel();
        $kernel->boot();
        $application = new Application($kernel);
        $application->add(new GenerateRedirectsCommand());
        $command = $application->find('generate-redirects');
        $commandTester = new CommandTester($command);

        $commandTester->execute(array(
            'command' => $command->getName(),
            'csv-path' => $this->mockGoodCsvFile,
            '--override' => '1',
            '--output' => $this->mockEmptyYamlFile,
        ));
        self::emptyFile($this->mockEmptyYamlFile);
        $output = $commandTester->getDisplay();
        $this->assertContains('- 4 new redirects have been added', $output);
        $this->assertContains('- 0 redirects have been overwritten', $output);
        
        $commandTester->execute(array(
            'command' => $command->getName(),
            'csv-path' => $this->mockBadCsvImport,
            '--override' => '1',
            '--output' => $this->mockEmptyYamlFile,
        ));
        self::emptyFile($this->mockEmptyYamlFile);
        $output = $commandTester->getDisplay();
        $this->assertContains('- 3 new redirects have been added', $output);
        $this->assertContains('- 0 redirects have been overwritten', $output);
        $this->assertContains('- Some errors have been found:', $output);
        $this->assertContains('Line 3: Missing "From" or "To" value', $output);


        $this->expectExceptionMessage("CSV syntax error at line 3 in {$this->mockBadCsvStruct}");
        $output = $commandTester->execute(array(
            'command' => $command->getName(),
            'csv-path' => $this->mockBadCsvStruct,
            '--override' => '1',
            '--output' => $this->mockEmptyYamlFile,
        ));
        self::emptyFile($this->mockEmptyYamlFile);
    }

    public function testFromCsvFile()
    {
        //regular CSV
        $csvFile = $this->mockGoodCsvFile;
        $redirects = $this->invokePrivateMethod('fromCsvFile', $csvFile, false);
        $this->assertEquals(
            [
                '/from1' => new Redirection("/from1", "/to1", true),
                '/from2' => new Redirection("/from2", "/to2", false),
                '/from3' => new Redirection("/from3", "/to3", true),
                '/from4' => new Redirection("/from4", "/to4", true)
            ],
            $redirects['result']
        );
        
        //regular CSV with encoded URLs - keep raw option
        $csvFile = $this->mockURLEncodedCsvFile;
        $this->invokePrivateMethod('setUseRawUrls', true);
        $redirects = $this->invokePrivateMethod('fromCsvFile', $csvFile, true);
        $this->assertEquals(
            ['/from1%20string' => new Redirection("/from1%20string", "/to1%20string", true)], $redirects['result']
        );

        //regular CSV with encoded URLs - encode
        $csvFile = $this->mockURLEncodedCsvFile;
        $this->invokePrivateMethod('setUseRawUrls', false);
        $expected = ['/from1 string' => new Redirection("/from1 string", "/to1 string", true)];
        $redirects = $this->invokePrivateMethod('fromCsvFile', $csvFile, false);
        $this->assertEquals($expected, $redirects['result']);

        //regular CSV with non-encoded URLS - keep raw option
        $csvFile = $this->mockURLNonEncodedCsvFile;
        $this->invokePrivateMethod('setUseRawUrls', true);
        $redirects = $this->invokePrivateMethod('fromCsvFile', $csvFile, true);
        $this->assertEquals($expected, $redirects['result']);

        //CSV with bad line
        $csvFile = $this->mockBadCsvStruct;
        $this->expectExceptionMessage("CSV syntax error at line 3 in {$this->mockBadCsvStruct}");
        $this->invokePrivateMethod('fromCsvFile', $csvFile, false);

        //non existent CSV
        $csvFile = 'lqysgd77897z/random/path/to/unexistent/file.csv';
        $this->expectExceptionMessage("File not found at {$csvFile}");
        $this->invokePrivateMethod('fromCsvFile', $csvFile, $output, false);

    }

    public function testFromYamlFile()
    {
        $ymlFile = $this->mockYamlFile;
        $redirects = $this->invokePrivateMethod('fromYamlFile', $ymlFile);
        $this->assertEquals(
            [
                '/from1' => new Redirection("/from1", "/to1", true),
                '/from2' => new Redirection("/from2", "/to2", false),
                '/from3' => new Redirection("/from3", "/to3", true),
                '/from4' => new Redirection("/from4", "/to4", true)
            ],
            $redirects
        );

        $emptyFile = $this->mockEmptyYamlFile;
        $redirects = $this->invokePrivateMethod('fromYamlFile', $emptyFile);
        $this->assertEquals(
            [],
            $redirects
        );

        $ymlFile = 'lqysgd77897z/random/path/to/unexistent/file.yml';
        $this->expectExceptionMessage("File not found at {$ymlFile}");
        $this->invokePrivateMethod('fromYamlFile', $ymlFile);
    }

    public function testMerge()
    {
        $output = $this->mockOutput;

        //empty YAML append with good input
        $this->invokePrivateMethod('setOverride', false);
        $summary = $this->invokePrivateMethod('merge', $this->mockGoodCsvFile, $this->mockEmptyYamlFile, $output, false);
        self::emptyFile($this->mockEmptyYamlFile);
        $this->assertEquals($summary['counter']['nonOverride'], 4);
        $this->assertEquals($summary['counter']['override'], 0);
        self::emptyFile($this->mockEmptyYamlFile);

        //empty YAML append with bad input
        $this->invokePrivateMethod('setOverride', false);
        $summary = $this->invokePrivateMethod('merge', $this->mockBadCsvImport, $this->mockEmptyYamlFile, $output, false);
        self::emptyFile($this->mockEmptyYamlFile);
        $this->assertEquals($summary['counter']['nonOverride'], 3);
        $this->assertEquals($summary['counter']['override'], 0);
        $this->assertContains('Line 3: Missing "From" or "To" value', $summary['errors']);
        self::emptyFile($this->mockEmptyYamlFile);

        //YAML append with good input
        $this->invokePrivateMethod('setOverride', false);
        $summary = $this->invokePrivateMethod('merge', $this->mockGoodCsvFile, $this->mockYamlFile, $output, false);
        $this->assertEquals($summary['counter']['nonOverride'], 0);
        $this->assertEquals($summary['counter']['override'], 4);

        //YAML rewrite with good input
        $this->invokePrivateMethod('setOverride', true);
        $summary = $this->invokePrivateMethod('merge', $this->mockGoodCsvFile, $this->mockYamlFile, $output, true);
        $this->assertEquals($summary['counter']['nonOverride'], 4);
        $this->assertEquals($summary['counter']['override'], 0);

        //empty YAML append with misformed CSV
        $this->invokePrivateMethod('setOverride', false);
        $this->expectExceptionMessage("CSV syntax error at line 3 in {$this->mockBadCsvStruct}");
        $this->invokePrivateMethod('merge', $this->mockBadCsvStruct, $this->mockEmptyYamlFile, $output, false);
        self::emptyFile($this->mockEmptyYamlFile);
    }
  
    public function getTestSubject()
    {
        return $this->command;
    }
    
}
