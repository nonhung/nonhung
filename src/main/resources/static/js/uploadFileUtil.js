
var uploadFileUtil = {
  getFileSuffix(fileUrl) {
    if (fileUrl) {
      return fileUrl.substring(fileUrl.lastIndexOf('.') + 1).toLowerCase();
    } else {
      return '';
    }
  },
  isImg(fileUrl) {
    let suffix = this.getFileSuffix(fileUrl);
    return suffix === 'png' ||
      suffix === 'jpg' ||
      suffix === 'gif' ||
      suffix === 'jpeg' ||
      suffix === 'bmp' ||
      suffix === 'pic';
  },
  isVideo(fileUrl) {
    let suffix = this.getFileSuffix(fileUrl);
    return suffix === 'mp4' ||
      suffix === 'avi' ||
      suffix === 'mpeg4' ||
      suffix === 'rmvb' ||
      suffix === 'mkv' ||
      suffix === 'mov' ||
      suffix === 'f4v';
  },
  suffix(fileUrl) {
    let suffix = this.getFileSuffix(fileUrl);
    switch (suffix) {
      case 'png':
        return 'png';
      case 'doc':
        return 'docx_win';
      case 'docx':
        return 'docx_win';
      case 'xls':
        return 'xlsx_win';
      case 'xlsx':
        return 'xlsx_win';
      case 'ppt':
        return 'pptx_mac';
      case 'pptx':
        return 'pptx_mac';
      case 'zip':
        return 'zip';
      case 'rar':
        return 'rar';
      case 'gif':
        return 'gif';
      case 'bmp':
        return 'bmp';
      case 'jpeg':
        return 'jpeg';
      case 'txt':
        return 'text';
      case 'pdf':
        return 'pdf';
      case 'mp4' || 'avi' || 'mpeg4' || 'rmvb' || 'mkv' || 'mov' || 'f4v':
        return 'mpeg';
      default:
        return 'file';
    }
  }
};