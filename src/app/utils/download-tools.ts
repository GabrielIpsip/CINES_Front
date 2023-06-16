export class DownloadTools {
  static downloadFile(fileName: string, fileUrl: string) {
    const link = document.createElement('a');
    link.download = fileName;
    link.target = '_blank';
    link.href = fileUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
