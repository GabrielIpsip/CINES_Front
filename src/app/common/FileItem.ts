export class FileItem {

  static readonly AVAILABLE_FILE_TYPE = '.png, .jpg, .jpeg, .svg, .gif, .tif, .tiff, .webp, .pdf, .docx, .xlsx, .odt, .csv, .ods, .txt, .pptx';

  name: string;
  url: string;

  static getIconName(fileName: string): string {
    const imgExtension = ['.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP', '.TIF', '.TIFF'];
    const pdfExtension = ['.PDF'];
    const docExtension = ['.DOCX', '.ODT', '.TXT', '.PPTX', '.ODP'];
    const spreadSheetExtension = ['.XLSX', '.ODS', '.CSV'];

    for (const extension of imgExtension) {
      if (fileName.toUpperCase().endsWith(extension)) {
        return 'image';
      }
    }

    for (const extension of pdfExtension) {
      if (fileName.toUpperCase().endsWith(extension)) {
        return 'picture_as_pdf';
      }
    }

    for (const extension of docExtension) {
      if (fileName.toUpperCase().endsWith(extension)) {
        return 'description';
      }
    }

    for (const extension of spreadSheetExtension) {
      if (fileName.toUpperCase().endsWith(extension)) {
        return 'table_chart';
      }
    }

    return 'insert_drive_file';
  }
}