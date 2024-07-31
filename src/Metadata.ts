export class Metadata {

  private marker: string;

  constructor(marker: string = 'bootstrap') {
    this.marker = marker;
  }

  get matcher() {
    return new RegExp(`<!-- ${this.marker} (.*) -->$`, 'gm');
  }

  getMetadata(issueBody: string): string | undefined {
    const results = this.getAllMatchedData(issueBody);
    // If the metadata appears multiple times, we only consider the last one as valid
    return results.pop();
  }

  getAllMatchedStrings(content: string) {
    const matched = Array.from(content.matchAll(this.matcher));
    return matched.map((match) => { return match[0]; });
  }

  getAllMatchedData(content: string) {
    const matched = Array.from(content.matchAll(this.matcher));
    return matched.map((match) => { return match[1]; });
  }

  addMetadata(content: string, newData: string): string {
    const newContent = `<!-- ${this.marker} ${newData} -->`;
    return `${content}\n${newContent}`;
  }

  replaceOrAddMetadata(content: string, newData: string): string {
    const newContent = `<!-- ${this.marker} ${newData} -->`;

    // If there are multiple occurances, calling this will remove all matches so that there is only
    // one metadata entry in the content
    let filtered = content.replaceAll(this.matcher, '');

    return `${filtered}\n${newContent}`;
  }
}