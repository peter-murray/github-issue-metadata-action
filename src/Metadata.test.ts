import { describe, expect, it } from 'vitest';
import { Metadata } from './Metadata.js';

const SINGLE_LONG_DATA = `
### >>demo-repository-owner<<

octodemo

### >>template-type<<

repository

### >>template-owner<<

octodemo-resources

### >>template-repo<<

tmpl_copilot_nodejs_basic_v1.5

<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d31"} -->
`;

const MULTIPLE_DIFFERENT_METADATA = `
### >>demo-repository-owner<<

octodemo

### >>template-type<<

repository

### >>template-owner<<

octodemo-resources

### >>template-repo<<

tmpl_copilot_nodejs_basic_v1.5

<!-- other abc-->

<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d31"} -->

### Some other text

<!-- bootstrap-abc {"deployment_id": ""} -->
`;

const MULTIPLE_LONG_DATA = `
### >>demo-repository-owner<<

octodemo

### >>template-type<<

repository

### >>template-owner<<

octodemo-resources

### >>template-repo<<

tmpl_copilot_nodejs_basic_v1.5

<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d31"} -->
<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d32"} -->
<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d33"} -->
<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d34"} -->
<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d35"} -->
<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d36"} -->
<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d37"} -->
<!-- bootstrap {"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d38"} -->
`;


describe('Metadata', () => {

  describe('#getMetadata()', () => {

    const metadata = new Metadata();

    it('should parse a single entry value', () => {
      const result = metadata.getMetadata('<!-- bootstrap {"deployment_id": "1234", "uuid": "abcd"} -->');
      expect(result).toBe('{"deployment_id": "1234", "uuid": "abcd"}');
    });

    it('should parse a long single entry value', () => {
      const result = metadata.getMetadata(SINGLE_LONG_DATA);
      expect(result).toBe('{"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d31"}');
    });

    it('should parse a long multiple entry value', () => {
      const result = metadata.getMetadata(MULTIPLE_LONG_DATA);
      expect(result).toBe('{"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d38"}');
    });
  });

  describe('#replaceOrAddMetadata()', () => {

    const metadata = new Metadata();

    it ('should add when no existing metadata present', () => {
      const content = `# My amazing issue\nThe issue content goes here`
      const newMetadata = '{"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d31"}';
      const newContent = metadata.replaceOrAddMetadata(content, newMetadata);

      expect(newContent).toBe(`${content}\n<!-- bootstrap ${newMetadata} -->`);
    });

    it ('should replace all previous instances when multiple metadata present', () => {
      const oldMetadata = '<!-- bootstrap {"deployment_id":"abc123","uuid":"7f077916"} -->';
      const baseContent = `# My amazing issue\nThe issue content goes here`;

      const content = `${baseContent}\n${oldMetadata}\n${oldMetadata}\n<!-- bootstrap abc -->\n`;

      const newMetadata = '{"deployment_id":"1685065576","uuid":"7f077916-65ca-5536-9df4-ced98b415d31"}';
      const newContent = metadata.replaceOrAddMetadata(content, newMetadata);

      expect(newContent).toBe(`${baseContent}\n\n\n\n\n<!-- bootstrap ${newMetadata} -->`);
    });

    it('should work with long data that has mixed metadata', () => {
      const newMetadata = '{"deployment_id":"001"}';
      const newContent = metadata.replaceOrAddMetadata(MULTIPLE_DIFFERENT_METADATA, newMetadata);

      expect(newContent).toContain(`<!-- bootstrap ${newMetadata} -->`);
      // Do touch the other metadata
      expect(newContent).toContain('<!-- bootstrap-abc {"deployment_id": ""} -->')

      // The old meta data entry deployment_id should be replaced
      expect(newContent).not.toContain('1685065576');
    });
  });
});