// Accept maps for react-dropzone / file inputs. Lives outside the component file so
// Fast Refresh and lint rules treat the component file as components-only.
export const ALLOWED_ATTACHMENTS = {
  IMAGES: {
    "image/*": [".png", ".jpg", ".jpeg"],
  },
  VIDEOS: {
    "video/*": [".mp4", ".webm"],
  },
  DOCUMENTS: {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-excel": [".xls"],
    "text/csv": [".csv"],
    "application/csv": [".csv"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  },
  DOCX: {
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  },
  PDF: {
    "application/pdf": [".pdf"],
  },
  AUDIO: {
    "audio/*": [".mp3", ".wav"],
  },
  EXCEL: {
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "text/csv": [".csv"],
    "application/csv": [".csv"],
  },
}
